import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_ENABLED, SUPABASE_URL } from './env';

// ─────────────────────────────────────────────────────────
// Supabase 클라이언트.
// 키가 없으면 null 을 반환 → 호출부에서 mock 경로로 폴백.
// (실데이터 연동 시 .env.local 또는 Vercel 환경변수에 키만 넣으면 자동 활성화)
// ─────────────────────────────────────────────────────────

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_ENABLED) return null;
  if (client) return client;
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return client;
}

export const isSupabaseLive = SUPABASE_ENABLED;
