'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import type { Match } from '@/types';
import { useUI } from '@/store/useUI';
import { Flag } from './Flag';

// 히어로 — 포지셔닝 카피 + 라이브 경기 티커.
export function Hero({ matches }: { matches: Match[] }) {
  const openMatch = useUI((s) => s.openMatch);
  const live = matches.filter((m) => m.status === 'live' || m.status === 'halftime');

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-2 pt-8 text-center sm:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-fire-200 bg-fire-50 px-4 py-1.5 text-sm font-medium text-fire-700"
      >
        <Flame className="h-4 w-4 animate-flame-flicker" fill="currentColor" />
        2026 World Cup · the global fan hub
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mx-auto mt-5 max-w-3xl font-display text-5xl leading-[0.95] tracking-wide text-ink sm:text-7xl"
      >
        WHERE THE WORLD
        <br />
        <span className="text-fire-gradient">WATCHES THE CUP</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mx-auto mt-4 max-w-xl text-base text-ink-soft sm:text-lg"
      >
        ESPN and Google give you the info. <strong className="text-ink">FANFIRE gives you the experience</strong> —
        predict every match, react in real time, and feel the heat of fans from every nation.
      </motion.p>

      {/* Live ticker */}
      {live.length > 0 && (
        <div className="scroll-thin mt-7 flex justify-start gap-3 overflow-x-auto pb-2 sm:justify-center">
          {live.map((m) => (
            <button
              key={m.id}
              onClick={() => openMatch(m.id)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-ember/30 bg-canvas px-4 py-2 shadow-soft transition-transform hover:scale-105"
            >
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-ember">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
                {m.minute}&apos;
              </span>
              <Flag code={m.homeTeam.flag} size={16} />
              <span className="font-display text-lg tabular-nums text-ink">
                {m.homeScore}-{m.awayScore}
              </span>
              <Flag code={m.awayTeam.flag} size={16} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
