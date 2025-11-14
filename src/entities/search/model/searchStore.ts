import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ISearchState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<ISearchState>()(
  persist(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),
      clearSearch: () => set({ searchQuery: '' }),
    }),
    {
      name: 'search-store',
      partialize: (s) => ({ searchQuery: s.searchQuery }),
    }
  )
);
