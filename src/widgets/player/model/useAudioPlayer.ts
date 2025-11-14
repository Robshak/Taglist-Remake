import { usePlayerStore } from '@entities/player';
import { useTrackStore } from '@entities/track';
import { useEffect, useRef, useState } from 'react';

export const useAudioPlayer = () => {
  const { currentTrack, playNext } = useTrackStore();
  const { isPlaying, isLooping, setIsPlaying, setPlaybackPosition } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const lastSavedTimeRef = useRef<number>(-1);
  const currentTrackIdRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const isNewTrack = currentTrackIdRef.current !== currentTrack.id;
    if (isNewTrack) {
      currentTrackIdRef.current = currentTrack.id;

      audio.pause();
      setCurrentTime(0);
      setDuration(0);
      audio.src = currentTrack.audioUrl || '';
      audio.load();
      lastSavedTimeRef.current = -1;
      audio.currentTime = 0;
      setPlaybackPosition(0);
    }
  }, [currentTrack, setPlaybackPosition]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const persistProgress = () => {
      if (audio && isFinite(audio.currentTime)) {
        setPlaybackPosition(audio.currentTime);
      }
    };

    const handleTimeUpdate = () => {
      if (isFinite(audio.currentTime) && audio.src) {
        setCurrentTime(audio.currentTime);
        if (
          lastSavedTimeRef.current < 0 ||
          Math.abs(audio.currentTime - lastSavedTimeRef.current) >= 0.5
        ) {
          setPlaybackPosition(audio.currentTime);
          lastSavedTimeRef.current = audio.currentTime;
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };

    const handleCanPlay = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };

    const handleDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', persistProgress);
    window.addEventListener('pagehide', persistProgress);
    window.addEventListener('beforeunload', persistProgress);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', persistProgress);
      window.removeEventListener('pagehide', persistProgress);
      window.removeEventListener('beforeunload', persistProgress);
    };
  }, [isLooping, playNext, setPlaybackPosition]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let isCancelled = false;

    if (isPlaying) {
      const promise = audio.play();
      if (promise) {
        promise.catch((error) => {
          if (!isCancelled && error.name !== 'AbortError') {
            setIsPlaying(false);
          }
        });
      }
    } else {
      audio.pause();
      if (isFinite(audio.currentTime)) setPlaybackPosition(audio.currentTime);
    }

    return () => {
      isCancelled = true;
    };
  }, [isPlaying, currentTrack, setIsPlaying, setPlaybackPosition]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleSeekCommit = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    audioRef,
    currentTime,
    duration,
    progress,
    handleSeek,
    handleSeekCommit,
    handleProgressClick,
  };
};
