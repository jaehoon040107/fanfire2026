'use client';

import { motion } from 'framer-motion';
import { REACTIONS } from '@/lib/reactions';
import type { Comment, ReactionType } from '@/types';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface ReactionBarProps {
  comment: Comment;
  onReact: (commentId: string, type: ReactionType, delta: 1 | -1) => void;
  size?: 'sm' | 'md';
}

/** 댓글에 달리는 감정 반응 버튼 줄. 누른 반응은 하이라이트 + 토글. */
export function ReactionBar({ comment, onReact, size = 'sm' }: ReactionBarProps) {
  const toggleMyReaction = useStore((s) => s.toggleMyReaction);
  const myReactions = useStore((s) => s.myReactions[comment.id] ?? []);

  const handle = (type: ReactionType) => {
    const added = toggleMyReaction(comment.id, type);
    onReact(comment.id, type, added ? 1 : -1);
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {REACTIONS.map((r) => {
        const count = comment.reactions[r.type] ?? 0;
        const active = myReactions.includes(r.type);
        return (
          <motion.button
            key={r.type}
            whileTap={{ scale: 0.85 }}
            onClick={() => handle(r.type)}
            title={r.label}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border transition-colors',
              size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
              active
                ? 'border-fire-300 bg-fire-50 text-fire-700'
                : 'border-border bg-canvas text-ink-soft hover:bg-surface-2',
            )}
          >
            <span className="leading-none">{r.emoji}</span>
            {count > 0 && <span className="font-semibold tabular-nums">{count}</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
