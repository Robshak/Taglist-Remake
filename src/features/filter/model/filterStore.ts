import { TagOperation } from '@entities/playlist';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  selectedTags: string[];
  tagBlocks: string[][];
  tagOperation: (typeof TagOperation)[keyof typeof TagOperation];
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  addTagBlock: (initialTags?: string[]) => void;
  addTagToBlock: (blockIndex: number, tag: string) => void;
  removeTagFromBlock: (blockIndex: number, tag: string) => void;
  deleteTagBlock: (blockIndex: number) => void;
  setTagOperation: (op: (typeof TagOperation)[keyof typeof TagOperation]) => void;
  resetFilter: () => void;
  renameTagInFilter: (oldTag: string, newTag: string) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      selectedTags: [],
      tagBlocks: [],
      tagOperation: TagOperation.UNION,
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      toggleTag: (tag) => {
        const { selectedTags } = get();
        set({
          selectedTags: selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag],
        });
      },
      addTagBlock: (initialTags = []) =>
        set((s) => ({ tagBlocks: [...s.tagBlocks, [...initialTags]] })),
      addTagToBlock: (blockIndex, tag) =>
        set((s) => {
          if (!s.tagBlocks[blockIndex]) return s;
          const block = s.tagBlocks[blockIndex];
          if (block.includes(tag)) return s;
          const updated = s.tagBlocks.map((b, i) => (i === blockIndex ? [...b, tag] : b));
          return { ...s, tagBlocks: updated };
        }),
      removeTagFromBlock: (blockIndex, tag) =>
        set((s) => {
          if (!s.tagBlocks[blockIndex]) return s;
          const updated = s.tagBlocks.map((b, i) =>
            i === blockIndex ? b.filter((t) => t !== tag) : b
          );
          return { ...s, tagBlocks: updated };
        }),
      deleteTagBlock: (blockIndex) =>
        set((s) => ({ tagBlocks: s.tagBlocks.filter((_, i) => i !== blockIndex) })),
      setTagOperation: (op) => set({ tagOperation: op }),
      resetFilter: () => set({ selectedTags: [], tagBlocks: [], tagOperation: TagOperation.UNION }),
      renameTagInFilter: (oldTag, newTag) =>
        set((s) => {
          const selectedTags = s.selectedTags.map((t) => (t === oldTag ? newTag : t));
          const tagBlocks = s.tagBlocks.map((block) =>
            block.map((t) => (t === oldTag ? newTag : t))
          );
          return { ...s, selectedTags, tagBlocks };
        }),
    }),
    {
      name: 'filter-store',
      partialize: (s) => ({
        selectedTags: s.selectedTags,
        tagBlocks: s.tagBlocks,
        tagOperation: s.tagOperation,
      }),
    }
  )
);
