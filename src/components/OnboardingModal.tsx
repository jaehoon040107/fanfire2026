'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { COUNTRIES, countryName } from '@/lib/countries';
import { detectCountry } from '@/lib/client-api';
import { createUser } from '@/lib/db';
import { Flag } from './Flag';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────
// 첫 진입 온보딩.
// 1) IP 기반 국적 자동 추천 → 유저 확인/수정
// 2) 닉네임 입력 (이메일/소셜 로그인 없음)
// → setUser 로 localStorage 영속.
// ─────────────────────────────────────────────────────────

export function OnboardingModal() {
  const onboarded = useStore((s) => s.onboarded);
  const setUser = useStore((s) => s.setUser);
  const [hydrated, setHydrated] = useState(false);
  const [country, setCountry] = useState('kr');
  const [nickname, setNickname] = useState('');
  const [detecting, setDetecting] = useState(true);
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (onboarded) return;
    detectCountry().then((code) => {
      setCountry(code);
      setDetecting(false);
    });
  }, [onboarded]);

  if (!hydrated || onboarded) return null;

  const filtered = query
    ? COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      )
    : COUNTRIES;

  const canSubmit = nickname.trim().length >= 2 && nickname.trim().length <= 16;

  const submit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    // live 모드면 Supabase 가 발급한 uuid 를, 아니면 로컬 id 를 받는다.
    const user = await createUser(nickname.trim(), country);
    setUser(user);
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="card w-full max-w-md overflow-hidden rounded-b-none sm:rounded-b-2xl"
        >
          {/* Fire header */}
          <div className="relative bg-fire-gradient px-6 py-7 text-white">
            <div className="flex items-center gap-2">
              <Flame className="h-7 w-7 animate-flame-flicker" fill="currentColor" />
              <span className="font-display text-3xl tracking-wide">FANFIRE</span>
            </div>
            <p className="mt-1 text-sm/relaxed text-white/90">
              Where the world watches the Cup. Pick your flag, drop a name, feel the heat. 🔥
            </p>
          </div>

          <div className="space-y-5 p-6">
            {/* Country */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">
                Your country
                {detecting && (
                  <span className="ml-2 text-xs font-normal text-ink-faint">
                    detecting…
                  </span>
                )}
              </label>
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-fire-200 bg-fire-50 px-3 py-2">
                <Flag code={country} size={22} />
                <span className="font-medium text-ink">{countryName(country)}</span>
                <span className="ml-auto text-xs text-fire-700">auto-picked</span>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search to change…"
                className="mb-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-fire-400"
              />
              <div className="scroll-thin grid max-h-40 grid-cols-2 gap-1 overflow-y-auto">
                {filtered.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCountry(c.code)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                      country === c.code
                        ? 'bg-fire-100 text-fire-700'
                        : 'hover:bg-surface-2',
                    )}
                  >
                    <Flag code={c.code} size={16} />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">
                Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="e.g. TaegukWarrior"
                maxLength={16}
                autoFocus
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-fire-400"
              />
              <p className="mt-1 text-xs text-ink-faint">
                2–16 characters. No email, no password — just vibes.
              </p>
            </div>

            <button
              onClick={submit}
              disabled={!canSubmit || submitting}
              className="btn-fire w-full"
            >
              <Flame className="h-4 w-4" fill="currentColor" />
              {submitting ? 'Lighting up…' : 'Enter the Fire'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
