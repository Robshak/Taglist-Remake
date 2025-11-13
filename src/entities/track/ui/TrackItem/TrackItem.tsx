import { usePlayerStore } from '@entities/player';
import { useTrackStore } from '@entities/track';
import { formatDuration } from '@shared/lib/helpers.ts';
import PlayIcon from '@shared/svg/Play.svg?react';
import type { ITrack } from '@shared/types';
import { Equalizer, Icon, TagsLine, TrackTagsManager } from '@shared/ui';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import s from './TrackItem.module.scss';

interface ITrackItemProps {
  track: ITrack;
  index: number;
}

export const TrackItem = ({ track, index }: ITrackItemProps) => {
  const { currentTrack, setCurrentTrack } = useTrackStore();
  const { isPlaying, setIsPlaying } = usePlayerStore();
  const [showTagsManager, setShowTagsManager] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  );
  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
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

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleDoubleClick = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleSingleClick = () => {
    if (isCurrentTrack) {
      setIsPlaying(true);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <motion.div
        className={`${s.trackItem} ${isCurrentTrack ? s.active : ''}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        onClick={isMobile ? handleSingleClick : undefined}
        onDoubleClick={handleDoubleClick}
      >
        <div className={s.info}>
          {track.imageUrl && <img src={track.imageUrl} alt={track.name} className={s.cover} />}
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
              <TagsLine tags={track.customTags || []} onEdit={() => setShowTagsManager(true)} />
            </div>
          </div>
        </div>

        <div className={s.duration}>{formatDuration(track.duration)}</div>
      </motion.div>

      {showTagsManager && (
        <TrackTagsManager track={track} onClose={() => setShowTagsManager(false)} />
      )}
    </>
  );
};
