'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Prediction, ReactionType, User } from '@/types';

// ─────────────────────────────────────────────────────────
// 전역 클라이언트 상태.
// user / predictions / halftime / 내가 누른 댓글반응 → localStorage 영속.
// (Supabase 연동 시 동일 데이터를 백엔드와 동기화)
// ─────────────────────────────────────────────────────────

interface HalftimeAnswer {
  matchId: string;
  questionId: string;
  answer: string;
}

interface StoreState {
  user: User | null;
  onboarded: boolean;
  predictions: Record<string, Prediction>; // key: matchId
  halftime: Record<string, HalftimeAnswer>; // key: `${matchId}:${questionId}`
  myReactions: Record<string, ReactionType[]>; // key: commentId → 내가 누른 반응들

  setUser: (user: User) => void;
  clearUser: () => void;
  setPrediction: (p: Prediction) => void;
  setHalftime: (a: HalftimeAnswer) => void;
  toggleMyReaction: (commentId: string, type: ReactionType) => boolean; // 반환: 추가됨(true)/제거됨(false)
  hasReacted: (commentId: string, type: ReactionType) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      onboarded: false,
      predictions: {},
      halftime: {},
      myReactions: {},

      setUser: (user) => set({ user, onboarded: true }),
      clearUser: () => set({ user: null, onboarded: false }),

      setPrediction: (p) =>
        set((s) => ({ predictions: { ...s.predictions, [p.matchId]: p } })),

      setHalftime: (a) =>
        set((s) => ({
          halftime: { ...s.halftime, [`${a.matchId}:${a.questionId}`]: a },
        })),

      toggleMyReaction: (commentId, type) => {
        const current = get().myReactions[commentId] ?? [];
        const exists = current.includes(type);
        const next = exists
          ? current.filter((t) => t !== type)
          : [...current, type];
        set((s) => ({ myReactions: { ...s.myReactions, [commentId]: next } }));
        return !exists;
      },

      hasReacted: (commentId, type) =>
        (get().myReactions[commentId] ?? []).includes(type),
    }),
    {
      name: 'fanfire-store',
      partialize: (s) => ({
        user: s.user,
        onboarded: s.onboarded,
        predictions: s.predictions,
        halftime: s.halftime,
        myReactions: s.myReactions,
      }),
    },
  ),
);
