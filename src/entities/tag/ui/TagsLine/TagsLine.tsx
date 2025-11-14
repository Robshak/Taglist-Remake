import TagIcon from '@shared/svg/Tag.svg?react';
import { Icon } from '@shared/ui';
import React from 'react';

import s from './TagsLine.module.scss';
import { useI18n } from '../../lib';

interface ITagsLineProps {
  tags: string[];
  onEdit?: () => void;
  maxWidth?: number | string;
}

const TagsLineComponent: React.FC<ITagsLineProps> = ({ tags, onEdit, maxWidth }) => {
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
        <Icon component={TagIcon} width={14} height={14} />
      </button>
    </div>
  );
};

export const TagsLine = React.memo(TagsLineComponent);
