import { TrackItem, useTrackStore } from '@entities/track';
import { useFilterStore, TagFilter } from '@features/filter';
import {
  filterTracksByTags,
  filterTracksByTagBlocks,
  useDebounce,
  useDevicePerformance,
  useReducedMotion,
} from '@shared/lib/helpers.ts';
import AlertCircleIcon from '@shared/svg/AlertCircle.svg?react';
import { Icon } from '@shared/ui';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useI18n } from '../lib';
import s from './TrackList.module.scss';

export const TrackList = () => {
  const { t } = useI18n();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const parentRef = useRef<HTMLDivElement>(null);

  const { overscan } = useDevicePerformance();
  const shouldReduceMotion = useReducedMotion();

  const tracks = useTrackStore(useShallow((state) => state.tracks));
  const allCustomTags = useTrackStore((state) => state.allCustomTags);
  const getAvailableTags = useTrackStore((state) => state.getAvailableTags);
  const selectedTags = useFilterStore(useShallow((state) => state.selectedTags));
  const tagBlocks = useFilterStore(useShallow((state) => state.tagBlocks));
  const tagOperation = useFilterStore((state) => state.tagOperation);

  const debouncedSelectedTags = useDebounce(selectedTags, 200);
  const debouncedTagBlocks = useDebounce(tagBlocks, 200);

  const filteredTracks = useMemo(() => {
    if (debouncedTagBlocks.length > 0) {
      return filterTracksByTagBlocks(tracks, debouncedTagBlocks);
    }
    return filterTracksByTags(tracks, debouncedSelectedTags, tagOperation);
  }, [tracks, debouncedTagBlocks, debouncedSelectedTags, tagOperation]);

  const availableTags = useMemo(() => getAvailableTags(), [getAvailableTags, allCustomTags]);

  useEffect(() => {
    if (parentRef.current) {
      let element = parentRef.current.parentElement;
      while (element) {
        const { overflow, overflowY } = window.getComputedStyle(element);
        if (
          overflow === 'auto' ||
          overflow === 'scroll' ||
          overflowY === 'auto' ||
          overflowY === 'scroll'
        ) {
          parentRef.current = element as HTMLDivElement;
          break;
        }
        element = element.parentElement;
      }
    }
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: filteredTracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    overscan,
  });

  useMemo(() => {
    if (isFirstRender && filteredTracks.length > 0) {
      setTimeout(() => setIsFirstRender(false), 1000);
    }
  }, [isFirstRender, filteredTracks.length]);

  return (
    <div className={s.trackList} ref={parentRef}>
      {availableTags.length > 0 && <TagFilter availableTags={availableTags} />}
      <div className={s.header}>
        <h2 className={s.title}>
          {tagBlocks.length > 0
            ? t('title.found', { count: filteredTracks.length })
            : selectedTags.length > 0
              ? t('title.found', { count: filteredTracks.length })
              : t('title.total', { count: tracks.length })}
        </h2>
      </div>
      {filteredTracks.length === 0 ? (
        <motion.div
          className={s.empty}
          {...(shouldReduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              })}
        >
          <Icon component={AlertCircleIcon} width={64} height={64} />
          <p>{tracks.length === 0 ? t('empty.noTracks') : t('empty.noResults')}</p>
        </motion.div>
      ) : (
        <div className={s.items}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const track = filteredTracks[virtualRow.index];
              return (
                <div
                  key={track.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <TrackItem
                    track={track}
                    index={virtualRow.index}
                    isFirst={isFirstRender && !shouldReduceMotion}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
