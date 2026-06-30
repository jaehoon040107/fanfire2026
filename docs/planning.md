# FANFIRE — 2026 월드컵 글로벌 팬 커뮤니티 기획

> 세이브포인트 v1.0 — 기획 완료 / 디자인 단계 진입 전

---

## 브랜드
- **사이트명:** FANFIRE
- **도메인:** fanfire2026.com
- **타깃:** 글로벌 (외국인 중심)
- **컨셉:** 전 세계 팬들의 열기가 모이는 실시간 승부예측 + 커뮤니티 허브
- **포지셔닝:** ESPN·Google은 정보를 준다. FANFIRE는 경험을 준다.

---

## 트래픽 일정
| 시기 | 이벤트 | 예상 트래픽 |
|------|--------|-----------|
| 7/1~7/3 | 그룹 최종전 | 스파이크 |
| 7/4~7/7 | 32강 | 최대 스파이크 |
| 7/9~7/12 | 16강 | 높음 |
| 7/14~7/17 | 8강 | 높음 |
| 7/21 | 4강 | 매우 높음 |
| 7/26 | 결승 | 역대 최고 |

---

## 기획 확정 사항

### 레이아웃 구조
- **싱글 페이지** (페이지 이동 없음)
- 상단: 토너먼트 대진표
- 하단: 실시간 글로벌 댓글 피드 (방송 채팅창 느낌)
- 경기 클릭 시 상세 표시:
  - 모바일: **바텀시트**
  - 데스크탑: **오버레이 패널** (화면 중앙 70~80%, 배경 dim)
- 오버레이 콘텐츠 우선순위: 댓글 = 승부예측 > 대진표 (대진표는 가려져도 무관)

### 유저 정체성
- **국적 선택 + 닉네임** (이메일/소셜 로그인 없음)
- IP 기반 국적 자동 추천 → 유저가 확인/수정
- LocalStorage + Supabase에 세션 저장

### 댓글 시스템
- 텍스트 + 이모지 입력 + 감정 반응 버튼
- 감정 반응 버튼 (감정중심): 🔥 열정 / 😭 충격 / 🐐 레전드 / 💀 탈락각 / 🎉 축하
- 댓글에도 반응 버튼 달기 가능
- 번역: **버튼 방식** (자동 번역 X, 클릭 시 번역)

### 승부예측
- **승패 예측 (필수) + 선택적 스코어 예측**
- 예측 마감: **경기 시작 전**
- **하프타임 미니 예측** 별도 운영 (형평성 유지 + 참여율 ↑)
  - 질문 예: "후반전 첫 골은?", "역전 가능성 있나?"
  - 사전 예측과 별도 집계

### 호기심 유발 콘텐츠
- **글로벌 예측 비율** — "전 세계 63%가 이 팀을 픽했다"
- **국가별 온도계** — 반응 버튼 데이터 기반 (🔥 많을수록 뜨거움)
- **경기 전후 민심 비교** — 예측 전 vs 경기 후 감정 변화 시각화
- **국가별 예측 정확도 랭킹** — "예측을 가장 잘 맞춘 나라는?" (국가 자존심 자극)

### 소셜 공유 카드 (바이럴 엔진)
- **희귀도 카드** — "당신의 픽은 상위 X%만 선택한 희귀픽"
- **여정 리포트 카드** — 토너먼트 전체 예측 결과 요약
- **국가 대표 카드** — 해당 국적 중 최고 예측률 달성 시 획득

---

## 기술 스택
```
Frontend:    Next.js 14 (App Router) + TypeScript
Styling:     Tailwind CSS + Framer Motion
Backend:     Supabase (PostgreSQL + Realtime + Auth)
Deployment:  Vercel (자동 스케일링)
Data:        football-data.org API
Translation: Google Translate API or DeepL (버튼 방식)
Geo:         IP 기반 국적 자동 감지
```

---

## DB 스키마 (Supabase)
```sql
-- 사용자
users: id, nickname, country_code, created_at

-- 경기
matches: id, home_team, away_team, home_score, away_score,
         stage, scheduled_at, status

-- 댓글
comments: id, user_id, match_id, body, created_at

-- 댓글 반응
comment_reactions: id, comment_id, user_id, reaction_type

-- 승부예측 (경기 전)
predictions: id, user_id, match_id, predicted_winner, predicted_score, created_at

-- 하프타임 미니 예측
halftime_predictions: id, user_id, match_id, question_id, answer, created_at

-- 국가별 온도계 (집계)
country_heat: match_id, country_code, heat_score
```

---

## 진행 단계
- [x] 기획
- [ ] 디자인
- [ ] 프로그래밍
- [ ] 배포
- [ ] 마케팅
