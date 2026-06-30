// 환경/모드 판별 헬퍼. 키가 없으면 자동으로 mock 모드로 폴백.

export const DATA_MODE = (process.env.NEXT_PUBLIC_DATA_MODE ?? 'mock') as 'mock' | 'live';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Supabase 키가 모두 채워졌고 live 모드일 때만 실제 백엔드 사용. */
export const SUPABASE_ENABLED =
  DATA_MODE === 'live' && Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);

/** football-data.org 연동 가능 여부 (서버 전용). */
export const FOOTBALL_API_ENABLED =
  DATA_MODE === 'live' && Boolean(process.env.FOOTBALL_DATA_API_KEY);
