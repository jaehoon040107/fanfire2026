# 🚀 FANFIRE 배포 가이드

출시 직전 상태입니다. **코드는 100% 완성**되어 있고, 아래는 실제 키를 꽂는 마지막 단계입니다.
지금은 `mock` 모드라 키 없이도 모든 화면·기능이 동작합니다.

---

## 1. Supabase 설정 (백엔드 + 실시간)

1. [app.supabase.com](https://app.supabase.com) 에서 새 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 전체 붙여넣기 → Run
   (테이블 + RLS 정책 + Realtime publication 자동 생성)
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

---

## ✅ 배포 후 체크리스트

- [ ] Supabase 스키마 실행 완료
- [ ] 환경변수 5종 입력 + `NEXT_PUBLIC_DATA_MODE=live`
- [ ] 댓글 작성 → Supabase `comments` 테이블에 적재 확인
- [ ] 다른 브라우저에서 실시간 댓글 수신(Realtime) 확인
- [ ] 라이브 경기 스코어가 football-data 와 일치
- [ ] 번역 버튼 실제 번역 동작
- [ ] 모바일/데스크탑 반응형 확인
- [ ] 도메인 HTTPS 정상
