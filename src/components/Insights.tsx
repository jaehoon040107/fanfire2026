'use client';

import { motion } from 'framer-motion';
import { Flame, TrendingUp, Users } from 'lucide-react';
import type { Match } from '@/types';
import { Flag } from './Flag';
import { countryName } from '@/lib/countries';
import {
  countryAccuracyRanking,
  countryHeat,
  predictionRatio,
  sentimentShift,
} from '@/data/insights';
import { cn } from '@/lib/utils';

// ── 글로벌 예측 비율 ──────────────────────────────────────
export function GlobalPredictionRatio({ match }: { match: Match }) {
  const r = predictionRatio(match.id);
  const top = Math.max(r.home, r.draw, r.away);
  const leader =
    top === r.home ? match.homeTeam.name : top === r.away ? match.awayTeam.name : 'a draw';

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Users className="h-4 w-4 text-fire-500" />
        <h3 className="text-sm font-bold text-ink">Global Prediction</h3>
      </div>
      <p className="mb-3 text-sm text-ink-soft">
        <span className="font-bold text-fire-600">{top}%</span> of {r.totalVotes.toLocaleString()} fans
        worldwide picked <span className="font-semibold">{leader}</span>.
      </p>
      <div className="flex h-3 overflow-hidden rounded-full">
        <div className="bg-fire-500" style={{ width: `${r.home}%` }} title={`${match.homeTeam.shortName} ${r.home}%`} />
        <div className="bg-ink-faint" style={{ width: `${r.draw}%` }} title={`Draw ${r.draw}%`} />
        <div className="bg-ember" style={{ width: `${r.away}%` }} title={`${match.awayTeam.shortName} ${r.away}%`} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ink-faint">
        <span>🔥 {match.homeTeam.shortName} {r.home}%</span>
        <span>🤝 {r.draw}%</span>
        <span>{match.awayTeam.shortName} {r.away}% 🔥</span>
      </div>
    </div>
  );
}

// ── 국가별 온도계 ─────────────────────────────────────────
export function CountryHeatmap({ match }: { match: Match }) {
  const heat = countryHeat(match.id);
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-fire-500" fill="currentColor" />
        <h3 className="text-sm font-bold text-ink">Country Heat</h3>
        <span className="ml-auto text-[11px] text-ink-faint">who's most fired up</span>
      </div>
      <div className="space-y-2">
        {heat.map((h, i) => (
          <div key={h.countryCode} className="flex items-center gap-2">
            <span className="w-4 text-xs font-bold text-ink-faint">{i + 1}</span>
            <Flag code={h.countryCode} size={18} />
            <span className="w-24 truncate text-sm text-ink-soft">
              {countryName(h.countryCode)}
            </span>
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${h.heat}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="h-full bg-fire-gradient"
              />
            </div>
            <span className="w-9 text-right text-xs font-semibold tabular-nums text-fire-600">
              {h.heat}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 경기 전후 민심 비교 ───────────────────────────────────
export function SentimentShift({ match }: { match: Match }) {
  const s = sentimentShift(match.id);
  if (match.status !== 'finished') return null;
  const Bar = ({ label, data }: { label: string; data: typeof s.before }) => (
    <div>
      <span className="mb-1 block text-[11px] font-medium text-ink-faint">{label}</span>
      <div className="flex h-2.5 overflow-hidden rounded-full">
        <div className="bg-fire-400" style={{ width: `${data.positive}%` }} />
        <div className="bg-surface-2" style={{ width: `${data.neutral}%` }} />
        <div className="bg-ink-faint" style={{ width: `${data.negative}%` }} />
      </div>
    </div>
  );
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-fire-500" />
        <h3 className="text-sm font-bold text-ink">Mood: Before vs After</h3>
      </div>
      <div className="space-y-3">
        <Bar label="Before kickoff" data={s.before} />
        <Bar label="After full-time" data={s.after} />
      </div>
      <div className="mt-2 flex gap-3 text-[10px] text-ink-faint">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-fire-400" /> hopeful</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-surface-2" /> neutral</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-ink-faint" /> gutted</span>
      </div>
    </div>
  );
}

// ── 국가별 예측 정확도 랭킹 (국가 자존심 자극) ────────────
export function AccuracyRanking({ limit = 8 }: { limit?: number }) {
  const ranking = countryAccuracyRanking().slice(0, limit);
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base">🏆</span>
        <h3 className="text-sm font-bold text-ink">Nations Leaderboard</h3>
        <span className="ml-auto text-[11px] text-ink-faint">best predictors</span>
      </div>
      <div className="space-y-1.5">
        {ranking.map((c) => (
          <div
            key={c.countryCode}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2 py-1.5',
              c.rank === 1 && 'bg-fire-50',
            )}
          >
            <span
              className={cn(
                'w-5 text-center text-sm font-bold',
                c.rank === 1 ? 'text-fire-600' : 'text-ink-faint',
              )}
            >
              {c.rank === 1 ? '👑' : c.rank}
            </span>
            <Flag code={c.countryCode} size={18} />
            <span className="flex-1 truncate text-sm font-medium text-ink">
              {c.countryName}
            </span>
            <span className="text-sm font-bold tabular-nums text-fire-600">
              {c.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
