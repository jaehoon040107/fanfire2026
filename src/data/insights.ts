import type { CountryAccuracy, PredictionRatio } from '@/types';
import { seededRandom } from '@/lib/utils';
import { MATCHES } from './matches';
import { countryName } from '@/lib/countries';

// ─────────────────────────────────────────────────────────
// 호기심 콘텐츠용 집계 mock 데이터.
// 모두 seededRandom 으로 결정적(deterministic) 생성 → 새로고침해도 안정적.
// ─────────────────────────────────────────────────────────

/** 경기별 글로벌 예측 비율 (home/draw/away %). */
export function predictionRatio(matchId: string): PredictionRatio {
  const r1 = seededRandom(matchId + 'h');
  const r2 = seededRandom(matchId + 'a');
  let home = Math.round(20 + r1 * 60); // 20–80
  let draw = Math.round(8 + r2 * 22); // 8–30
  let away = 100 - home - draw;
  if (away < 5) {
    away = 5;
    draw = 100 - home - away;
  }
  const totalVotes = 1200 + Math.round(seededRandom(matchId + 'v') * 48000);
  return { matchId, home, draw, away, totalVotes };
}

/** 국가별 예측 정확도 랭킹 — "예측을 가장 잘 맞춘 나라". */
export function countryAccuracyRanking(): CountryAccuracy[] {
  const codes = ['kr', 'br', 'ar', 'de', 'jp', 'fr', 'es', 'gb', 'ma', 'us', 'nl', 'pt'];
  const rows = codes.map((code) => {
    const acc = 52 + seededRandom(code + 'acc') * 36; // 52–88%
    const total = 300 + Math.round(seededRandom(code + 'tot') * 4000);
    return {
      countryCode: code,
      countryName: countryName(code),
      accuracy: Math.round(acc * 10) / 10,
      totalPredictions: total,
      rank: 0,
    };
  });
  rows.sort((a, b) => b.accuracy - a.accuracy);
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

/** 경기별 국가 온도계 — 반응 버튼 누적 기반 heat (0–100). */
export function countryHeat(matchId: string): { countryCode: string; heat: number }[] {
  const codes = ['kr', 'br', 'ar', 'jp', 'us', 'de', 'gb', 'fr', 'es', 'ma'];
  return codes
    .map((code) => ({
      countryCode: code,
      heat: Math.round(seededRandom(matchId + code) * 100),
    }))
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 6);
}

/** 경기 전후 민심 비교 — 예측 시점 vs 경기 후 감정 분포. */
export function sentimentShift(matchId: string): {
  before: { positive: number; neutral: number; negative: number };
  after: { positive: number; neutral: number; negative: number };
} {
  const b = seededRandom(matchId + 'before');
  const a = seededRandom(matchId + 'after');
  return {
    before: {
      positive: Math.round(40 + b * 30),
      neutral: 20,
      negative: Math.round(10 + (1 - b) * 30),
    },
    after: {
      positive: Math.round(20 + a * 50),
      neutral: 15,
      negative: Math.round(15 + (1 - a) * 40),
    },
  };
}

/** 유저의 픽 희귀도 (%) — 공유 카드용. */
export function pickRarity(matchId: string, winner: string): number {
  const ratio = predictionRatio(matchId);
  const map: Record<string, number> = {
    home: ratio.home,
    draw: ratio.draw,
    away: ratio.away,
  };
  // winner 는 팀코드 또는 'draw'. home/away 매핑.
  const match = MATCHES.find((m) => m.id === matchId);
  if (!match) return 50;
  if (winner === 'draw') return map.draw;
  if (winner === match.homeTeam.code) return map.home;
  return map.away;
}
