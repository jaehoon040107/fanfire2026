'use client';

import type {
  Comment,
  CountryAccuracy,
  PredictionRatio,
  User,
} from '@/types';
import { getSupabase, isSupabaseLive } from './supabase';
import { countryName } from './countries';

// ─────────────────────────────────────────────────────────
// 중앙 데이터 계층.
// 모든 Supabase 읽기/쓰기를 여기로 모은다.
// - live 모드(키 존재): 실제 Supabase 호출
// - mock 모드: no-op 또는 null 반환 → 호출부가 mock 데이터로 폴백
// 컴포넌트는 이 계층만 호출하므로 mock/live 분기를 신경 쓸 필요 없음.
// ─────────────────────────────────────────────────────────

/** 'global' 센티넬 ↔ DB null 매핑. */
const toDbMatchId = (matchId: string | null | undefined) =>
  !matchId || matchId === 'global' ? null : matchId;
const fromDbMatchId = (matchId: string | null) => matchId ?? 'global';

// ── 유저 ──────────────────────────────────────────────────
/**
 * 유저 생성. live 모드면 users 테이블에 insert 하고 DB가 발급한 uuid 를 id 로 사용.
 * (댓글/예측의 user_id FK·uuid 타입과 정합) 실패하거나 mock 이면 로컬 문자열 id.
 */
export async function createUser(
  nickname: string,
  countryCode: string,
): Promise<User> {
  const local: User = {
    id: `u-${cryptoSafeId(nickname + countryCode)}`,
    nickname,
    countryCode,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseLive) return local;
  const supabase = getSupabase();
  if (!supabase) return local;

  const { data, error } = await supabase
    .from('users')
    .insert({ nickname, country_code: countryCode })
    .select('id, created_at')
    .single();

  if (error || !data) {
    console.error('[db.createUser] falling back to local id:', error);
    return local;
  }
  return {
    id: data.id,
    nickname,
    countryCode,
    createdAt: data.created_at,
  };
}

// ── 댓글 ──────────────────────────────────────────────────
/** 기존 댓글 히스토리 로드 (live 전용). mock 이면 빈 배열 → 호출부가 seed 사용. */
export async function fetchComments(matchId?: string): Promise<Comment[]> {
  if (!isSupabaseLive) return [];
  const supabase = getSupabase();
  if (!supabase) return [];

  let q = supabase
    .from('comments')
    .select('id, user_id, match_id, nickname, country_code, body, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  const dbMatch = toDbMatchId(matchId);
  if (matchId) {
    // 경기 전용 피드: 해당 match_id 만. (글로벌 피드는 matchId 미지정 → 전체)
    q = dbMatch ? q.eq('match_id', dbMatch) : q.is('match_id', null);
  }

  const { data, error } = await q;
  if (error || !data) {
    console.error('[db.fetchComments]', error);
    return [];
  }
  const comments = data.map(rowToComment);

  // 각 댓글의 반응 수 집계해서 병합 (전부 0으로 보이지 않도록).
  const ids = comments.map((c) => c.id);
  if (ids.length > 0) {
    const { data: rx } = await supabase
      .from('comment_reactions')
      .select('comment_id, reaction_type')
      .in('comment_id', ids);
    if (rx) {
      const byComment = new Map<string, Record<string, number>>();
      for (const row of rx) {
        const m = byComment.get(row.comment_id) ?? {};
        m[row.reaction_type] = (m[row.reaction_type] ?? 0) + 1;
        byComment.set(row.comment_id, m);
      }
      for (const c of comments) {
        const counts = byComment.get(c.id);
        if (counts) c.reactions = counts as Comment['reactions'];
      }
    }
  }
  return comments;
}

/** 댓글 저장 (live 전용). 반환된 행으로 로컬 id 를 DB uuid 와 정합. */
export async function insertComment(c: {
  userId: string;
  matchId: string;
  nickname: string;
  countryCode: string;
  body: string;
}): Promise<Comment | null> {
  if (!isSupabaseLive) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: c.userId,
      match_id: toDbMatchId(c.matchId),
      nickname: c.nickname,
      country_code: c.countryCode,
      body: c.body,
    })
    .select('id, user_id, match_id, nickname, country_code, body, created_at')
    .single();

  if (error || !data) {
    console.error('[db.insertComment]', error);
    return null;
  }
  return rowToComment(data);
}

// ── 예측 ──────────────────────────────────────────────────
/** 승부예측 저장/갱신 (live 전용, upsert). */
export async function savePrediction(p: {
  userId: string;
  matchId: string;
  countryCode: string;
  predictedWinner: string;
  predictedScore?: { home: number; away: number } | null;
}): Promise<void> {
  if (!isSupabaseLive) return;
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from('predictions').upsert(
    {
      user_id: p.userId,
      match_id: p.matchId,
      country_code: p.countryCode,
      predicted_winner: p.predictedWinner,
      predicted_score: p.predictedScore ?? null,
    },
    { onConflict: 'user_id,match_id' },
  );
  if (error) console.error('[db.savePrediction]', error);
}

/** 하프타임 미니 예측 저장/갱신 (live 전용, upsert). */
export async function saveHalftime(h: {
  userId: string;
  matchId: string;
  questionId: string;
  answer: string;
}): Promise<void> {
  if (!isSupabaseLive) return;
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from('halftime_predictions').upsert(
    {
      user_id: h.userId,
      match_id: h.matchId,
      question_id: h.questionId,
      answer: h.answer,
    },
    { onConflict: 'user_id,match_id,question_id' },
  );
  if (error) console.error('[db.saveHalftime]', error);
}

// ── 댓글 반응 ─────────────────────────────────────────────
/** 댓글 반응 토글 저장 (live 전용). added=true → insert, false → delete. */
export async function setReaction(r: {
  commentId: string;
  userId: string;
  matchId: string;
  countryCode: string;
  type: string;
  added: boolean;
}): Promise<void> {
  if (!isSupabaseLive) return;
  const supabase = getSupabase();
  if (!supabase) return;

  if (r.added) {
    const { error } = await supabase.from('comment_reactions').upsert(
      {
        comment_id: r.commentId,
        user_id: r.userId,
        match_id: toDbMatchId(r.matchId),
        country_code: r.countryCode,
        reaction_type: r.type,
      },
      { onConflict: 'comment_id,user_id,reaction_type' },
    );
    if (error) console.error('[db.setReaction:add]', error);
  } else {
    const { error } = await supabase
      .from('comment_reactions')
      .delete()
      .eq('comment_id', r.commentId)
      .eq('user_id', r.userId)
      .eq('reaction_type', r.type);
    if (error) console.error('[db.setReaction:remove]', error);
  }
}

// ── 집계 (실데이터) ───────────────────────────────────────
/**
 * 글로벌 예측 비율 — predictions 를 winner 별로 집계.
 * 데이터가 없으면 null → 호출부가 mock(seededRandom)으로 폴백.
 */
export async function fetchPredictionRatio(
  matchId: string,
  homeCode: string,
  awayCode: string,
): Promise<PredictionRatio | null> {
  if (!isSupabaseLive) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('predictions')
    .select('predicted_winner')
    .eq('match_id', matchId);

  if (error || !data || data.length === 0) return null;

  let home = 0;
  let draw = 0;
  let away = 0;
  for (const row of data) {
    if (row.predicted_winner === 'draw') draw++;
    else if (row.predicted_winner === homeCode) home++;
    else if (row.predicted_winner === awayCode) away++;
  }
  const total = data.length;
  return {
    matchId,
    home: Math.round((home / total) * 100),
    draw: Math.round((draw / total) * 100),
    away: Math.round((away / total) * 100),
    totalVotes: total,
  };
}

/**
 * 국가별 온도계 — comment_reactions 를 국가별로 집계, 최댓값=100° 로 정규화.
 * 데이터 없으면 null → mock 폴백.
 */
export async function fetchCountryHeat(
  matchId: string,
): Promise<{ countryCode: string; heat: number }[] | null> {
  if (!isSupabaseLive) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('comment_reactions')
    .select('country_code')
    .eq('match_id', matchId);

  if (error || !data || data.length === 0) return null;

  const counts = new Map<string, number>();
  for (const row of data) {
    if (!row.country_code) continue;
    counts.set(row.country_code, (counts.get(row.country_code) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  const max = Math.max(...Array.from(counts.values()));
  return Array.from(counts.entries())
    .map(([countryCode, n]) => ({
      countryCode,
      heat: Math.round((n / max) * 100),
    }))
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 6);
}

/**
 * 국가별 예측 정확도 랭킹 — 끝난 경기의 실제 결과와 예측을 대조.
 * actualWinners: matchId → 실제 승자(팀코드 또는 'draw').
 * 끝난 경기 예측이 없으면 null → mock 폴백.
 */
export async function fetchCountryAccuracy(
  actualWinners: Record<string, string>,
): Promise<CountryAccuracy[] | null> {
  if (!isSupabaseLive) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const finishedIds = Object.keys(actualWinners);
  if (finishedIds.length === 0) return null;

  const { data, error } = await supabase
    .from('predictions')
    .select('match_id, predicted_winner, country_code')
    .in('match_id', finishedIds);

  if (error || !data || data.length === 0) return null;

  const agg = new Map<string, { correct: number; total: number }>();
  for (const row of data) {
    const actual = actualWinners[row.match_id];
    if (!actual || !row.country_code) continue;
    const cur = agg.get(row.country_code) ?? { correct: 0, total: 0 };
    cur.total++;
    if (row.predicted_winner === actual) cur.correct++;
    agg.set(row.country_code, cur);
  }
  if (agg.size === 0) return null;

  const rows: CountryAccuracy[] = Array.from(agg.entries())
    .map(([countryCode, { correct, total }]) => ({
      countryCode,
      countryName: countryName(countryCode),
      accuracy: Math.round((correct / total) * 1000) / 10,
      totalPredictions: total,
      rank: 0,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

// ── 내부 헬퍼 ─────────────────────────────────────────────
function rowToComment(r: any): Comment {
  return {
    id: r.id,
    userId: r.user_id,
    matchId: fromDbMatchId(r.match_id),
    nickname: r.nickname,
    countryCode: r.country_code,
    body: r.body,
    createdAt: r.created_at,
    reactions: {},
  };
}

/** 결정적 로컬 id (mock/폴백용). */
function cryptoSafeId(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36) + Date.now().toString(36);
}
