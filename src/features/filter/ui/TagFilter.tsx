import { usePlaylistStore } from '@entities/playlist';
import { useReducedMotion } from '@shared/lib/helpers.ts';
import ChevronDownIcon from '@shared/svg/ChevronDown.svg?react';
import SaveIcon from '@shared/svg/Save.svg?react';
import TagIcon from '@shared/svg/Tag.svg?react';
import TrashIcon from '@shared/svg/Trash.svg?react';
import { Icon } from '@shared/ui';
import { TrackTagsManager } from '@widgets/TrackTagsManager';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { useFilterStore } from '../model';
import { SaveFilterDialog } from './SaveFilterDialog';
import { TagBlocksBuilder } from './TagBlocksBuilder';
import s from './TagFilter.module.scss';
import { useI18n } from '../lib';

interface ITagFilterProps {
  availableTags: string[];
}

export const TagFilter = ({ availableTags }: ITagFilterProps) => {
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();

  const tagBlocks = useFilterStore((state) => state.tagBlocks);
  const resetFilter = useFilterStore((state) => state.resetFilter);
  const playlists = usePlaylistStore((state) => state.playlists);
  const createFavoriteFromFilter = usePlaylistStore((state) => state.createFavoriteFromFilter);
  const [favoriteName, setFavoriteName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showTagsManager, setShowTagsManager] = useState(false);

  const handleSaveToFavorites = () => {
    const hasAny = tagBlocks.some((b) => b.length > 0);
    if (favoriteName.trim() && hasAny) {
      const name = favoriteName.trim();
      const exists = Object.values(playlists).some(
        (f) => f.name?.trim().toLowerCase() === name.toLowerCase()
      );
      if (exists) {
        const proceed = confirm(t('confirmDuplicate'));
        if (!proceed) return;
      }
      createFavoriteFromFilter(name, tagBlocks);
      setFavoriteName('');
      setShowSaveDialog(false);
      resetFilter();
    }
  };

  return (
    <div className={s.tagFilter}>
      <div className={s.header}>
        <div className={s.titleRow}>
          <h3 className={s.title}>{t('title')}</h3>
          <button
            className={`${s.toggle} ${isOpen ? s.open : ''}`}
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="tag-filter-content"
          >
            <span>{isOpen ? t('collapse') : t('expand')}</span>
            <Icon component={ChevronDownIcon} width={16} height={16} aria-hidden />
          </button>
        </div>
        {isOpen && (
          <div className={s.actions}>
            {tagBlocks.some((b) => b.length > 0) && (
              <button className={s.saveBtn} onClick={() => setShowSaveDialog(true)}>
                <Icon component={SaveIcon} width={20} height={20} />
                {t('buttons.save')}
              </button>
            )}
            {tagBlocks.length > 0 && (
              <button className={s.clearBtn} onClick={resetFilter} title={t('buttons.clear')}>
                <Icon component={TrashIcon} width={18} height={18} aria-hidden />
                {t('buttons.clear')}
              </button>
            )}
            <button
              className={s.manageTags}
              onClick={() => setShowTagsManager(true)}
              title={t('buttons.tags')}
            >
              <Icon component={TagIcon} width={18} height={18} />
              {t('buttons.tags')}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="tag-filter-content"
            {...(shouldReduceMotion
              ? {}
              : {
                  initial: { height: 0, opacity: 0 },
                  animate: { height: 'auto', opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                  transition: { duration: 0.2 },
                })}
          >
            <TagBlocksBuilder availableTags={availableTags} />
          </motion.div>
        )}
      </AnimatePresence>

      <SaveFilterDialog
        isOpen={showSaveDialog}
        value={favoriteName}
        onChange={setFavoriteName}
        onCancel={() => setShowSaveDialog(false)}
        onSubmit={handleSaveToFavorites}
      />

      {showTagsManager && <TrackTagsManager onClose={() => setShowTagsManager(false)} />}
    </div>
  );
};
