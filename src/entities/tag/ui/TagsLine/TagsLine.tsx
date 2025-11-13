import React from 'react';

import s from './TagsLine.module.scss';
import { useI18n } from '../../lib';

interface TagsLineProps {
  tags: string[];
  onEdit?: () => void;
  maxWidth?: number | string;
}

export const TagsLine: React.FC<TagsLineProps> = ({ tags, onEdit, maxWidth }) => {
  const { t } = useI18n();

  return (
    <div className={s.tagsLine} style={maxWidth ? { maxWidth } : undefined}>
      <div className={`${s.scroll} ${tags.length <= 3 ? s.scrollCompact : ''}`}>
        {tags.map((tag) => (
          <span key={tag} className={s.tag}>
            {tag}
          </span>
        ))}
      </div>
      <button type="button" className={s.edit} title={t('buttons.editTags')} onClick={onEdit}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
