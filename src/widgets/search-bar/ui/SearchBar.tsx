import { useHistoryStore } from '@entities/history';
import { usePlaylistStore } from '@entities/playlist';
import { useSearchStore } from '@entities/search';
import { trackApi, useTrackStore } from '@entities/track';
import SearchIcon from '@shared/svg/Search.svg?react';
import ZapIcon from '@shared/svg/Zap.svg?react';
import { Icon } from '@shared/ui';
import { motion } from 'motion/react';
import { useState } from 'react';

import { useI18n } from '../lib';
import s from './SearchBar.module.scss';

export const SearchBar = () => {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const { setTracks } = useTrackStore();
  const { addHistoryEntry } = useHistoryStore();
  const { searchQuery, setSearchQuery, clearSearch } = useSearchStore();
  const { setActivePlaylist } = usePlaylistStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const tracks = await trackApi.searchTracks(searchQuery);
      setTracks(tracks);
      setActivePlaylist(null);
      addHistoryEntry({ trackId: '', playedAt: Date.now(), position: 0 });
      clearSearch();
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPopular = async () => {
    setIsLoading(true);
    try {
      const tracks = await trackApi.getPopularTracks(30);
      setTracks(tracks);
      setActivePlaylist(null);
      clearSearch();
    } catch (error) {
      console.error('Error loading popular tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={s.searchBar}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <form onSubmit={handleSearch} className={s.form}>
        <div className={s.inputWrapper}>
          <Icon className={s.icon} component={SearchIcon} width={20} height={20} />
          <input
            type="text"
            className={s.input}
            placeholder={t('placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button type="submit" className={s.button} disabled={isLoading || !searchQuery}>
          {t('searchButton')}
        </button>
      </form>
      <button className={s.popular} onClick={handleLoadPopular} disabled={isLoading}>
        <Icon component={ZapIcon} width={20} height={20} />
        {t('popularButton')}
      </button>
    </motion.div>
  );
};
