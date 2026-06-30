'use client';

import { motion } from 'framer-motion';
import type { Match } from '@/types';
import { Flag } from './Flag';
import { cn, formatKickoff } from '@/lib/utils';

function StatusBadge({ match }: { match: Match }) {
  if (match.status === 'live')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-ember px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        {match.minute ? `${match.minute}'` : 'LIVE'}
      </span>
    );
  if (match.status === 'halftime')
    return (
      <span className="rounded-full bg-spark px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
        HALF-TIME
      </span>
    );
  if (match.status === 'finished')
    return (
      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
        FT
      </span>
    );
  return (
    <span className="text-[11px] font-medium text-ink-faint">
      {formatKickoff(match.scheduledAt)}
    </span>
  );
}

function TeamRow({
  code,
  flag,
  name,
  score,
  winner,
  decided,
}: {
  code: string;
  flag: string;
  name: string;
  score: number | null;
  winner: boolean;
  decided: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        decided && !winner && 'opacity-50',
      )}
    >
      <Flag code={flag} size={20} />
      <span
        className={cn(
          'truncate text-sm',
          winner ? 'font-bold text-ink' : 'font-medium text-ink-soft',
        )}
      >
        {name}
      </span>
      <span className="ml-auto w-5 text-right font-display text-lg tabular-nums text-ink">
        {score ?? '–'}
      </span>
    </div>
  );
}

export function MatchCard({
  match,
  onClick,
  compact = false,
}: {
  match: Match;
  onClick: () => void;
  compact?: boolean;
}) {
  const decided = match.status === 'finished';
  const homeWin =
    match.homeScore != null &&
    match.awayScore != null &&
    match.homeScore > match.awayScore;
  const awayWin =
    match.homeScore != null &&
    match.awayScore != null &&
    match.awayScore > match.homeScore;
  const isLive = match.status === 'live' || match.status === 'halftime';

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'card w-full p-3 text-left transition-shadow hover:shadow-fire',
        isLive && 'ring-1 ring-ember/40',
        compact ? 'min-w-[180px]' : 'min-w-[200px]',
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <StatusBadge match={match} />
        {isLive && (
          <span className="text-[10px] font-medium text-ember">● tap to join</span>
        )}
      </div>
      <div className="space-y-1.5">
        <TeamRow
          code={match.homeTeam.code}
          flag={match.homeTeam.flag}
          name={match.homeTeam.name}
          score={match.homeScore}
          winner={homeWin}
          decided={decided}
        />
        <TeamRow
          code={match.awayTeam.code}
          flag={match.awayTeam.flag}
          name={match.awayTeam.name}
          score={match.awayScore}
          winner={awayWin}
          decided={decided}
        />
      </div>
    </motion.button>
  );
}
