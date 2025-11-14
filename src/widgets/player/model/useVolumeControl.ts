import { usePlayerStore } from '@entities/player';
import { useEffect, type RefObject } from 'react';

export const useVolumeControl = (audioRef: RefObject<HTMLAudioElement | null>) => {
  const { volume } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, volume));
  }, [volume, audioRef]);
};
