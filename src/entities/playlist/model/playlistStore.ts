import { useTrackStore } from '@entities/track/model/trackStore';
import { filterTracksByTags, filterTracksByTagBlocks } from '@shared/lib/helpers';
import { createThrottledStorage } from '@shared/lib/throttledStorage';
import { type TTagOperation, type ITrack } from '@shared/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { IPlaylistSettings } from './types';

export const TagOperation = {
  UNION: 'union' as const,
  INTERSECTION: 'intersection' as const,
  UNION_OF_INTERSECTIONS: 'union_of_intersections' as const,
};

type TPlaylistId = string;

interface IPlaylistState {
  playlists: Record<TPlaylistId, IPlaylistSettings>;
  activePlaylistId: string | null;

  upsertPlaylist: (playlist: IPlaylistSettings) => void;
  deletePlaylist: (id: TPlaylistId) => void;
  setActivePlaylist: (id: string | null) => void;

  createFavoriteFromFilter: (
    name: string,
    tagBlocks: string[][],
    selectedTags?: string[]
  ) => string | null;

  getPlaylistById: (id: TPlaylistId) => IPlaylistSettings | undefined;
  getTracksForPlaylist: (id: TPlaylistId) => ITrack[];

  renameTagInPlaylists: (oldTag: string, newTag: string) => void;
}

export const usePlaylistStore = create<IPlaylistState>()(
  persist(
    (set, get) => ({
      playlists: {},
      activePlaylistId: null,

      upsertPlaylist: (playlist) =>
        set((state) => ({
          playlists: { ...state.playlists, [playlist.id]: playlist },
        })),

      deletePlaylist: (id) =>
        set((state) => {
          const copy = { ...state.playlists };
          delete copy[id];
          const nextActive = state.activePlaylistId === id ? null : state.activePlaylistId;
          return { playlists: copy, activePlaylistId: nextActive };
        }),

      setActivePlaylist: (id) => set({ activePlaylistId: id }),

      createFavoriteFromFilter: (name, tagBlocks, selectedTags = []) => {
        const nonEmptyBlocks = tagBlocks.filter((b) => b.length > 0);
        const effectiveBlocks =
          nonEmptyBlocks.length > 0
            ? nonEmptyBlocks
            : selectedTags.length > 0
              ? [selectedTags]
              : [];
        if (effectiveBlocks.length === 0) return null;

        const tracks = useTrackStore.getState().getLibraryTracks();
        let matched: ITrack[] = [];
        if (effectiveBlocks.length === 1) {
          matched = filterTracksByTags(tracks, effectiveBlocks[0], TagOperation.INTERSECTION);
        } else {
          matched = filterTracksByTagBlocks(tracks, effectiveBlocks);
        }
        const trackIds = matched.map((t) => t.id);

        const id = Math.random().toString(36).slice(2);
        const playlist: IPlaylistSettings = {
          id,
          name,
          isFavorite: true,
          tags: effectiveBlocks.flat(),
          tagBlocks: effectiveBlocks,
          operation: (effectiveBlocks.length > 1
            ? TagOperation.UNION_OF_INTERSECTIONS
            : effectiveBlocks[0].length > 1
              ? TagOperation.INTERSECTION
              : TagOperation.UNION) as TTagOperation,
          trackIds,
          createdAt: Date.now(),
        };

        set((state) => ({
          playlists: { ...state.playlists, [id]: playlist },
          activePlaylistId: id,
        }));
        return id;
      },

      getPlaylistById: (id) => get().playlists[id],

      getTracksForPlaylist: (id) => {
        const playlist = get().playlists[id];
        if (!playlist) return [];
        const tracks = useTrackStore.getState().getLibraryTracks();
        if (playlist.trackIds && playlist.trackIds.length > 0) {
          const setIds = new Set(playlist.trackIds);
          return tracks.filter((t) => setIds.has(t.id));
        }
        if (playlist.tagBlocks && playlist.tagBlocks.length > 0) {
          return filterTracksByTagBlocks(tracks, playlist.tagBlocks);
        }
        if (playlist.tags && playlist.tags.length > 0) {
          return filterTracksByTags(tracks, playlist.tags, playlist.operation);
        }
        return tracks;
      },

      renameTagInPlaylists: (oldTag, newTag) =>
        set((state) => {
          const updatedPlaylists: Record<TPlaylistId, IPlaylistSettings> = {};

          for (const [id, playlist] of Object.entries(state.playlists)) {
            const updatedTags = playlist.tags?.map((t: string) => (t === oldTag ? newTag : t));
            const updatedTagBlocks = playlist.tagBlocks?.map((block) =>
              block.map((t: string) => (t === oldTag ? newTag : t))
            );

            updatedPlaylists[id] = {
              ...playlist,
              tags: updatedTags,
              tagBlocks: updatedTagBlocks,
            };
          }

          return { ...state, playlists: updatedPlaylists };
        }),
    }),
    {
      name: 'playlist-store',
      storage: createThrottledStorage(1000),
      partialize: (s) => ({ playlists: s.playlists, activePlaylistId: s.activePlaylistId }),
    }
  )
);
