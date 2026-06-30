'use client';

import type { Match, MatchStage } from '@/types';
import { MatchCard } from './MatchCard';
import { useUI } from '@/store/useUI';
import { STAGE_LABEL } from '@/lib/utils';

// 상단 토너먼트 대진표. 스테이지별 컬럼 → 가로 스크롤(모바일) / 와이드 그리드(데스크탑).

const STAGE_ORDER: MatchStage[] = [
  'round32',
  'round16',
  'quarter',
  'semi',
  'final',
];

export function TournamentBracket({ matches }: { matches: Match[] }) {
  const openMatch = useUI((s) => s.openMatch);

  const byStage = STAGE_ORDER.map((stage) => ({
    stage,
    matches: matches.filter((m) => m.stage === stage),
  })).filter((g) => g.matches.length > 0);

  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide text-ink">
          The Road to Glory
        </h2>
        <span className="text-xs text-ink-faint">
          tap any match to predict & chat
        </span>
      </div>

      <div className="scroll-thin flex gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-5 lg:overflow-visible">
        {byStage.map((group) => (
          <div key={group.stage} className="flex min-w-[210px] flex-col gap-2 lg:min-w-0">
            <div className="sticky top-16 z-10 flex items-center gap-2 bg-canvas/80 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-fire-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                {STAGE_LABEL[group.stage]}
              </h3>
              <span className="text-[10px] text-ink-faint">
                {group.matches.length}
              </span>
            </div>
            {group.matches.map((m) => (
              <MatchCard key={m.id} match={m} onClick={() => openMatch(m.id)} compact />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
