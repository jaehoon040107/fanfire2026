'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Minus, Plus, Trophy } from 'lucide-react';
import type { Match } from '@/types';
import { useStore } from '@/store/useStore';
import { useUI } from '@/store/useUI';
import { Flag } from './Flag';
import { predictionRatio, pickRarity } from '@/data/insights';
import { cn } from '@/lib/utils';

// 승부예측: 승패(필수) + 스코어(선택). 마감 = 경기 시작 전(scheduled).
export function PredictionPanel({ match }: { match: Match }) {
  const existing = useStore((s) => s.predictions[match.id]);
  const setPrediction = useStore((s) => s.setPrediction);
  const user = useStore((s) => s.user);
  const openShareCard = useUI((s) => s.openShareCard);

  const closed = match.status !== 'scheduled';
  const [winner, setWinner] = useState<string | null>(
    existing?.predictedWinner ?? null,
  );
  const [useScore, setUseScore] = useState(Boolean(existing?.predictedScore));
  const [home, setHome] = useState(existing?.predictedScore?.home ?? 1);
  const [away, setAway] = useState(existing?.predictedScore?.away ?? 1);

  const ratio = predictionRatio(match.id);

  const save = () => {
    if (!winner || !user) return;
    setPrediction({
      id: `pred-${match.id}`,
      userId: user.id,
      matchId: match.id,
      predictedWinner: winner,
      predictedScore: useScore ? { home, away } : null,
      createdAt: new Date().toISOString(),
    });
  };

  const options = [
    { key: match.homeTeam.code, label: match.homeTeam.shortName, flag: match.homeTeam.flag, pct: ratio.home },
    { key: 'draw', label: 'Draw', flag: null, pct: ratio.draw },
    { key: match.awayTeam.code, label: match.awayTeam.shortName, flag: match.awayTeam.flag, pct: ratio.away },
  ];

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-fire-500" />
        <h3 className="text-sm font-bold text-ink">Match Prediction</h3>
        {closed && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-ink-faint">
            <Lock className="h-3 w-3" /> closed
          </span>
        )}
      </div>

      {/* Winner pick */}
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const selected = (existing?.predictedWinner ?? winner) === opt.key;
          return (
            <button
              key={opt.key}
              disabled={closed}
              onClick={() => setWinner(opt.key)}
              className={cn(
                'relative flex flex-col items-center gap-1 overflow-hidden rounded-xl border p-3 transition-all disabled:cursor-not-allowed',
                selected
                  ? 'border-fire-400 bg-fire-50 shadow-fire'
                  : 'border-border bg-canvas hover:border-fire-200',
              )}
            >
              {opt.flag ? (
                <Flag code={opt.flag} size={24} />
              ) : (
                <span className="text-lg">🤝</span>
              )}
              <span className="text-xs font-semibold text-ink">{opt.label}</span>
              {closed && (
                <>
                  <span className="text-[11px] font-bold text-fire-600">
                    {opt.pct}%
                  </span>
                  <span
                    className="absolute bottom-0 left-0 h-1 bg-fire-gradient"
                    style={{ width: `${opt.pct}%` }}
                  />
                </>
              )}
            </button>
          );
        })}
      </div>

      {closed ? (
        <p className="mt-3 text-center text-xs text-ink-faint">
          {ratio.totalVotes.toLocaleString()} fans predicted this match
        </p>
      ) : (
        <>
          {/* Optional score */}
          <button
            onClick={() => setUseScore((v) => !v)}
            className="mt-3 flex w-full items-center gap-2 text-xs font-medium text-ink-soft"
          >
            <span
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded border',
                useScore ? 'border-fire-400 bg-fire-500 text-white' : 'border-border',
              )}
            >
              {useScore && <Check className="h-3 w-3" />}
            </span>
            Add a score prediction (optional)
          </button>

          {useScore && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 flex items-center justify-center gap-3"
            >
              <Stepper label={match.homeTeam.shortName} value={home} onChange={setHome} />
              <span className="font-display text-2xl text-ink-faint">:</span>
              <Stepper label={match.awayTeam.shortName} value={away} onChange={setAway} />
            </motion.div>
          )}

          <button
            onClick={save}
            disabled={!winner}
            className="btn-fire mt-4 w-full"
          >
            {existing ? 'Update Prediction' : 'Lock in My Pick 🔥'}
          </button>

          {existing && (
            <button
              onClick={() =>
                openShareCard({
                  kind: 'rarity',
                  title: 'Rare Pick',
                  subtitle: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
                  stat: `Top ${pickRarity(match.id, existing.predictedWinner)}% pick`,
                  countryCode: user?.countryCode ?? 'kr',
                  nickname: user?.nickname ?? 'Fan',
                })
              }
              className="mt-2 w-full text-center text-xs font-medium text-fire-600 hover:underline"
            >
              Share my pick as a card →
            </button>
          )}
        </>
      )}
    </div>
  );
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[11px] font-medium text-ink-soft">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-surface-2"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center font-display text-2xl tabular-nums text-ink">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(9, value + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-surface-2"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
