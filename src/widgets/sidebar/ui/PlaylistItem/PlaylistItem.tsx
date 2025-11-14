import CloseIcon from '@shared/svg/X.svg?react';
import { Icon } from '@shared/ui/Icon';
import { TagPill } from '@shared/ui/TagPill';
import React from 'react';

import s from './PlaylistItem.module.scss';
import { useI18n } from '../../lib';

interface IFavoritePlaylist {
  id: string;
  name?: string;
  tags: string[];
  tagBlocks?: string[][];
}

interface IPlaylistItemProps {
  favorite: IFavoritePlaylist;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const PlaylistItem: React.FC<IPlaylistItemProps> = ({
  favorite,
  isActive,
  onSelect,
  onDelete,
}) => {
  const { t } = useI18n();

  return (
    <div
      className={`${s.item} ${isActive ? s.active : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className={`${s.itemContent} ${isActive ? s.active : ''}`}>
        <div className={s.itemName}>{favorite.name || t('untitled')}</div>
        <div className={s.itemTags}>
          {favorite.tagBlocks && favorite.tagBlocks.length > 0 ? (
            <div className={s.tagLogic}>
              {favorite.tagBlocks.map((block, idx) => (
                <React.Fragment key={idx}>
                  <div className={s.block}>
                    {block.map((tag) => (
                      <TagPill className={s.pill} key={tag} text={tag} />
                    ))}
                    {block.length === 0 && (
                      <TagPill
                        className={`${s.pill} ${s.pillEmpty}`}
                        text={t('empty.empty')}
                        variant="empty"
                      />
                    )}
                  </div>
                  {idx < (favorite.tagBlocks?.length ?? 0) - 1 && (
                    <span className={s.sep} aria-label="OR" title={t('union')}>
                      +
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : favorite.tags.length > 0 ? (
            <>
              {favorite.tags.slice(0, 3).map((t) => (
                <TagPill key={t} className={s.pill} text={t} />
              ))}
              {favorite.tags.length > 3 && (
                <span className={s.more}>+{favorite.tags.length - 3}</span>
              )}
            </>
          ) : (
            <span style={{ opacity: 0.5 }}>{t('noTags')}</span>
          )}
        </div>
      </div>
      <button
        className={s.itemDelete}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={t('buttons.delete')}
      >
        <Icon component={CloseIcon} width={16} height={16} />
      </button>
    </div>
  );
};
