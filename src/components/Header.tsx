'use client';

import { Flame } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Flag } from './Flag';
import { countryName } from '@/lib/countries';

export function Header({ liveCount }: { liveCount: number }) {
  const user = useStore((s) => s.user);
  const clearUser = useStore((s) => s.clearUser);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <Flame
            className="h-6 w-6 text-fire-500 animate-flame-flicker"
            fill="currentColor"
          />
          <span className="font-display text-2xl leading-none tracking-wide text-ink">
            FAN<span className="text-fire-gradient">FIRE</span>
          </span>
        </div>

        {/* Live indicator */}
        {liveCount > 0 && (
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-ember/10 px-2.5 py-1 text-xs font-semibold text-ember">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
            </span>
            {liveCount} LIVE
          </span>
        )}

        {/* User chip */}
        {user && (
          <button
            onClick={clearUser}
            title="Change country / nickname"
            className="ml-auto flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm transition-colors hover:bg-surface-2"
          >
            <Flag code={user.countryCode} size={18} />
            <span className="max-w-[120px] truncate font-medium text-ink">
              {user.nickname}
            </span>
            <span className="hidden text-xs text-ink-faint sm:inline">
              {countryName(user.countryCode)}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
