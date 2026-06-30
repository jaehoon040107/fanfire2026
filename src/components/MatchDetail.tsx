'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Trophy, X } from 'lucide-react';
import { useUI } from '@/store/useUI';
import { getMatchById } from '@/data/matches';
import { Flag } from './Flag';
import { CommentFeed } from './CommentFeed';
import { PredictionPanel } from './PredictionPanel';
import { HalftimePanel } from './HalftimePanel';
import {
  CountryHeatmap,
  GlobalPredictionRatio,
  SentimentShift,
} from './Insights';
import { STAGE_LABEL, cn, formatKickoff } from '@/lib/utils';

type Tab = 'predict' | 'chat';

// 경기 상세.
// - 데스크탑: 화면 중앙 오버레이 패널(70~80%, 배경 dim), 좌(예측/스탯) + 우(채팅) 동시 노출.
// - 모바일: 바텀시트 + 탭(예측 / 채팅) 전환.
// 우선순위: 댓글 = 승부예측 > 대진표.
export function MatchDetail() {
  const selectedId = useUI((s) => s.selectedMatchId);
  const close = useUI((s) => s.closeMatch);
  const [tab, setTab] = useState<Tab>('predict');

  const match = selectedId ? getMatchById(selectedId) : undefined;

  return (
    <AnimatePresence>
      {match && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-canvas shadow-overlay sm:max-h-[82vh] sm:max-w-5xl sm:rounded-3xl"
          >
            {/* ── Score header ── */}
            <div className="relative shrink-0 bg-fire-gradient-soft px-5 pb-4 pt-4">
              <button
                onClick={close}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/70 text-ink-soft transition-colors hover:bg-canvas"
              >
                <X className="h-4 w-4" />
              </button>
              {/* mobile drag handle */}
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15 sm:hidden" />

              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-fire-700">
                <span>{STAGE_LABEL[match.stage]}</span>
                {match.status === 'live' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ember px-2 py-0.5 text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    {match.minute}&apos;
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-5">
                <div className="flex flex-1 flex-col items-center gap-1.5">
                  <Flag code={match.homeTeam.flag} size={40} />
                  <span className="text-center text-sm font-bold text-ink">
                    {match.homeTeam.name}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  {match.status === 'scheduled' ? (
                    <span className="font-display text-xl text-ink-soft">VS</span>
                  ) : (
                    <span className="font-display text-4xl tabular-nums text-ink">
                      {match.homeScore} <span className="text-ink-faint">:</span>{' '}
                      {match.awayScore}
                    </span>
                  )}
                  <span className="mt-1 text-[11px] text-ink-faint">
                    {match.status === 'scheduled'
                      ? formatKickoff(match.scheduledAt)
                      : match.status === 'finished'
                        ? 'Full time'
                        : 'In play'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col items-center gap-1.5">
                  <Flag code={match.awayTeam.flag} size={40} />
                  <span className="text-center text-sm font-bold text-ink">
                    {match.awayTeam.name}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Mobile tabs ── */}
            <div className="flex shrink-0 border-b border-border lg:hidden">
              <TabButton
                active={tab === 'predict'}
                onClick={() => setTab('predict')}
                icon={<Trophy className="h-4 w-4" />}
                label="Predict & Stats"
              />
              <TabButton
                active={tab === 'chat'}
                onClick={() => setTab('chat')}
                icon={<MessageSquare className="h-4 w-4" />}
                label="Live Chat"
              />
            </div>

            {/* ── Body ── */}
            <div className="grid min-h-0 flex-1 lg:grid-cols-2">
              {/* Predict & stats */}
              <div
                className={cn(
                  'scroll-thin min-h-0 space-y-3 overflow-y-auto p-4 lg:border-r lg:border-border',
                  tab === 'predict' ? 'block' : 'hidden lg:block',
                )}
              >
                <PredictionPanel match={match} />
                <HalftimePanel match={match} />
                <GlobalPredictionRatio match={match} />
                <CountryHeatmap match={match} />
                <SentimentShift match={match} />
              </div>

              {/* Live chat */}
              <div
                className={cn(
                  'min-h-0 p-4',
                  tab === 'chat' ? 'block' : 'hidden lg:block',
                )}
              >
                <CommentFeed
                  matchId={match.id}
                  title={`${match.homeTeam.shortName} vs ${match.awayTeam.shortName} · Live`}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors',
        active
          ? 'border-b-2 border-fire-500 text-fire-600'
          : 'text-ink-faint',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
