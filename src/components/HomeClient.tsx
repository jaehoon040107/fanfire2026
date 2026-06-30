'use client';

import type { Match } from '@/types';
import { Header } from './Header';
import { Hero } from './Hero';
import { TournamentBracket } from './TournamentBracket';
import { CommentFeed } from './CommentFeed';
import { AccuracyRanking } from './Insights';
import { OnboardingModal } from './OnboardingModal';
import { MatchDetail } from './MatchDetail';
import { ShareCardModal } from './ShareCardModal';
import { Flame } from 'lucide-react';

export function HomeClient({ matches }: { matches: Match[] }) {
  const liveCount = matches.filter(
    (m) => m.status === 'live' || m.status === 'halftime',
  ).length;

  return (
    <>
      <Header liveCount={liveCount} />

      <main className="pb-16">
        <Hero matches={matches} />

        <div className="mt-6">
          <TournamentBracket matches={matches} />
        </div>

        {/* 하단: 실시간 글로벌 피드 + 국가 랭킹 */}
        <section className="mx-auto mt-10 grid w-full max-w-6xl gap-4 px-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-[560px]">
            <CommentFeed title="🔥 Global Live Feed — every match, every nation" />
          </div>
          <div className="space-y-4">
            <AccuracyRanking />
            <div className="card bg-fire-gradient-soft p-5">
              <p className="font-display text-2xl leading-tight text-ink">
                Your nation is counting on you.
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Every prediction you make lifts your country up the leaderboard. Pick
                smart. Represent. 🌍
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Flame className="h-4 w-4 text-fire-500" fill="currentColor" />
          <span className="font-display text-lg tracking-wide text-ink">FANFIRE</span>
        </div>
        <p className="mt-1 text-xs text-ink-faint">
          fanfire2026.com · Where the world watches the Cup · Not affiliated with FIFA
        </p>
      </footer>

      {/* Overlays */}
      <OnboardingModal />
      <MatchDetail />
      <ShareCardModal />
    </>
  );
}
