'use client';

import { create } from 'zustand';
import type { Match, ShareCardData } from '@/types';

// 비영속 UI 상태 (오버레이/선택/공유카드/현재 경기목록).

interface UIState {
  selectedMatchId: string | null;
  shareCard: ShareCardData | null;
  matches: Match[]; // 서버에서 받은 단일 진실 소스(mock/live 공통)
  openMatch: (id: string) => void;
  closeMatch: () => void;
  openShareCard: (card: ShareCardData) => void;
  closeShareCard: () => void;
  setMatches: (matches: Match[]) => void;
  getMatch: (id: string | null) => Match | undefined;
}

export const useUI = create<UIState>((set, get) => ({
  selectedMatchId: null,
  shareCard: null,
  matches: [],
  openMatch: (id) => set({ selectedMatchId: id }),
  closeMatch: () => set({ selectedMatchId: null }),
  openShareCard: (card) => set({ shareCard: card }),
  closeShareCard: () => set({ shareCard: null }),
  setMatches: (matches) => set({ matches }),
  getMatch: (id) => (id ? get().matches.find((m) => m.id === id) : undefined),
}));
