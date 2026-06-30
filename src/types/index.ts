// ─────────────────────────────────────────────────────────
// FANFIRE 공통 타입 정의
// DB 스키마(supabase/schema.sql)와 1:1 대응
// ─────────────────────────────────────────────────────────

export type MatchStage =
  | 'group'
  | 'round32'
  | 'round16'
  | 'quarter'
  | 'semi'
  | 'final';

export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished';

export type ReactionType = 'fire' | 'shock' | 'goat' | 'dead' | 'party';

export interface Team {
  code: string; // ISO 3166-1 alpha-3 (e.g. 'KOR')
  name: string;
  flag: string; // ISO alpha-2 lowercase for flagcdn (e.g. 'kr')
  shortName: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  stage: MatchStage;
  scheduledAt: string; // ISO datetime
  status: MatchStatus;
  minute?: number | null; // live elapsed minute
}

export interface User {
  id: string;
  nickname: string;
  countryCode: string; // ISO alpha-2 lowercase
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  matchId: string;
  nickname: string;
  countryCode: string;
  body: string;
  createdAt: string;
  reactions: Partial<Record<ReactionType, number>>;
  translatedBody?: string; // populated on translate-button click
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  predictedWinner: string; // team code or 'draw'
  predictedScore?: { home: number; away: number } | null;
  createdAt: string;
}

export interface HalftimePrediction {
  id: string;
  userId: string;
  matchId: string;
  questionId: string;
  answer: string;
  createdAt: string;
}

export interface HalftimeQuestion {
  id: string;
  matchId: string;
  question: string;
  options: string[];
}

export interface CountryHeat {
  matchId: string;
  countryCode: string;
  heatScore: number;
}

// ── Aggregate / derived view models ──────────────────────

export interface PredictionRatio {
  matchId: string;
  home: number; // 0–100 (%)
  draw: number;
  away: number;
  totalVotes: number;
}

export interface CountryAccuracy {
  countryCode: string;
  countryName: string;
  accuracy: number; // 0–100 (%)
  totalPredictions: number;
  rank: number;
}

export type ShareCardKind = 'rarity' | 'journey' | 'national';

export interface ShareCardData {
  kind: ShareCardKind;
  title: string;
  subtitle: string;
  stat: string;
  countryCode: string;
  nickname: string;
}
