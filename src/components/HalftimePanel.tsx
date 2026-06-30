'use client';

import { Timer } from 'lucide-react';
import type { Match } from '@/types';
import { HALFTIME_QUESTIONS } from '@/data/matches';
import { useStore } from '@/store/useStore';
import { saveHalftime } from '@/lib/db';
import { cn } from '@/lib/utils';
import { seededRandom } from '@/lib/utils';

// 하프타임 미니 예측 — 사전 예측과 별도 집계. live/halftime 경기에만 노출.
export function HalftimePanel({ match }: { match: Match }) {
  const questions = HALFTIME_QUESTIONS[match.id];
  const halftime = useStore((s) => s.halftime);
  const setHalftime = useStore((s) => s.setHalftime);
  const user = useStore((s) => s.user);

  if (!questions || (match.status !== 'live' && match.status !== 'halftime')) {
    return null;
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 bg-spark/20 px-4 py-2.5">
        <Timer className="h-4 w-4 text-fire-600" />
        <h3 className="text-sm font-bold text-ink">Half-time Mini Predictions</h3>
        <span className="ml-auto rounded-full bg-spark px-2 py-0.5 text-[10px] font-bold text-ink">
          LIVE NOW
        </span>
      </div>

      <div className="space-y-4 p-4">
        {questions.map((q) => {
          const key = `${match.id}:${q.id}`;
          const answered = halftime[key]?.answer;
          return (
            <div key={q.id}>
              <p className="mb-2 text-sm font-semibold text-ink">{q.question}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const selected = answered === opt;
                  const pct = Math.round(
                    10 + seededRandom(key + opt) * 70,
                  );
                  return (
                    <button
                      key={opt}
                      disabled={!user}
                      onClick={() => {
                        setHalftime({
                          matchId: match.id,
                          questionId: q.id,
                          answer: opt,
                        });
                        if (user)
                          saveHalftime({
                            userId: user.id,
                            matchId: match.id,
                            questionId: q.id,
                            answer: opt,
                          });
                      }}
                      className={cn(
                        'relative flex-1 overflow-hidden rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:opacity-50',
                        selected
                          ? 'border-fire-400 bg-fire-50 text-fire-700'
                          : 'border-border bg-canvas hover:border-fire-200',
                      )}
                    >
                      <span className="relative z-10">{opt}</span>
                      {answered && (
                        <>
                          <span className="relative z-10 ml-1 text-xs text-ink-faint">
                            {pct}%
                          </span>
                          <span
                            className="absolute bottom-0 left-0 top-0 bg-fire-100"
                            style={{ width: `${pct}%` }}
                          />
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <p className="text-center text-[11px] text-ink-faint">
          Separate from your pre-match prediction · keeps it fair 🤝
        </p>
      </div>
    </div>
  );
}
