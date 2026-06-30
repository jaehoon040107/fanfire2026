# 🔥 FANFIRE — 2026 World Cup Global Fan Hub

> **Where the world watches the Cup.**
> ESPN·Google은 정보를 준다. FANFIRE는 경험을 준다.

전 세계 팬들의 열기가 모이는 실시간 승부예측 + 커뮤니티 허브.
2026 FIFA 월드컵을 타깃으로 한 **글로벌(외국인 중심)** 싱글 페이지 서비스.

---

## ✨ 핵심 기능

| 기능 | 설명 |
|------|------|
| 🏆 **토너먼트 대진표** | 32강~결승, 라이브/예정/종료 상태 실시간 표시 |
| 💬 **실시간 글로벌 댓글 피드** | 방송 채팅창 느낌. 다국어 혼합, 감정 반응 버튼(🔥😭🐐💀🎉) |
| 🌐 **번역 버튼** | 자동 번역 X — 클릭 시 DeepL/Google 번역 |
| 🎯 **승부예측** | 승패(필수) + 스코어(선택), 마감=경기 시작 전 |
| ⏱️ **하프타임 미니 예측** | 후반전 예측 별도 집계 (형평성 + 참여율 ↑) |
| 🔥 **국가별 온도계** | 반응 버튼 데이터 기반 열기 시각화 |
| 📊 **글로벌 예측 비율** | "전 세계 63%가 이 팀을 픽했다" |
| 👑 **국가별 정확도 랭킹** | 국가 자존심 자극 리더보드 |
| 💎 **소셜 공유 카드** | 희귀도/여정/국가대표 카드 (바이럴 엔진) |
| 🆔 **로그인 없는 정체성** | 국적 + 닉네임만 (IP 자동감지 → 수정 가능) |

**완전 반응형** — 모바일(바텀시트) / 데스크탑(중앙 오버레이 패널) 대응.

---

## 🛠 기술 스택

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Framer Motion (화이트 베이스 + 파이어 그라디언트)
- **Backend:** Supabase (PostgreSQL + Realtime)
- **Data:** football-data.org API
- **번역:** DeepL / Google Translate API
- **Geo:** IP 기반 국적 자동 감지 (Vercel Edge 헤더)
- **배포:** Vercel

---

## 🚀 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

기본은 **mock 모드** — 실제 API 키 없이도 샘플 데이터로 모든 기능이 동작합니다.

```bash
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버
npm run typecheck
```

---

## 🔑 배포 시 실데이터 연동 (DEPLOY.md 참고)

`mock → live` 전환은 **환경변수만 채우면** 끝납니다. 코드 수정 불필요.

1. `.env.local`(또는 Vercel 환경변수)에 키 입력
2. `NEXT_PUBLIC_DATA_MODE=live` 설정
3. Supabase SQL Editor 에 `supabase/schema.sql` 실행

자세한 단계는 [DEPLOY.md](./DEPLOY.md) 참고.

---

## 📁 구조

```
src/
├── app/              # 페이지 + API 라우트(geo, translate)
├── components/       # UI 컴포넌트
├── lib/              # supabase, football-api, 유틸, 국가/반응 데이터
├── data/             # 샘플 시드(경기/댓글/집계)
├── hooks/            # useLiveFeed, useNow
├── store/            # zustand (유저 세션 영속 + UI 상태)
└── types/            # 공통 타입
supabase/schema.sql   # DB 스키마
```
