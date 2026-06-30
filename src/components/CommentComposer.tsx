'use client';

import { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Flag } from './Flag';

const QUICK_EMOJIS = ['🔥', '😭', '🐐', '💀', '🎉', '⚽', '🙌', '😱', '❤️', '👏'];

// 댓글 입력창 (텍스트 + 이모지). 비로그인 시 입력 잠금.
export function CommentComposer({
  onSubmit,
}: {
  onSubmit: (body: string) => void;
}) {
  const user = useStore((s) => s.user);
  const [body, setBody] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const submit = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setBody('');
    setShowEmoji(false);
  };

  if (!user) {
    return (
      <div className="border-t border-border bg-surface px-4 py-3 text-center text-sm text-ink-faint">
        Pick your flag to join the conversation 🔥
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-canvas pb-safe">
      {showEmoji && (
        <div className="flex flex-wrap gap-1 border-b border-border px-3 py-2">
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setBody((b) => b + e)}
              className="rounded-lg px-2 py-1 text-xl transition-colors hover:bg-surface-2"
            >
              {e}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Flag code={user.countryCode} size={24} />
        <button
          onClick={() => setShowEmoji((v) => !v)}
          className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-fire-500"
          aria-label="emoji"
        >
          <Smile className="h-5 w-5" />
        </button>
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Drop your take…"
          maxLength={280}
          className="min-w-0 flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-fire-400"
        />
        <button
          onClick={submit}
          disabled={!body.trim()}
          className="btn-fire shrink-0 !px-3 !py-2"
          aria-label="send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
