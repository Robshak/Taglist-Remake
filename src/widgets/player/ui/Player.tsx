import { usePlayerStore } from '@entities/player';
import { TagsLine } from '@entities/tag';
import { useTrackStore } from '@entities/track';
import NextIcon from '@shared/svg/Next.svg?react';
import PrevIcon from '@shared/svg/Prev.svg?react';
import TagIcon from '@shared/svg/Tag.svg?react';
import VolumeHighIcon from '@shared/svg/VolumeHigh.svg?react';
import VolumeLowIcon from '@shared/svg/VolumeLow.svg?react';
import VolumeMuteIcon from '@shared/svg/VolumeMute.svg?react';
import { Icon, Slider, TrackTagsManager } from '@shared/ui';
import { AnimatePresence, motion, useAnimationControls } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { ControlButton } from './ControlButton';
import { LoopToggle } from './LoopToggle';
import { NowPlayingSheet } from './NowPlayingSheet';
import s from './Player.module.scss';
import { PlayPauseButton } from './PlayPauseButton';
import { useI18n } from '../lib/Player.i18n';

export const Player = () => {
  const { t } = useI18n();
  const { currentTrack, playNext, playPrevious, tracks } = useTrackStore();
  const {
    isPlaying,
    isLooping,
    setIsPlaying,
    setIsLooping,
    volume,
    setVolume,
    toggleMute,
    playbackPosition,
    setPlaybackPosition,
  } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const lastSavedTimeRef = useRef<number>(-1);
  const didInitialRestoreRef = useRef(false);
  const pendingRestoreRef = useRef<number | null>(null);
  const [showTagsManager, setShowTagsManager] = useState(false);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1024px)').matches : false
  );
  const swiperControls = useAnimationControls();
  const infoRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsW, setDetailsW] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else
      mq.addListener(handler as unknown as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
    setIsMobile(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else
        mq.removeListener(
          handler as unknown as (this: MediaQueryList, ev: MediaQueryListEvent) => void
        );
    };
  }, []);

  // Measure details width for mobile swiper (text only) and center current slide
  useEffect(() => {
    if (!isMobile) return;
    const update = () => {
      const el = detailsRef.current;
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      setDetailsW(w);
      swiperControls.set({ x: -w });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isMobile, swiperControls]);

  // Track change: restore only once after reload, then always start at 0
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setCurrentTime(0);
    setDuration(0);
    audio.src = currentTrack.audioUrl || '';
    audio.load();
    lastSavedTimeRef.current = -1;

    if (!didInitialRestoreRef.current && playbackPosition > 0 && isFinite(playbackPosition)) {
      // Defer setting currentTime until metadata is loaded
      pendingRestoreRef.current = playbackPosition;
    } else {
      audio.currentTime = 0;
      setPlaybackPosition(0);
      setCurrentTime(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id, currentTrack?.audioUrl]);

  // Volume sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, volume));
  }, [volume]);

  // Play/pause
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentTrack?.id, setIsPlaying, setPlaybackPosition]);

  // Time & lifecycle
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

  const handleSeekEnd = () => {
    if (audioRef.current) audioRef.current.currentTime = currentTime;
  };

  // Desktop: interactive progress click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // (Mobile) swipe handled inside swiper onDragEnd

  if (!currentTrack) return null;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePrevClick = () => {
    if (currentTime > 5 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setPlaybackPosition(0);
    } else {
      playPrevious();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={s.player}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <audio ref={audioRef} preload="metadata" />
        <div className={s.container}>
          <div
            className={s.info}
            ref={infoRef}
            onClick={isMobile ? () => setIsNowPlayingOpen(true) : undefined}
            role={isMobile ? 'button' : undefined}
          >
            {isMobile ? (
              <>
                {currentTrack.imageUrl && (
                  <img
                    src={currentTrack.imageUrl}
                    alt={currentTrack.name}
                    className={s.cover}
                    onClick={() => setIsNowPlayingOpen(true)}
                  />
                )}
                <div className={s.detailsSwiper} ref={detailsRef}>
                  <motion.div
                    className={s.swiper}
                    drag="x"
                    dragConstraints={{ left: -2 * detailsW, right: 0 }}
                    animate={swiperControls}
                    onDragEnd={async (_, info) => {
                      if (!isMobile) return;
                      const dx = info.offset.x;
                      const threshold = Math.min(80, detailsW * 0.25);
                      if (dx > threshold) {
                        // snap to prev then update
                        await swiperControls.start({ x: 0, transition: { duration: 0.15 } });
                        if (currentTime > 5 && audioRef.current) {
                          audioRef.current.currentTime = 0;
                          setCurrentTime(0);
                          setPlaybackPosition(0);
                        } else {
                          playPrevious();
                        }
                        swiperControls.set({ x: -detailsW });
                      } else if (dx < -threshold) {
                        await swiperControls.start({
                          x: -2 * detailsW,
                          transition: { duration: 0.15 },
                        });
                        playNext();
                        swiperControls.set({ x: -detailsW });
                      } else {
                        swiperControls.start({ x: -detailsW, transition: { duration: 0.15 } });
                      }
                    }}
                    style={{ width: detailsW ? detailsW * 3 : '100%' }}
                  >
                    {(() => {
                      const list = tracks || [];
                      const idx = Math.max(
                        0,
                        list.findIndex((t) => t.id === currentTrack.id)
                      );
                      const prevIdx = idx === 0 ? list.length - 1 : idx - 1;
                      const nextIdx = (idx + 1) % (list.length || 1);
                      const prevTrack = list[prevIdx];
                      const nextTrack = list[nextIdx];

                      const render = (t: typeof currentTrack | undefined) => (
                        <div className={s.slide} style={{ width: detailsW || '100%' }}>
                          <div className={s.details}>
                            <div className={s.name}>{t?.name}</div>
                            <div className={s.artist}>{t?.artist}</div>
                          </div>
                        </div>
                      );

                      return (
                        <>
                          {render(prevTrack)}
                          {render(currentTrack)}
                          {render(nextTrack)}
                        </>
                      );
                    })()}
                  </motion.div>
                </div>
              </>
            ) : (
              <>
                {currentTrack.imageUrl && (
                  <img
                    src={currentTrack.imageUrl}
                    alt={currentTrack.name}
                    className={s.cover}
                    onClick={() => setIsNowPlayingOpen(true)}
                  />
                )}
                <div className={s.details}>
                  <div className={s.name} onClick={() => setIsNowPlayingOpen(true)}>
                    {currentTrack.name}
                  </div>
                  <div className={s.artist} onClick={() => setIsNowPlayingOpen(true)}>
                    {currentTrack.artist}
                  </div>
                  <TagsLine
                    tags={currentTrack.customTags || []}
                    onEdit={() => setShowTagsManager(true)}
                    maxWidth={320}
                  />
                </div>
              </>
            )}
          </div>
          {isMobile ? (
            <div className={s.actions}>
              <button
                className={s.controlBtn}
                onClick={() => setShowTagsManager(true)}
                title={t('buttons.editTags')}
              >
                <Icon component={TagIcon} width={20} height={20} />
              </button>
              <PlayPauseButton
                className={`${s.controlBtn} ${s.playBtn}`}
                isPlaying={isPlaying}
                onToggle={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? t('buttons.pause') : t('buttons.play')}
              />
            </div>
          ) : (
            <>
              <div className={s.controls}>
                <div className={s.buttons}>
                  <ControlButton
                    className={`${s.controlBtn} ${s.controlBtnSmall}`}
                    onClick={handlePrevClick}
                    title={t('buttons.previous')}
                  >
                    <Icon component={PrevIcon} width={24} height={24} />
                  </ControlButton>
                  <PlayPauseButton
                    className={`${s.controlBtn} ${s.playBtn}`}
                    isPlaying={isPlaying}
                    onToggle={() => setIsPlaying(!isPlaying)}
                    title={isPlaying ? t('buttons.pause') : t('buttons.play')}
                  />
                  <ControlButton
                    className={`${s.controlBtn} ${s.controlBtnSmall}`}
                    onClick={playNext}
                    title={t('buttons.next')}
                  >
                    <Icon component={NextIcon} width={24} height={24} />
                  </ControlButton>
                  <LoopToggle
                    className={`${s.controlBtn} ${s.controlBtnSmall}`}
                    activeClassName={s.active}
                    isActive={isLooping}
                    onToggle={() => setIsLooping(!isLooping)}
                    title={isLooping ? t('buttons.loopOn') : t('buttons.loopOff')}
                  />
                </div>
                <div className={s.progressContainer}>
                  <div className={s.time}>
                    {Math.floor(currentTime / 60)}:
                    {`${Math.floor(currentTime % 60)}`.padStart(2, '0')}
                  </div>
                  <div className={s.progressWrapper} onClick={handleProgressClick}>
                    <Slider
                      min={0}
                      max={duration || 0}
                      value={currentTime}
                      onChange={(v) => setCurrentTime(v)}
                      onCommit={() => handleSeekEnd()}
                      className={s.progress}
                      style={{
                        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${progress}%, var(--color-border) ${progress}%, var(--color-border) 100%)`,
                      }}
                      ariaLabel={t('aria.playbackPosition')}
                    />
                  </div>
                  <div className={s.time}>
                    {Math.floor(duration / 60)}:{`${Math.floor(duration % 60)}`.padStart(2, '0')}
                  </div>
                </div>
              </div>
              <div className={s.volume}>
                <button className={s.controlBtn} onClick={toggleMute}>
                  {volume === 0 ? (
                    <Icon component={VolumeMuteIcon} width={24} height={24} />
                  ) : volume < 0.5 ? (
                    <Icon component={VolumeLowIcon} width={24} height={24} />
                  ) : (
                    <Icon component={VolumeHighIcon} width={24} height={24} />
                  )}
                </button>
                <div className={s.volumeSlider}>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(v) => setVolume(v)}
                    className={s.volumeInput}
                    style={{
                      background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume * 100}%, var(--color-border) ${volume * 100}%, var(--color-border) 100%)`,
                    }}
                    ariaLabel={t('aria.volume')}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        {showTagsManager && currentTrack && (
          <TrackTagsManager track={currentTrack} onClose={() => setShowTagsManager(false)} />
        )}
        {/* Mini (non-interactive) progress bar like Spotify */}
        <div className={s.miniProgress}>
          <div className={s.miniProgressFill} style={{ width: `${progress}%` }} />
        </div>
      </motion.div>

      <NowPlayingSheet
        isOpen={isNowPlayingOpen}
        onClose={() => setIsNowPlayingOpen(false)}
        name={currentTrack.name}
        artist={currentTrack.artist}
        imageUrl={currentTrack.imageUrl || undefined}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onPrev={handlePrevClick}
        onNext={playNext}
        isLooping={isLooping}
        onToggleLoop={() => setIsLooping(!isLooping)}
        currentTime={currentTime}
        duration={duration}
        onSeek={(v) => setCurrentTime(v)}
        onSeekCommit={handleSeekEnd}
        onEditTags={() => setShowTagsManager(true)}
        volume={volume}
        onSetVolume={(v) => setVolume(v)}
        onToggleMute={toggleMute}
      />
    </AnimatePresence>
  );
};
