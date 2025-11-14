import { usePlayerStore } from '@entities/player';
import { useTrackStore } from '@entities/track';
import { useEffect, useRef, useState } from 'react';

export const useAudioPlayer = () => {
  const { currentTrack, playNext } = useTrackStore();
  const { isPlaying, isLooping, setIsPlaying, playbackPosition, setPlaybackPosition } =
    usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const lastSavedTimeRef = useRef<number>(-1);
  const didInitialRestoreRef = useRef(false);
  const pendingRestoreRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setCurrentTime(0);
    setDuration(0);
    audio.src = currentTrack.audioUrl || '';
    audio.load();
    lastSavedTimeRef.current = -1;

    if (!didInitialRestoreRef.current && playbackPosition > 0 && isFinite(playbackPosition)) {
      pendingRestoreRef.current = playbackPosition;
    } else {
      audio.currentTime = 0;
      setPlaybackPosition(0);
      setCurrentTime(0);
    }
  }, [currentTrack, playbackPosition, setPlaybackPosition]);

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
      if (pendingRestoreRef.current !== null && isFinite(audio.duration)) {
        const target = Math.min(pendingRestoreRef.current, audio.duration - 0.25);
        audio.currentTime = Math.max(0, target);
        setCurrentTime(audio.currentTime);
        pendingRestoreRef.current = null;
        didInitialRestoreRef.current = true;
      }
    };

    const handleCanPlay = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
      if (pendingRestoreRef.current !== null && isFinite(audio.duration)) {
        const target = Math.min(pendingRestoreRef.current, audio.duration - 0.25);
        audio.currentTime = Math.max(0, target);
        setCurrentTime(audio.currentTime);
        pendingRestoreRef.current = null;
        didInitialRestoreRef.current = true;
      }
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
    if (isPlaying) {
      const promise = audio.play();
      if (promise) promise.catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      if (isFinite(audio.currentTime)) setPlaybackPosition(audio.currentTime);
    }
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
