import { createThrottledStorage } from '@shared/lib/throttledStorage';
import type { ITrack } from '@shared/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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
    immer((set, get) => ({
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

          state.tracks = mergedIncoming;
          state.libraryTracks = newLibrary;
          state.allCustomTags = Array.from(allTags);
        }),
      setCurrentTrack: (track) =>
        set((state) => {
          state.currentTrack = track;
        }),
      playNext: () =>
        set((state) => {
          if (!state.currentTrack || state.tracks.length === 0) return;
          const idx = state.tracks.findIndex((t) => t.id === state.currentTrack!.id);
          const nextIdx = (idx + 1) % state.tracks.length;
          state.currentTrack = state.tracks[nextIdx];
        }),
      playPrevious: () =>
        set((state) => {
          if (!state.currentTrack || state.tracks.length === 0) return;
          const idx = state.tracks.findIndex((t) => t.id === state.currentTrack!.id);
          const prevIdx = idx === 0 ? state.tracks.length - 1 : idx - 1;
          state.currentTrack = state.tracks[prevIdx];
        }),
      addTrackCustomTag: (trackId, tag) =>
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track && !track.customTags?.includes(tag)) {
            if (!track.customTags) track.customTags = [];
            track.customTags.push(tag);
          }

          const libTrack = state.libraryTracks.find((t) => t.id === trackId);
          if (libTrack && !libTrack.customTags?.includes(tag)) {
            if (!libTrack.customTags) libTrack.customTags = [];
            libTrack.customTags.push(tag);
          }

          if (state.currentTrack?.id === trackId && !state.currentTrack.customTags?.includes(tag)) {
            if (!state.currentTrack.customTags) state.currentTrack.customTags = [];
            state.currentTrack.customTags.push(tag);
          }

          if (!state.allCustomTags.includes(tag)) {
            state.allCustomTags.push(tag);
          }
        }),
      removeTrackCustomTag: (trackId, tag) =>
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track?.customTags) {
            track.customTags = track.customTags.filter((ct) => ct !== tag);
          }

          const libTrack = state.libraryTracks.find((t) => t.id === trackId);
          if (libTrack?.customTags) {
            libTrack.customTags = libTrack.customTags.filter((ct) => ct !== tag);
          }

          if (state.currentTrack?.id === trackId && state.currentTrack.customTags) {
            state.currentTrack.customTags = state.currentTrack.customTags.filter(
              (ct) => ct !== tag
            );
          }
        }),
      createCustomTag: (tag) =>
        set((state) => {
          if (!state.allCustomTags.includes(tag)) {
            state.allCustomTags.push(tag);
          }
        }),
      deleteCustomTag: (tag) =>
        set((state) => {
          state.tracks.forEach((t) => {
            if (t.customTags) {
              t.customTags = t.customTags.filter((ct) => ct !== tag);
            }
          });

          state.libraryTracks.forEach((t) => {
            if (t.customTags) {
              t.customTags = t.customTags.filter((ct) => ct !== tag);
            }
          });

          if (state.currentTrack?.customTags) {
            state.currentTrack.customTags = state.currentTrack.customTags.filter(
              (ct) => ct !== tag
            );
          }

          state.allCustomTags = state.allCustomTags.filter((ct) => ct !== tag);
        }),
      renameCustomTag: (oldTag, newTag) =>
        set((state) => {
          if (oldTag === newTag || state.allCustomTags.includes(newTag)) return;

          state.tracks.forEach((t) => {
            if (t.customTags?.includes(oldTag)) {
              t.customTags = t.customTags.map((ct) => (ct === oldTag ? newTag : ct));
            }
          });

          state.libraryTracks.forEach((t) => {
            if (t.customTags?.includes(oldTag)) {
              t.customTags = t.customTags.map((ct) => (ct === oldTag ? newTag : ct));
            }
          });

          if (state.currentTrack?.customTags?.includes(oldTag)) {
            state.currentTrack.customTags = state.currentTrack.customTags.map((ct) =>
              ct === oldTag ? newTag : ct
            );
          }

          const idx = state.allCustomTags.indexOf(oldTag);
          if (idx !== -1) {
            state.allCustomTags[idx] = newTag;
          }
        }),
      getAvailableTags: (() => {
        let cachedTags: string[] | null = null;
        let lastAllCustomTags: string[] | null = null;

        return (): string[] => {
          const state = get();

          if (
            cachedTags &&
            lastAllCustomTags &&
            lastAllCustomTags.length === state.allCustomTags.length &&
            lastAllCustomTags.every((tag, idx) => tag === state.allCustomTags[idx])
          ) {
            return cachedTags;
          }

          lastAllCustomTags = [...state.allCustomTags];
          cachedTags = Array.from(new Set<string>(state.allCustomTags)).sort();
          return cachedTags;
        };
      })(),
      getLibraryTracks: () => get().libraryTracks,
    })),
    {
      name: 'track-store',
      storage: createThrottledStorage(1000),
      partialize: (state) => ({
        tracks: state.tracks,
        libraryTracks: state.libraryTracks,
        currentTrack: state.currentTrack,
        allCustomTags: state.allCustomTags,
      }),
    }
  )
);
