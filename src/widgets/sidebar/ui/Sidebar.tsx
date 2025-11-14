import { usePlaylistStore } from '@entities/playlist';
import { useSearchStore } from '@entities/search';
import { useTrackStore } from '@entities/track';
import { useFilterStore } from '@features/filter';
import { motion } from 'motion/react';
import { useMemo } from 'react';

import s from './Sidebar.module.scss';
import { useI18n } from '../lib';
import { PlaylistItem } from './PlaylistItem';

interface ISidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: ISidebarProps) => {
  const { t } = useI18n();

  const playlists = usePlaylistStore((state) => state.playlists);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const setActivePlaylist = usePlaylistStore((state) => state.setActivePlaylist);
  const getTracksForPlaylist = usePlaylistStore((state) => state.getTracksForPlaylist);
  const activePlaylistId = usePlaylistStore((state) => state.activePlaylistId);

  const setTracks = useTrackStore((state) => state.setTracks);
  const resetFilter = useFilterStore((state) => state.resetFilter);
  const clearSearch = useSearchStore((state) => state.clearSearch);

  const favoritesArray = useMemo(
    () => Object.values(playlists).filter((p) => p.isFavorite),
    [playlists]
  );

  const handleLoadFavorite = (id: string) => {
    const playlist = playlists[id];
    if (!playlist) return;
    const tracks = getTracksForPlaylist(id);
    setTracks(tracks);
    setActivePlaylist(id);
    resetFilter();
    clearSearch();
    onClose?.();
  };

  return (
    <motion.aside
      className={s.sidebar}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className={s.content}>
        <h4 className={s.heading}>{t('heading')}</h4>
        {favoritesArray.length === 0 ? (
          <div className={s.empty}>
            <p className={s.emptyTitle}>{t('empty.title')}</p>
            <p className={s.emptyHint}>{t('empty.hint')}</p>
          </div>
        ) : (
          <div className={s.items}>
            {favoritesArray.map((favorite) => (
              <PlaylistItem
                key={favorite.id}
                favorite={favorite}
                isActive={activePlaylistId === favorite.id}
                onSelect={() => handleLoadFavorite(favorite.id)}
                onDelete={() => deletePlaylist(favorite.id)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
};
