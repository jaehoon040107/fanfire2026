import type { Match, MatchStage, MatchStatus } from '@/types';
import { FOOTBALL_API_ENABLED } from './env';
import { MATCHES } from '@/data/matches';
import { TEAMS } from '@/data/teams';

// ─────────────────────────────────────────────────────────
// football-data.org 연동 (서버 전용).
// 키가 없으면 샘플 시드(MATCHES)를 그대로 반환.
// 실데이터 연동 시 매핑 로직만 살아나도록 스텁을 완비해 둠.
// 문서: https://docs.football-data.org/general/v4/index.html
// ─────────────────────────────────────────────────────────

const BASE = 'https://api.football-data.org/v4';
const WC_COMPETITION = 'WC'; // FIFA World Cup

const STAGE_MAP: Record<string, MatchStage> = {
  GROUP_STAGE: 'group',
  LAST_32: 'round32',
  LAST_16: 'round16',
  QUARTER_FINALS: 'quarter',
  SEMI_FINALS: 'semi',
  FINAL: 'final',
};

const STATUS_MAP: Record<string, MatchStatus> = {
  SCHEDULED: 'scheduled',
  TIMED: 'scheduled',
  IN_PLAY: 'live',
  PAUSED: 'halftime',
  FINISHED: 'finished',
};

function teamFromApi(apiTeam: { tla?: string; name?: string }) {
  const code = apiTeam.tla ?? apiTeam.name?.slice(0, 3).toUpperCase() ?? 'TBD';
  return (
    TEAMS[code] ?? {
      code,
      name: apiTeam.name ?? code,
      shortName: code,
      flag: code.slice(0, 2).toLowerCase(),
    }
  );
}

/** 전체 경기 목록 가져오기. live 모드 + 키 있을 때만 실 API 호출. */
export async function fetchMatches(): Promise<Match[]> {
  if (!FOOTBALL_API_ENABLED) {
    return MATCHES; // mock fallback
  }
  try {
    const res = await fetch(`${BASE}/competitions/${WC_COMPETITION}/matches`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY as string },
      next: { revalidate: 30 }, // 30초 캐시 (라이브 스코어 균형)
    });
    if (!res.ok) throw new Error(`football-data ${res.status}`);
    const data = await res.json();
    return (data.matches ?? []).map(
      (m: any): Match => ({
        id: String(m.id),
        homeTeam: teamFromApi(m.homeTeam ?? {}),
        awayTeam: teamFromApi(m.awayTeam ?? {}),
        homeScore: m.score?.fullTime?.home ?? null,
        awayScore: m.score?.fullTime?.away ?? null,
        stage: STAGE_MAP[m.stage] ?? 'group',
        scheduledAt: m.utcDate,
        status: STATUS_MAP[m.status] ?? 'scheduled',
        minute: m.minute ?? null,
      }),
    );
  } catch (err) {
    console.error('[football-api] falling back to mock:', err);
    return MATCHES;
  }
}
