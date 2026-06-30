import type { Comment, ReactionType } from '@/types';

// 실시간 피드를 채우는 샘플 댓글 풀. 다국어 혼합(글로벌 채팅 느낌).
// createdAt 은 상대시간으로 런타임에 생성하므로 분(分) 오프셋으로 저장.

interface SeedComment {
  nickname: string;
  countryCode: string;
  body: string;
  minutesAgo: number;
  reactions?: Partial<Record<ReactionType, number>>;
  matchId: string;
}

export const SEED_COMMENTS: SeedComment[] = [
  { matchId: 'r32-01', nickname: 'TaegukWarrior', countryCode: 'kr', body: '대한민국!!! 동점골 미쳤다 🔥🔥', minutesAgo: 1, reactions: { fire: 42, goat: 8 } },
  { matchId: 'r32-01', nickname: 'samba_king', countryCode: 'br', body: 'Como empatamos com a Coreia?? 😭', minutesAgo: 2, reactions: { shock: 31, dead: 12 } },
  { matchId: 'r32-01', nickname: 'NeutralFan', countryCode: 'us', body: 'This match is INSANE. Best game of the tournament so far', minutesAgo: 3, reactions: { fire: 67 } },
  { matchId: 'r32-01', nickname: 'futbol_es_vida', countryCode: 'ar', body: 'Korea jugando sin miedo, respeto 🐐', minutesAgo: 5, reactions: { goat: 24 } },
  { matchId: 'r32-01', nickname: 'Hansik', countryCode: 'kr', body: '손흥민 폼 미쳤어 진짜', minutesAgo: 6, reactions: { fire: 19, goat: 15 } },
  { matchId: 'r32-01', nickname: 'CanaryYellow', countryCode: 'br', body: 'Precisamos acordar no segundo tempo!', minutesAgo: 8, reactions: { fire: 9 } },
  { matchId: 'r32-01', nickname: 'tokyo_drift', countryCode: 'jp', body: '韓国頑張れ！アジアの誇り 🔥', minutesAgo: 10, reactions: { fire: 33, party: 5 } },
  { matchId: 'r32-01', nickname: 'LondonGooner', countryCode: 'gb', body: 'Brazil look shaky at the back today', minutesAgo: 12, reactions: { shock: 7 } },

  { matchId: 'r32-02', nickname: 'BuenosAires10', countryCode: 'ar', body: 'Vamos Argentina!! 0-0 pero dominamos', minutesAgo: 2, reactions: { fire: 28 } },
  { matchId: 'r32-02', nickname: 'Socceroo', countryCode: 'au', body: 'Defending for our lives but still in it! 💀', minutesAgo: 4, reactions: { dead: 18, fire: 11 } },
  { matchId: 'r32-02', nickname: 'messi_goat', countryCode: 'in', body: 'Messi will break this open 2nd half 🐐', minutesAgo: 7, reactions: { goat: 41 } },

  { matchId: 'r32-05', nickname: 'AtlasLion', countryCode: 'ma', body: 'We gave everything against Spain. Proud 😭', minutesAgo: 30, reactions: { shock: 52, fire: 20 } },
  { matchId: 'r32-05', nickname: 'LaRoja', countryCode: 'es', body: 'A semis bound! Vamos España 🎉', minutesAgo: 28, reactions: { party: 88, fire: 30 } },

  { matchId: 'r32-06', nickname: 'DerPanzer', countryCode: 'de', body: '3-1! Germany is BACK 🔥🐐', minutesAgo: 45, reactions: { fire: 73, goat: 22 } },
  { matchId: 'r32-06', nickname: 'StarsNStripes', countryCode: 'us', body: 'Tough loss but the future is bright 💀', minutesAgo: 42, reactions: { dead: 34, fire: 9 } },

  { matchId: 'r32-03', nickname: 'ParisSG', countryCode: 'fr', body: 'Allez les Bleus! Senegal will be tough though', minutesAgo: 15, reactions: { fire: 14 } },
  { matchId: 'r32-03', nickname: 'TerangaLion', countryCode: 'sn', body: 'On va surprendre la France inshallah 🔥', minutesAgo: 18, reactions: { fire: 39, goat: 6 } },

  { matchId: 'final', nickname: 'WorldCupDreamer', countryCode: 'br', body: 'Brazil vs England final?? What a tournament 🎉', minutesAgo: 120, reactions: { party: 56 } },
  { matchId: 'final', nickname: 'ThreeLions', countryCode: 'gb', body: "It's coming home. Finally. 🦁", minutesAgo: 110, reactions: { fire: 47, dead: 12 } },
];

let counter = 0;
function genId() {
  return `seed-${counter++}`;
}

/** 시드 댓글을 런타임 Comment[] 로 변환 (createdAt 상대시간 적용). */
export function buildSeedComments(now: number): Comment[] {
  counter = 0;
  return SEED_COMMENTS.map((c) => ({
    id: genId(),
    userId: `seed-${c.nickname}`,
    matchId: c.matchId,
    nickname: c.nickname,
    countryCode: c.countryCode,
    body: c.body,
    createdAt: new Date(now - c.minutesAgo * 60_000).toISOString(),
    reactions: c.reactions ?? {},
  }));
}

// 새 댓글이 실시간으로 흘러들어오는 느낌을 주기 위한 가짜 인커밍 풀.
export const INCOMING_POOL: { nickname: string; countryCode: string; body: string; matchId: string }[] = [
  { nickname: 'RedDevilKR', countryCode: 'kr', body: '대~한민국 🇰🇷🔥', matchId: 'r32-01' },
  { nickname: 'Rio2026', countryCode: 'br', body: 'Vai Brasil! Ainda dá tempo', matchId: 'r32-01' },
  { nickname: 'GlobalNeutral', countryCode: 'ca', body: 'Tuning in from Toronto, what a match!', matchId: 'r32-01' },
  { nickname: 'AlbicelesteFan', countryCode: 'ar', body: 'Segundo tiempo es nuestro 🐐', matchId: 'r32-02' },
  { nickname: 'OzMate', countryCode: 'au', body: 'Come on Socceroos!! 💀🔥', matchId: 'r32-02' },
  { nickname: 'SeoulNight', countryCode: 'kr', body: '심장 터질 것 같아 😭', matchId: 'r32-01' },
  { nickname: 'BerlinUltra', countryCode: 'de', body: 'Germany rolling 🔥', matchId: 'r32-06' },
];
