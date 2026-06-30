-- ─────────────────────────────────────────────────────────
-- FANFIRE — Supabase 스키마
-- 배포 시 Supabase SQL Editor 에 붙여넣어 실행.
-- Realtime 은 comments / comment_reactions / predictions 테이블에 활성화.
-- ─────────────────────────────────────────────────────────

-- 확장 (uuid 생성)
create extension if not exists "pgcrypto";

-- ── 사용자 (이메일/소셜 로그인 없음: 닉네임 + 국적만) ──
create table if not exists users (
  id           uuid primary key default gen_random_uuid(),
  nickname     text not null,
  country_code text not null,
  created_at   timestamptz not null default now()
);

-- ── 경기 ──
create table if not exists matches (
  id           text primary key,
  home_team    text not null,
  away_team    text not null,
  home_score   int,
  away_score   int,
  stage        text not null,           -- group | round32 | round16 | quarter | semi | final
  scheduled_at timestamptz not null,
  status       text not null default 'scheduled', -- scheduled | live | halftime | finished
  minute       int
);

-- ── 댓글 ──
create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  match_id   text references matches(id) on delete cascade,
  nickname   text not null,
  country_code text not null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_comments_match on comments(match_id, created_at desc);

-- ── 댓글 반응 (🔥😭🐐💀🎉) ──
create table if not exists comment_reactions (
  id            uuid primary key default gen_random_uuid(),
  comment_id    uuid references comments(id) on delete cascade,
  user_id       uuid references users(id) on delete cascade,
  reaction_type text not null,  -- fire | shock | goat | dead | party
  created_at    timestamptz not null default now(),
  unique (comment_id, user_id, reaction_type)
);

-- ── 승부예측 (경기 전) ──
create table if not exists predictions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references users(id) on delete cascade,
  match_id         text references matches(id) on delete cascade,
  predicted_winner text not null,        -- 팀코드 또는 'draw'
  predicted_score  jsonb,                -- { "home": n, "away": n } | null
  created_at       timestamptz not null default now(),
  unique (user_id, match_id)
);
create index if not exists idx_predictions_match on predictions(match_id);

-- ── 하프타임 미니 예측 ──
create table if not exists halftime_predictions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  match_id    text references matches(id) on delete cascade,
  question_id text not null,
  answer      text not null,
  created_at  timestamptz not null default now(),
  unique (user_id, match_id, question_id)
);

-- ── 국가별 온도계 (집계) ──
create table if not exists country_heat (
  match_id     text references matches(id) on delete cascade,
  country_code text not null,
  heat_score   numeric not null default 0,
  primary key (match_id, country_code)
);

-- ── Realtime publication ──
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table comment_reactions;
alter publication supabase_realtime add table predictions;

-- ── RLS (간단 공개 정책: 로그인 없는 서비스이므로 읽기 전체 허용 + 삽입 허용) ──
alter table users enable row level security;
alter table comments enable row level security;
alter table comment_reactions enable row level security;
alter table predictions enable row level security;
alter table halftime_predictions enable row level security;

create policy "public read users" on users for select using (true);
create policy "public insert users" on users for insert with check (true);

create policy "public read comments" on comments for select using (true);
create policy "public insert comments" on comments for insert with check (true);

create policy "public read reactions" on comment_reactions for select using (true);
create policy "public insert reactions" on comment_reactions for insert with check (true);

create policy "public read predictions" on predictions for select using (true);
create policy "public insert predictions" on predictions for insert with check (true);

create policy "public read halftime" on halftime_predictions for select using (true);
create policy "public insert halftime" on halftime_predictions for insert with check (true);
