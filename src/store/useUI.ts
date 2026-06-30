'use client';

import { create } from 'zustand';
import type { ShareCardData } from '@/types';

// 비영속 UI 상태 (오버레이/선택/공유카드).

interface UIState {
  selectedMatchId: string | null;
  shareCard: ShareCardData | null;
  openMatch: (id: string) => void;
  closeMatch: () => void;
  openShareCard: (card: ShareCardData) => void;
  closeShareCard: () => void;
}

export const useUI = create<UIState>((set) => ({
  selectedMatchId: null,
  shareCard: null,
  openMatch: (id) => set({ selectedMatchId: id }),
  closeMatch: () => set({ selectedMatchId: null }),
  openShareCard: (card) => set({ shareCard: card }),
  closeShareCard: () => set({ shareCard: null }),
}));
