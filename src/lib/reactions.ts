import type { ReactionType } from '@/types';

export interface ReactionDef {
  type: ReactionType;
  emoji: string;
  label: string; // English (global audience)
  labelKo: string;
  /** Weight contributed to a country's "heat" score. */
  heat: number;
}

// 기획 확정: 🔥 열정 / 😭 충격 / 🐐 레전드 / 💀 탈락각 / 🎉 축하
export const REACTIONS: ReactionDef[] = [
  { type: 'fire', emoji: '🔥', label: 'Hype', labelKo: '열정', heat: 2 },
  { type: 'shock', emoji: '😭', label: 'Shock', labelKo: '충격', heat: 1 },
  { type: 'goat', emoji: '🐐', label: 'Legend', labelKo: '레전드', heat: 1.5 },
  { type: 'dead', emoji: '💀', label: 'Done', labelKo: '탈락각', heat: 0.5 },
  { type: 'party', emoji: '🎉', label: 'Party', labelKo: '축하', heat: 1.5 },
];

export const REACTION_MAP: Record<ReactionType, ReactionDef> = REACTIONS.reduce(
  (acc, r) => ({ ...acc, [r.type]: r }),
  {} as Record<ReactionType, ReactionDef>,
);
