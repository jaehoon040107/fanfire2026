# 🚀 FANFIRE 배포 가이드

**현재 상태:** 프론트엔드 + `mock` 모드는 완성 — 키 없이도 모든 화면·기능이 동작합니다(시연/개발용).
`live` 모드(실데이터 영속)는 아래 단계로 키를 꽂고 스키마를 실행하면 활성화됩니다.

**`live` 모드에서 실제로 작동하는 것:**
- ✅ 유저 생성(Supabase `users`, uuid 발급) → 댓글·예측의 user_id 정합
- ✅ 댓글 저장 + 기존 히스토리 로드 + Realtime 신규 수신
- ✅ 승부예측 / 하프타임 예측 / 댓글 반응 DB 저장
- ✅ 글로벌 예측 비율 · 국가별 온도계 · 정확도 랭킹 = 실데이터 집계(데이터 없으면 mock 표시)

> 모든 쓰기는 `src/lib/db.ts` 한 곳을 거칩니다. 키가 없으면 자동으로 mock 으로 폴백 → 코드 분기 불필요.

---

## 1. Supabase 설정 (백엔드 + 실시간)

1. [app.supabase.com](https://app.supabase.com) 에서 새 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 전체 붙여넣기 → Run
   (테이블 + RLS 정책 + Realtime publication 자동 생성)
   - RLS `WITH CHECK` 로 본문 길이(≤280)·닉네임 길이·허용 reaction 값을 **DB 단에서 강제**
   - `match_id` 는 외부(football-data) reference 라 FK 없음 → 실 API id·글로벌 피드(null) 자유 수용
3. **Project Settings → API** 에서 아래 두 값 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. football-data.org (라이브 스코어/일정)

1. [football-data.org/client/register](https://www.football-data.org/client/register) 무료 가입
2. 발급된 토큰 → `FOOTBALL_DATA_API_KEY`
   - 무료 플랜은 호출 한도가 있으니, 본선 기간엔 유료 플랜 권장
   - `src/lib/football-api.ts` 가 30초 캐시로 호출량을 줄여둠

---

## 3. 번역 API (선택 — 둘 중 하나)

- **DeepL** (추천, 품질↑): [deepl.com/pro-api](https://www.deepl.com/pro-api) → `DEEPL_API_KEY`
- **Google Translate**: GCP 콘솔 → Translation API 활성화 → `GOOGLE_TRANSLATE_API_KEY`
- 둘 다 비워두면 mock 번역(언어 태그 부착)으로 동작 → 버튼 흐름은 유지됨

---

## 4. Vercel 배포

```bash
# 1) GitHub 에 푸시 후 Vercel 에서 Import
#    또는 CLI:
npm i -g vercel
vercel
```

**Vercel 대시보드 → Settings → Environment Variables** 에 입력:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | (Supabase Project URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon public key) |
| `FOOTBALL_DATA_API_KEY` | (football-data 토큰) |
| `DEEPL_API_KEY` 또는 `GOOGLE_TRANSLATE_API_KEY` | (번역 키) |
| `NEXT_PUBLIC_DATA_MODE` | `live` |

> ⚠️ **보안:** 키는 절대 코드/깃에 하드코딩하지 않습니다. `.env*`는 `.gitignore`에 포함되어 있고, 실 키는 Vercel 환경변수로만 주입합니다.

IP 기반 국적 감지는 Vercel 의 `x-vercel-ip-country` 헤더로 **배포 환경에서 자동 동작**합니다 (로컬에선 기본값 `kr`).

---

## 5. 도메인 연결

Vercel → Settings → Domains → `fanfire2026.com` 추가 후 DNS 레코드 설정.

> ⚠️ **기본 브랜치:** 코드는 `feat/build`(→ `main` 병합 예정)에 있습니다. Vercel Import 시
> **Production Branch 를 코드가 있는 브랜치로 지정**하세요. 안 그러면 빈 앱이 배포됩니다.

---

## 6. 프로덕션 보안 강화 (트래픽 스파이크 대비)

현재 방어: RLS `WITH CHECK`(길이/허용값), 로그인 없는 익명 구조.
본선 트래픽(스파이크) 전에 아래를 추가 권장:

- **봇/스팸 방어:** Cloudflare Turnstile 또는 hCaptcha → 댓글/예측 쓰기 전 토큰 검증
- **Rate limit:** 쓰기를 서버 라우트(`/api/comment` 등)로 경유시키고 IP·유저별 분당 한도
  (Upstash Redis 등). 현재는 클라이언트 → Supabase 직접 insert 라 DB 제약만 의존
- **중복/도배 차단:** 동일 본문 연속 insert 제한, 닉네임 비속어 필터

> 이 단계는 "출시 후 즉시"가 아니라 트래픽이 붙기 전 적용하면 됩니다. 기능 동작에는 영향 없음.

---

## ✅ 배포 후 체크리스트

- [ ] Supabase 스키마 실행 완료(테이블 7종 + RLS 정책 생성 확인)
- [ ] Vercel Production Branch = 코드 브랜치로 지정
- [ ] 환경변수 입력 + `NEXT_PUBLIC_DATA_MODE=live`
- [ ] 온보딩 → Supabase `users` 에 uuid 행 생성 확인
- [ ] 댓글 작성 → `comments` 테이블 적재 + 새로고침 후 히스토리 로드 확인
- [ ] 다른 브라우저에서 실시간 댓글 수신(Realtime) 확인
- [ ] 예측/하프타임/반응 → `predictions`/`halftime_predictions`/`comment_reactions` 적재 확인
- [ ] 예측 비율·온도계·정확도 랭킹이 실데이터로 갱신되는지 확인
- [ ] 라이브 경기 스코어가 football-data 와 일치
- [ ] 번역 버튼 실제 번역 동작
- [ ] 모바일/데스크탑 반응형 확인
- [ ] 도메인 HTTPS 정상
