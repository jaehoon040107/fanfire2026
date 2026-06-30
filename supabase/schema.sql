-- ─────────────────────────────────────────────────────────
-- FANFIRE — Supabase 스키마
-- 배포 시 Supabase SQL Editor 에 붙여넣어 실행.
-- Realtime 은 comments / comment_reactions / predictions 테이블에 활성화.
--
-- 설계 메모:
-- - match_id 는 외부(football-data.org)에서 오는 reference 데이터라 FK 를 걸지 않음.
--   → 실 API match id, 그룹 글로벌 피드(null) 모두 자유롭게 수용.
-- - 집계(예측비율/온도계/정확도)는 country_code 를 비정규화해 join 없이 group by 로 처리.
-- - RLS WITH CHECK 로 길이/허용값을 DB 단에서 강제(무제한·이상값 insert 차단).
--   대규모 트래픽 시 추가 방어(서버 라우트 rate limit, Turnstile)는 DEPLOY.md 참고.
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

-- ── 경기 (선택: 표시용 캐시. 앱은 football-data 를 직접 쓰므로 FK 의존 없음) ──
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

-- ── 댓글 (match_id null = 전체 글로벌 피드) ──
create table if not exists comments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references users(id) on delete cascade,
  match_id     text,                     -- FK 없음(외부 reference). null = 글로벌
  nickname     text not null,
  country_code text not null,
  body         text not null,
  created_at   timestamptz not null default now()
);
create index if not exists idx_comments_match on comments(match_id, created_at desc);
create index if not exists idx_comments_created on comments(created_at desc);

-- ── 댓글 반응 (🔥😭🐐💀🎉) — match_id/country_code 비정규화(온도계 집계용) ──
create table if not exists comment_reactions (
  id            uuid primary key default gen_random_uuid(),
  comment_id    uuid references comments(id) on delete cascade,
  user_id       uuid references users(id) on delete cascade,
  match_id      text,                    -- 반응이 달린 경기(온도계 집계용)
  country_code  text,                    -- 반응을 누른 사람의 국적(온도계 집계용)
  reaction_type text not null,           -- fire | shock | goat | dead | party
  created_at    timestamptz not null default now(),
  unique (comment_id, user_id, reaction_type)
);
create index if not exists idx_reactions_match on comment_reactions(match_id);

-- ── 승부예측 (경기 전) — country_code 비정규화(정확도 랭킹 집계용) ──
create table if not exists predictions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references users(id) on delete cascade,
  match_id         text not null,        -- FK 없음(외부 reference)
  country_code     text not null,
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
  match_id    text not null,             -- FK 없음(외부 reference)
  question_id text not null,
  answer      text not null,
  created_at  timestamptz not null default now(),
  unique (user_id, match_id, question_id)
);

-- ── 국가별 온도계 (선택: 사전집계 캐시. 기본은 comment_reactions 에서 실시간 산출) ──
create table if not exists country_heat (
  match_id     text not null,
  country_code text not null,
  heat_score   numeric not null default 0,
  primary key (match_id, country_code)
);

-- ── Realtime publication ──
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table comment_reactions;
alter publication supabase_realtime add table predictions;

-- ── RLS (로그인 없는 서비스: 읽기 전체 허용 + 삽입은 길이/허용값 강제) ──
alter table users enable row level security;
alter table comments enable row level security;
alter table comment_reactions enable row level security;
alter table predictions enable row level security;
alter table halftime_predictions enable row level security;

-- users: 닉네임 2–16, 국적 코드 길이 제한
create policy "public read users" on users for select using (true);
create policy "public insert users" on users for insert
  with check (
    char_length(nickname) between 2 and 16
    and char_length(country_code) between 2 and 3
  );

-- comments: 본문 1–280, 닉네임 1–16
create policy "public read comments" on comments for select using (true);
create policy "public insert comments" on comments for insert
  with check (
    char_length(body) between 1 and 280
    and char_length(nickname) between 1 and 16
    and char_length(country_code) between 2 and 3
  );

-- comment_reactions: 허용 reaction_type 만
create policy "public read reactions" on comment_reactions for select using (true);
create policy "public insert reactions" on comment_reactions for insert
  with check (reaction_type in ('fire', 'shock', 'goat', 'dead', 'party'));
create policy "public delete own reactions" on comment_reactions for delete using (true);

-- predictions: winner 비어있지 않게
create policy "public read predictions" on predictions for select using (true);
create policy "public insert predictions" on predictions for insert
  with check (char_length(predicted_winner) between 1 and 8);
create policy "public update own predictions" on predictions for update using (true)
  with check (char_length(predicted_winner) between 1 and 8);

-- halftime: answer 길이 제한
create policy "public read halftime" on halftime_predictions for select using (true);
create policy "public insert halftime" on halftime_predictions for insert
  with check (char_length(answer) between 1 and 60);
create policy "public update own halftime" on halftime_predictions for update using (true)
  with check (char_length(answer) between 1 and 60);
