'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLiveFeed } from '@/hooks/useLiveFeed';
import { useNow } from '@/hooks/useNow';
import { useStore } from '@/store/useStore';
import { CommentItem } from './CommentItem';
import { CommentComposer } from './CommentComposer';

// 실시간 글로벌 댓글 피드 (방송 채팅창 느낌).
// matchId 가 있으면 해당 경기 전용, 없으면 전체 글로벌.
export function CommentFeed({
  matchId,
  title = 'Global Live Feed',
}: {
  matchId?: string;
  title?: string;
}) {
  const { comments, addComment, reactToComment, mounted } = useLiveFeed(matchId);
  const user = useStore((s) => s.user);
  const now = useNow();

  const handleSubmit = (body: string) => {
    if (!user) return;
    addComment({
      userId: user.id,
      matchId: matchId ?? 'global',
      nickname: user.nickname,
      countryCode: user.countryCode,
      body,
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-canvas shadow-card">
      <div className="flex items-center gap-2 border-b border-border bg-surface/60 px-4 py-2.5">
        <Globe className="h-4 w-4 text-fire-500" />
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-ink-faint">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
          {comments.length} messages
        </span>
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        {!mounted ? (
          <div className="flex h-full items-center justify-center text-sm text-ink-faint">
            Loading the heat…
          </div>
        ) : comments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-sm text-ink-faint">
            <span className="text-2xl">🔥</span>
            Be the first to light it up.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-border/50 last:border-0"
              >
                <CommentItem comment={c} onReact={reactToComment} now={now} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <CommentComposer onSubmit={handleSubmit} />
    </div>
  );
}
