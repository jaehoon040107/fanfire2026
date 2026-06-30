import type { Match } from '@/types';
import { TEAMS as T } from './teams';

// ─────────────────────────────────────────────────────────
// 샘플 시드 — 모든 UI 상태를 채우기 위한 대표 경기들.
// LIVE / HALFTIME / SCHEDULED / FINISHED 를 모두 포함한다.
// NEXT_PUBLIC_DATA_MODE=live 일 때 football-api 가 이 시드를 대체.
// 날짜는 기획 트래픽 일정(7월)에 맞춤.
// ─────────────────────────────────────────────────────────

export const MATCHES: Match[] = [
  // ── 32강 (7/4~7/7) — 진행 상태 다양화 ──
  {
    id: 'r32-01',
    homeTeam: T.BRA,
    awayTeam: T.KOR,
    homeScore: 1,
    awayScore: 1,
    stage: 'round32',
    scheduledAt: '2026-07-04T18:00:00Z',
    status: 'live',
    minute: 67,
  },
  {
    id: 'r32-02',
    homeTeam: T.ARG,
    awayTeam: T.AUS,
    homeScore: 0,
    awayScore: 0,
    stage: 'round32',
    scheduledAt: '2026-07-04T21:00:00Z',
    status: 'halftime',
    minute: 45,
  },
  {
    id: 'r32-03',
    homeTeam: T.FRA,
    awayTeam: T.SEN,
    homeScore: null,
    awayScore: null,
    stage: 'round32',
    scheduledAt: '2026-07-05T18:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'r32-04',
    homeTeam: T.ENG,
    awayTeam: T.JPN,
    homeScore: null,
    awayScore: null,
    stage: 'round32',
    scheduledAt: '2026-07-05T21:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'r32-05',
    homeTeam: T.ESP,
    awayTeam: T.MAR,
    homeScore: 2,
    awayScore: 0,
    stage: 'round32',
    scheduledAt: '2026-07-06T18:00:00Z',
    status: 'finished',
  },
  {
    id: 'r32-06',
    homeTeam: T.GER,
    awayTeam: T.USA,
    homeScore: 3,
    awayScore: 1,
    stage: 'round32',
    scheduledAt: '2026-07-06T21:00:00Z',
    status: 'finished',
  },
  {
    id: 'r32-07',
    homeTeam: T.POR,
    awayTeam: T.MEX,
    homeScore: null,
    awayScore: null,
    stage: 'round32',
    scheduledAt: '2026-07-07T18:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'r32-08',
    homeTeam: T.NED,
    awayTeam: T.CRO,
    homeScore: null,
    awayScore: null,
    stage: 'round32',
    scheduledAt: '2026-07-07T21:00:00Z',
    status: 'scheduled',
  },

  // ── 16강 (7/9~7/12) — 일부 확정, 일부 미정(TBD) ──
  {
    id: 'r16-01',
    homeTeam: T.ESP,
    awayTeam: T.GER,
    homeScore: null,
    awayScore: null,
    stage: 'round16',
    scheduledAt: '2026-07-09T20:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'r16-02',
    homeTeam: T.BEL,
    awayTeam: T.URU,
    homeScore: null,
    awayScore: null,
    stage: 'round16',
    scheduledAt: '2026-07-10T20:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'r16-03',
    homeTeam: T.COL,
    awayTeam: T.ITA,
    homeScore: null,
    awayScore: null,
    stage: 'round16',
    scheduledAt: '2026-07-11T20:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'r16-04',
    homeTeam: T.SUI,
    awayTeam: T.DEN,
    homeScore: null,
    awayScore: null,
    stage: 'round16',
    scheduledAt: '2026-07-12T20:00:00Z',
    status: 'scheduled',
  },

  // ── 8강 (7/14~7/17) ──
  {
    id: 'qf-01',
    homeTeam: T.BRA,
    awayTeam: T.ESP,
    homeScore: null,
    awayScore: null,
    stage: 'quarter',
    scheduledAt: '2026-07-14T20:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'qf-02',
    homeTeam: T.ARG,
    awayTeam: T.FRA,
    homeScore: null,
    awayScore: null,
    stage: 'quarter',
    scheduledAt: '2026-07-15T20:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'qf-03',
    homeTeam: T.ENG,
    awayTeam: T.POR,
    homeScore: null,
    awayScore: null,
    stage: 'quarter',
    scheduledAt: '2026-07-16T20:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'qf-04',
    homeTeam: T.NED,
    awayTeam: T.BEL,
    homeScore: null,
    awayScore: null,
    stage: 'quarter',
    scheduledAt: '2026-07-17T20:00:00Z',
    status: 'scheduled',
  },

  // ── 4강 (7/21) ──
  {
    id: 'sf-01',
    homeTeam: T.BRA,
    awayTeam: T.ARG,
    homeScore: null,
    awayScore: null,
    stage: 'semi',
    scheduledAt: '2026-07-21T20:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'sf-02',
    homeTeam: T.ENG,
    awayTeam: T.NED,
    homeScore: null,
    awayScore: null,
    stage: 'semi',
    scheduledAt: '2026-07-21T23:00:00Z',
    status: 'scheduled',
  },

  // ── 결승 (7/26) ──
  {
    id: 'final',
    homeTeam: T.BRA,
    awayTeam: T.ENG,
    homeScore: null,
    awayScore: null,
    stage: 'final',
    scheduledAt: '2026-07-26T20:00:00Z',
    status: 'scheduled',
  },
];

export function getMatchById(id: string): Match | undefined {
  return MATCHES.find((m) => m.id === id);
}

export const HALFTIME_QUESTIONS: Record<string, { id: string; question: string; options: string[] }[]> = {
  // 하프타임에 노출되는 미니 예측 (status === 'halftime' / 'live' 인 경기)
  'r32-01': [
    { id: 'q1', question: 'Who scores the next goal?', options: ['Brazil', 'South Korea', 'No more goals'] },
    { id: 'q2', question: 'Will there be a comeback?', options: ['Yes', 'No'] },
  ],
  'r32-02': [
    { id: 'q1', question: 'First goal in the 2nd half?', options: ['Argentina', 'Australia', 'Goalless'] },
    { id: 'q2', question: 'Total goals at full time?', options: ['0', '1', '2', '3+'] },
  ],
};
