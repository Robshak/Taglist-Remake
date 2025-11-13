import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {
  volume: number;
  previousVolume: number;
  isLooping: boolean;
  isPlaying: boolean;
  playbackPosition: number;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  setIsPlaying: (p: boolean) => void;
  setPlaybackPosition: (secs: number) => void;
  setIsLooping: (v: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      volume: 1,
      previousVolume: 1,
      isLooping: false,
      isPlaying: false,
      playbackPosition: 0,
      setVolume: (v) =>
        set((s) => {
          const newVolume = Math.min(1, Math.max(0, v));
          return {
            volume: newVolume,
            previousVolume: newVolume > 0 ? newVolume : s.previousVolume,
          };
        }),
      toggleMute: () =>
        set((s) => {
          if (s.volume > 0) {
            return { volume: 0, previousVolume: s.volume };
          } else {
            return { volume: s.previousVolume > 0 ? s.previousVolume : 0.5 };
          }
        }),
      toggleLoop: () => set((s) => ({ isLooping: !s.isLooping })),
      setIsPlaying: (p) => set({ isPlaying: p }),
      setPlaybackPosition: (secs) => set({ playbackPosition: Math.max(0, secs) }),
      setIsLooping: (v) => set({ isLooping: v }),
    }),
    {
      name: 'player-store',
      partialize: (state) => ({
        volume: state.volume,
        previousVolume: state.previousVolume,
        isLooping: state.isLooping,
        playbackPosition: state.playbackPosition,
      }),
    }
  )
);
