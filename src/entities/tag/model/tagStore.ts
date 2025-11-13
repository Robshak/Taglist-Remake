import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TagState {
  allTags: string[];
  activeTags: string[];
  setAllTags: (tags: string[]) => void;
  addActiveTag: (id: string) => void;
  removeActiveTag: (id: string) => void;
  clearActiveTags: () => void;
}

export const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      allTags: [],
      activeTags: [],
      setAllTags: (allTags) => set({ allTags }),
      addActiveTag: (id) =>
        set((s) => (s.activeTags.includes(id) ? {} : { activeTags: [...s.activeTags, id] })),
      removeActiveTag: (id) => set((s) => ({ activeTags: s.activeTags.filter((t) => t !== id) })),
      clearActiveTags: () => set({ activeTags: [] }),
    }),
    {
      name: 'tag-store',
      partialize: (s) => ({ activeTags: s.activeTags }),
    }
  )
);
