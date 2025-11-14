import { usePlayerStore } from '@entities/player';
import { useTrackStore } from '@entities/track';
import { formatDuration, useOptimizedImage } from '@shared/lib/helpers.ts';
import PlayIcon from '@shared/svg/Play.svg?react';
import type { ITrack } from '@shared/types';
import { Equalizer, Icon, TagsLine } from '@shared/ui';
import { motion } from 'motion/react';
import { lazy, memo, Suspense, useCallback, useState } from 'react';

import s from './TrackItem.module.scss';

const LazyTrackTagsManager = lazy(() =>
  import('@shared/ui').then((module) => ({ default: module.TrackTagsManager }))
);

interface ITrackItemProps {
  track: ITrack;
  index: number;
  isFirst?: boolean;
}

const TrackItemComponent = ({ track, index, isFirst = false }: ITrackItemProps) => {
  const currentTrackId = useTrackStore((state) => state.currentTrack?.id);
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  const [showTagsManager, setShowTagsManager] = useState(false);

  const { imgRef, loaded: imageLoaded, shouldLoad, onLoad } = useOptimizedImage(track.imageUrl);

  const isCurrentTrack = currentTrackId === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isCurrentTrack) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    },
    [isCurrentTrack, isPlaying, track, setCurrentTrack, setIsPlaying]
  );

  const handleDoubleClick = useCallback(() => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  }, [isCurrentTrack, isPlaying, track, setCurrentTrack, setIsPlaying]);

  const handleSingleClick = useCallback(() => {
    if (isCurrentTrack) {
      setIsPlaying(true);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  }, [isCurrentTrack, track, setCurrentTrack, setIsPlaying]);

  const handleOpenTags = useCallback(() => setShowTagsManager(true), []);
  const handleCloseTags = useCallback(() => setShowTagsManager(false), []);

  const shouldAnimate = isFirst && index < 15;
  const motionProps = shouldAnimate
    ? {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2, delay: index * 0.02 },
      }
    : {};

  return (
    <>
      <motion.div
        className={`${s.trackItem} ${isCurrentTrack ? s.active : ''}`}
        {...motionProps}
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div className={s.info}>
          {track.imageUrl && (
            <div className={s.coverWrapper}>
              {!imageLoaded && <div className={s.coverPlaceholder} />}
              <img
                ref={imgRef}
                src={shouldLoad ? track.imageUrl : undefined}
                alt={track.name}
                className={s.cover}
                loading="lazy"
                decoding="async"
                onLoad={onLoad}
                style={{ opacity: imageLoaded ? 1 : 0 }}
                width={80}
                height={80}
              />
            </div>
          )}
          <button className={s.playBtn} onClick={handlePlay}>
            {isCurrentlyPlaying ? (
              <Equalizer className={s.equalizer} barClassName={s.equalizerBar} />
            ) : (
              <Icon component={PlayIcon} width={24} height={24} />
            )}
          </button>

          <div className={s.details}>
            <div className={s.title}>
              <div className={s.name}>{track.name}</div>
              <div className={s.artist}>{track.artist}</div>
            </div>
            <div className={s.titleline}>
              <span className={s.titlelineName}>{track.name}</span>
              <span className={s.titlelineSep}> — </span>
              <span className={s.titlelineArtist}>{track.artist}</span>
            </div>
            <div className={s.tags} onClick={(e) => e.stopPropagation()}>
              <TagsLine tags={track.customTags || []} onEdit={handleOpenTags} />
            </div>
          </div>
        </div>

        <div className={s.duration}>{formatDuration(track.duration)}</div>
      </motion.div>

      {showTagsManager && (
        <Suspense fallback={null}>
          <LazyTrackTagsManager track={track} onClose={handleCloseTags} />
        </Suspense>
      )}
    </>
  );
};

export const TrackItem = memo(TrackItemComponent, (prev, next) => {
  return (
    prev.track.id === next.track.id &&
    prev.index === next.index &&
    prev.isFirst === next.isFirst &&
    prev.track.customTags === next.track.customTags
  );
});
