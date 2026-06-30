import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Flag image URL from ISO alpha-2 lowercase code (flagcdn). */
export function flagUrl(code: string, size: 'w20' | 'w40' | 'w80' | 'w160' = 'w80') {
  return `https://flagcdn.com/${size}/${code.toLowerCase()}.png`;
}

/** Relative time formatter — "방금", "3분 전", "2시간 전". */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const diff = Math.floor((now - new Date(iso).getTime()) / 1000);
  if (diff < 10) return '방금';
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

/** Deterministic pseudo-random in [0,1) from a string seed (stable mock data). */
export function seededRandom(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^= h >>> 16) >>> 0) / 4294967296;
}

/** Clamp helper. */
export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Format a kickoff time for the user's locale, with stage label. */
export function formatKickoff(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const STAGE_LABEL: Record<string, string> = {
  group: 'Group Stage',
  round32: 'Round of 32',
  round16: 'Round of 16',
  quarter: 'Quarter-final',
  semi: 'Semi-final',
  final: 'Final',
};
