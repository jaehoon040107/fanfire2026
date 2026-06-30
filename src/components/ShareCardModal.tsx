'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Share2, X } from 'lucide-react';
import { useUI } from '@/store/useUI';
import { Flag } from './Flag';
import { countryName } from '@/lib/countries';
import type { ShareCardKind } from '@/types';

const KIND_META: Record<ShareCardKind, { emoji: string; tag: string }> = {
  rarity: { emoji: '💎', tag: 'RARE PICK' },
  journey: { emoji: '🗺️', tag: 'MY JOURNEY' },
  national: { emoji: '🦁', tag: 'NATIONAL HERO' },
};

export function ShareCardModal() {
  const card = useUI((s) => s.shareCard);
  const close = useUI((s) => s.closeShareCard);

  const share = async () => {
    if (!card) return;
    const text = `${card.title} — ${card.stat} on FANFIRE 🔥 #WorldCup2026 #FANFIRE`;
    if (navigator.share) {
      await navigator.share({ title: 'FANFIRE', text, url: 'https://fanfire2026.com' }).catch(() => {});
    } else {
      await navigator.clipboard?.writeText(`${text}  https://fanfire2026.com`).catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 22 }}
            className="w-full max-w-sm"
          >
            {/* The card */}
            <div className="relative overflow-hidden rounded-3xl bg-fire-gradient p-6 text-white shadow-overlay">
              <div className="absolute -right-8 -top-8 text-[140px] opacity-20">
                {KIND_META[card.kind].emoji}
              </div>
              <div className="relative">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-5 w-5" fill="currentColor" />
                  <span className="font-display text-xl tracking-wide">FANFIRE</span>
                </div>

                <span className="mt-4 inline-block rounded-full bg-white/25 px-3 py-1 text-[11px] font-bold tracking-widest">
                  {KIND_META[card.kind].tag}
                </span>

                <h3 className="mt-3 font-display text-4xl leading-none tracking-wide">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-white/90">{card.subtitle}</p>

                <div className="mt-5 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                  <p className="font-display text-3xl">{card.stat}</p>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <Flag code={card.countryCode} size={22} />
                  <span className="font-semibold">{card.nickname}</span>
                  <span className="text-sm text-white/80">
                    · {countryName(card.countryCode)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={share} className="btn-fire flex-1">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button onClick={close} className="btn-ghost">
                <X className="h-4 w-4" /> Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
