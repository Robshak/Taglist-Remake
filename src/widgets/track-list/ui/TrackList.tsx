import { TrackItem, useTrackStore } from '@entities/track';
import { useFilterStore, TagFilter } from '@features/filter';
import { filterTracksByTags, filterTracksByTagBlocks } from '@shared/lib/helpers.ts';
import { motion } from 'motion/react';

import { useI18n } from '../lib';
import s from './TrackList.module.scss';

export const TrackList = () => {
  const { t } = useI18n();
  const { tracks, getAvailableTags } = useTrackStore();
  const { selectedTags, tagBlocks, tagOperation } = useFilterStore();

  let filteredTracks = tracks;
  if (tagBlocks.length > 0) {
    filteredTracks = filterTracksByTagBlocks(tracks, tagBlocks);
  } else {
    filteredTracks = filterTracksByTags(tracks, selectedTags, tagOperation);
  }

  const availableTags = getAvailableTags();

  return (
    <div className={s.trackList}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 8v4M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p>{tracks.length === 0 ? t('empty.noTracks') : t('empty.noResults')}</p>
        </motion.div>
      ) : (
        <div className={s.items}>
          {filteredTracks.map((track, index) => (
            <TrackItem key={track.id} track={track} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
