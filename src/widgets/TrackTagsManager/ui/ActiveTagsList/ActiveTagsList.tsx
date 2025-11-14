import CloseIcon from '@shared/svg/X.svg?react';
import { Icon } from '@shared/ui';
import { memo } from 'react';

import s from './ActiveTagsList.module.scss';

interface IActiveTagsListProps {
  tags: string[];
  onRemoveTag: (tag: string) => void;
  emptyMessage: string;
}

export const ActiveTagsList = memo(({ tags, onRemoveTag, emptyMessage }: IActiveTagsListProps) => {
  if (tags.length === 0) {
    return <p className={s.empty}>{emptyMessage}</p>;
  }

  return (
    <div className={s.tags}>
      {tags.map((tag: string) => (
        <div key={tag} className={`${s.tag} ${s.tagActive}`}>
          <span>{tag}</span>
          <button onClick={() => onRemoveTag(tag)}>
            <Icon component={CloseIcon} width={16} height={16} />
          </button>
        </div>
      ))}
    </div>
  );
});

ActiveTagsList.displayName = 'ActiveTagsList';
