import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IHistoryEntry {
  trackId: string;
  playedAt: number;
  position: number;
}

interface IHistoryState {
  history: IHistoryEntry[];
  addHistoryEntry: (entry: IHistoryEntry) => void;
  clearHistory: () => void;
  initHistoryFromStorage?: () => void;
}

export const useHistoryStore = create<IHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistoryEntry: (entry) => set((s) => ({ history: [entry, ...s.history].slice(0, 500) })),
      clearHistory: () => set({ history: [] }),
      initHistoryFromStorage: () => {},
    }),
    {
      name: 'history-store',
      partialize: (s) => ({ history: s.history }),
    }
  )
);
