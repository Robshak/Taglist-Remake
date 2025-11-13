import type { ITrack } from '@shared/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ITrackState {
  tracks: ITrack[];
  libraryTracks: ITrack[];
  currentTrack: ITrack | null;
  setTracks: (tracks: ITrack[]) => void;
  setCurrentTrack: (track: ITrack | null) => void;
  playNext: () => void;
  playPrevious: () => void;
  allCustomTags: string[];
  addTrackCustomTag: (trackId: string, tag: string) => void;
  removeTrackCustomTag: (trackId: string, tag: string) => void;
  createCustomTag: (tag: string) => void;
  deleteCustomTag: (tag: string) => void;
  renameCustomTag: (oldTag: string, newTag: string) => void;
  getAvailableTags: () => string[];
  getLibraryTracks: () => ITrack[];
}

export const useTrackStore = create<ITrackState>()(
  persist(
    (set, get) => ({
      tracks: [],
      libraryTracks: [],
      currentTrack: null,
      allCustomTags: ['Like'],
      setTracks: (incoming) =>
        set((state) => {
          const libIndex = new Map(state.libraryTracks.map((t) => [t.id, t] as const));
          const mergedIncoming: ITrack[] = incoming.map((t) => {
            const existing = libIndex.get(t.id);
            if (existing) {
              return {
                ...t,
                customTags: existing.customTags ? [...existing.customTags] : t.customTags || [],
              };
            }
            return { ...t, customTags: t.customTags ? [...t.customTags] : [] };
          });
          for (const m of mergedIncoming) libIndex.set(m.id, m);
          const newLibrary = Array.from(libIndex.values());

          const allTags = new Set(state.allCustomTags);
          for (const track of mergedIncoming) {
            if (track.customTags) {
              track.customTags.forEach((tag: string) => allTags.add(tag));
            }
          }

          return {
            ...state,
            tracks: mergedIncoming,
            libraryTracks: newLibrary,
            allCustomTags: Array.from(allTags),
          };
        }),
      setCurrentTrack: (track) => set({ currentTrack: track }),
      playNext: () =>
        set((state) => {
          if (!state.currentTrack || state.tracks.length === 0) return state;
          const idx = state.tracks.findIndex((t) => t.id === state.currentTrack!.id);
          const nextIdx = (idx + 1) % state.tracks.length;
          return { ...state, currentTrack: state.tracks[nextIdx] };
        }),
      playPrevious: () =>
        set((state) => {
          if (!state.currentTrack || state.tracks.length === 0) return state;
          const idx = state.tracks.findIndex((t) => t.id === state.currentTrack!.id);
          const prevIdx = idx === 0 ? state.tracks.length - 1 : idx - 1;
          return { ...state, currentTrack: state.tracks[prevIdx] };
        }),
      addTrackCustomTag: (trackId, tag) =>
        set((state) => {
          const ensure = (arr: ITrack[]) =>
            arr.map((t) => {
              if (t.id !== trackId) return t;
              const setTags = new Set(t.customTags || []);
              setTags.add(tag);
              return { ...t, customTags: Array.from(setTags) };
            });
          const updatedTracks = ensure(state.tracks);
          const updatedLibrary = ensure(state.libraryTracks);
          const updatedCurrent =
            state.currentTrack?.id === trackId
              ? updatedTracks.find((t) => t.id === trackId) || state.currentTrack
              : state.currentTrack;
          const allCustomTags = state.allCustomTags.includes(tag)
            ? state.allCustomTags
            : [...state.allCustomTags, tag];
          return {
            ...state,
            tracks: updatedTracks,
            libraryTracks: updatedLibrary,
            currentTrack: updatedCurrent || null,
            allCustomTags,
          };
        }),
      removeTrackCustomTag: (trackId, tag) =>
        set((state) => {
          const strip = (arr: ITrack[]) =>
            arr.map((t) =>
              t.id === trackId
                ? { ...t, customTags: (t.customTags || []).filter((ct: string) => ct !== tag) }
                : t
            );
          const updatedTracks = strip(state.tracks);
          const updatedLibrary = strip(state.libraryTracks);
          const updatedCurrent =
            state.currentTrack?.id === trackId
              ? updatedTracks.find((t) => t.id === trackId) || state.currentTrack
              : state.currentTrack;
          return {
            ...state,
            tracks: updatedTracks,
            libraryTracks: updatedLibrary,
            currentTrack: updatedCurrent || null,
          };
        }),
      createCustomTag: (tag) =>
        set((state) =>
          state.allCustomTags.includes(tag)
            ? state
            : { ...state, allCustomTags: [...state.allCustomTags, tag] }
        ),
      deleteCustomTag: (tag) =>
        set((state) => {
          const purge = (arr: ITrack[]) =>
            arr.map((t) =>
              t.customTags
                ? { ...t, customTags: t.customTags.filter((ct: string) => ct !== tag) }
                : t
            );
          const updatedTracks = purge(state.tracks);
          const updatedLibrary = purge(state.libraryTracks);
          const updatedCurrent = state.currentTrack
            ? updatedTracks.find((t) => t.id === state.currentTrack!.id) || null
            : null;
          return {
            ...state,
            tracks: updatedTracks,
            libraryTracks: updatedLibrary,
            currentTrack: updatedCurrent,
            allCustomTags: state.allCustomTags.filter((ct) => ct !== tag),
          };
        }),
      renameCustomTag: (oldTag, newTag) =>
        set((state) => {
          if (oldTag === newTag || state.allCustomTags.includes(newTag)) return state;

          const rename = (arr: ITrack[]) =>
            arr.map((t) => {
              if (!t.customTags || !t.customTags.includes(oldTag)) return t;
              return {
                ...t,
                customTags: t.customTags.map((ct: string) => (ct === oldTag ? newTag : ct)),
              };
            });

          const updatedTracks = rename(state.tracks);
          const updatedLibrary = rename(state.libraryTracks);
          const updatedCurrent = state.currentTrack?.customTags?.includes(oldTag)
            ? {
                ...state.currentTrack,
                customTags: state.currentTrack.customTags.map((ct: string) =>
                  ct === oldTag ? newTag : ct
                ),
              }
            : state.currentTrack;

          const allCustomTags = state.allCustomTags.map((t: string) => (t === oldTag ? newTag : t));

          return {
            ...state,
            tracks: updatedTracks,
            libraryTracks: updatedLibrary,
            currentTrack: updatedCurrent,
            allCustomTags,
          };
        }),
      getAvailableTags: (): string[] => {
        const state = get();
        return Array.from(new Set<string>(state.allCustomTags)).sort();
      },
      getLibraryTracks: () => get().libraryTracks,
    }),
    {
      name: 'track-store',
      partialize: (state) => ({
        tracks: state.tracks,
        libraryTracks: state.libraryTracks,
        currentTrack: state.currentTrack,
        allCustomTags: state.allCustomTags,
      }),
    }
  )
);
