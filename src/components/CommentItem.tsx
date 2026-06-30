'use client';

import { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import type { Comment, ReactionType } from '@/types';
import { Flag } from './Flag';
import { ReactionBar } from './ReactionBar';
import { timeAgo } from '@/lib/utils';
import { translateText } from '@/lib/client-api';

// 한 개의 댓글. 번역은 버튼 클릭 시에만 (자동 번역 X).
export function CommentItem({
  comment,
  onReact,
  now,
}: {
  comment: Comment;
  onReact: (id: string, type: ReactionType, delta: 1 | -1) => void;
  now: number;
}) {
  const [translated, setTranslated] = useState<string | null>(
    comment.translatedBody ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleTranslate = async () => {
    if (translated) {
      setShowOriginal((v) => !v);
      return;
    }
    setLoading(true);
    const result = await translateText(comment.body, 'en');
    setTranslated(result);
    setLoading(false);
  };

  return (
    <div className="group flex gap-2.5 px-4 py-2.5 transition-colors hover:bg-surface/60">
      <Flag code={comment.countryCode} size={22} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-semibold text-ink">
            {comment.nickname}
          </span>
          <span className="shrink-0 text-[11px] text-ink-faint">
            {timeAgo(comment.createdAt, now)}
          </span>
        </div>

        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm/relaxed text-ink-soft">
          {translated && !showOriginal ? translated : comment.body}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <ReactionBar comment={comment} onReact={onReact} />
          <button
            onClick={handleTranslate}
            className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-ink-faint opacity-0 transition-opacity hover:text-fire-600 group-hover:opacity-100"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Languages className="h-3 w-3" />
            )}
            {translated ? (showOriginal ? 'Show translation' : 'Show original') : 'Translate'}
          </button>
        </div>
      </div>
    </div>
  );
}
