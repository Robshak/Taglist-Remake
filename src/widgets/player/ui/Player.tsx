import { usePlayerStore } from '@entities/player';
import { useTrackStore } from '@entities/track';
import { TrackTagsManager } from '@shared/ui';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';

import { useI18n } from '../lib/Player.i18n';
import { useAudioPlayer, useMobileDetect, useMobileSwiper, useVolumeControl } from '../model';
import { DesktopControls } from './DesktopControls';
import { MobileActions } from './MobileActions';
import { NowPlayingSheet } from './NowPlayingSheet';
import s from './Player.module.scss';
import { PlayerInfo } from './PlayerInfo';
import { VolumeControl } from './VolumeControl';

export const Player = () => {
  const { t } = useI18n();

  const currentTrack = useTrackStore((state) => state.currentTrack);
  const playNext = useTrackStore((state) => state.playNext);
  const playPrevious = useTrackStore((state) => state.playPrevious);
  const tracks = useTrackStore((state) => state.tracks);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isLooping = usePlayerStore((state) => state.isLooping);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const setIsLooping = usePlayerStore((state) => state.setIsLooping);
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const toggleMute = usePlayerStore((state) => state.toggleMute);

  const {
    audioRef,
    currentTime,
    duration,
    progress,
    handleSeek,
    handleSeekCommit,
    handleProgressClick,
  } = useAudioPlayer();
  const isMobile = useMobileDetect();
  const { swiperControls, detailsRef, detailsW } = useMobileSwiper(isMobile);
  useVolumeControl(audioRef);

  const [showTagsManager, setShowTagsManager] = useState(false);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);

  const handlePrevClick = () => {
    if (currentTime > 5 && audioRef.current) {
      audioRef.current.currentTime = 0;
      handleSeek(0);
    } else {
      playPrevious();
    }
  };

  const handleSwipe = useCallback(
    async (dx: number) => {
      const threshold = Math.min(80, detailsW * 0.25);
      if (dx > threshold) {
        await swiperControls.start({ x: 0, transition: { duration: 0.15 } });
        if (currentTime > 5 && audioRef.current) {
          audioRef.current.currentTime = 0;
          handleSeek(0);
        } else {
          playPrevious();
        }
        swiperControls.set({ x: -detailsW });
      } else if (dx < -threshold) {
        await swiperControls.start({ x: -2 * detailsW, transition: { duration: 0.15 } });
        playNext();
        swiperControls.set({ x: -detailsW });
      } else {
        swiperControls.start({ x: -detailsW, transition: { duration: 0.15 } });
      }
    },
    [detailsW, swiperControls, currentTime, audioRef, handleSeek, playPrevious, playNext]
  );

  const handleOpenNowPlaying = useCallback(() => setIsNowPlayingOpen(true), []);
  const handleCloseNowPlaying = useCallback(() => setIsNowPlayingOpen(false), []);
  const handleOpenTags = useCallback(() => setShowTagsManager(true), []);
  const handleCloseTags = useCallback(() => setShowTagsManager(false), []);

  const mobileTranslations = useMemo(
    () => ({
      play: t('buttons.play'),
      pause: t('buttons.pause'),
      editTags: t('buttons.editTags'),
    }),
    [t]
  );

  const desktopTranslations = useMemo(
    () => ({
      play: t('buttons.play'),
      pause: t('buttons.pause'),
      previous: t('buttons.previous'),
      next: t('buttons.next'),
      loopOn: t('buttons.loopOn'),
      loopOff: t('buttons.loopOff'),
      playbackPosition: t('aria.playbackPosition'),
    }),
    [t]
  );

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="player"
        className={s.player}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <audio ref={audioRef} preload="metadata" />
        <div className={s.container}>
          <PlayerInfo
            currentTrack={currentTrack}
            isMobile={isMobile}
            onOpenNowPlaying={handleOpenNowPlaying}
            onEditTags={handleOpenTags}
            swiper={
              isMobile
                ? {
                    controls: swiperControls,
                    detailsRef,
                    detailsW,
                    onSwipe: handleSwipe,
                  }
                : undefined
            }
            tracks={tracks}
          />
          {isMobile ? (
            <MobileActions
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onEditTags={handleOpenTags}
              translations={mobileTranslations}
            />
          ) : (
            <>
              <DesktopControls
                playbackState={{
                  isPlaying,
                  isLooping,
                }}
                progressState={{
                  currentTime,
                  duration,
                  progress,
                }}
                playbackHandlers={{
                  onTogglePlay: () => setIsPlaying(!isPlaying),
                  onPrev: handlePrevClick,
                  onNext: playNext,
                  onToggleLoop: () => setIsLooping(!isLooping),
                }}
                progressHandlers={{
                  onSeek: handleSeek,
                  onSeekCommit: handleSeekCommit,
                  onProgressClick: handleProgressClick,
                }}
                translations={desktopTranslations}
              />
              <VolumeControl
                volume={volume}
                onVolumeChange={setVolume}
                onToggleMute={toggleMute}
                ariaLabel={t('aria.volume')}
              />
            </>
          )}
        </div>
        {showTagsManager && currentTrack && (
          <TrackTagsManager track={currentTrack} onClose={handleCloseTags} />
        )}
        <div className={s.miniProgress}>
          <div className={s.miniProgressFill} style={{ width: `${progress}%` }} />
        </div>
      </motion.div>

      <NowPlayingSheet
        key="now-playing-sheet"
        isOpen={isNowPlayingOpen}
        onClose={handleCloseNowPlaying}
        trackInfo={{
          name: currentTrack.name,
          artist: currentTrack.artist,
          imageUrl: currentTrack.imageUrl || undefined,
        }}
        playbackControls={{
          isPlaying,
          onTogglePlay: () => setIsPlaying(!isPlaying),
          onPrev: handlePrevClick,
          onNext: playNext,
          isLooping,
          onToggleLoop: () => setIsLooping(!isLooping),
        }}
        progressState={{
          currentTime,
          duration,
          onSeek: handleSeek,
          onSeekCommit: handleSeekCommit,
        }}
        volumeControl={{
          volume,
          onSetVolume: setVolume,
          onToggleMute: toggleMute,
        }}
        onEditTags={handleOpenTags}
      />
    </AnimatePresence>
  );
};
