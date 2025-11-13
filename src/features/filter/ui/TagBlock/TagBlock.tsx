import CloseIcon from '@shared/svg/X.svg?react';
import { Icon, TagPill } from '@shared/ui';
import { motion } from 'motion/react';
import React from 'react';

import s from './TagBlock.module.scss';
import { useI18n } from '../../lib';

interface TagBlockProps {
  tags: string[];
  isActive: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const TagBlock: React.FC<TagBlockProps> = ({ tags, isActive, onToggle, onDelete }) => {
  const { t } = useI18n();

  return (
    <motion.div className={`${s.block} ${isActive ? s.active : ''}`} onClick={onToggle} layout>
      <div className={s.blockTags}>
        {tags.map((tag) => (
          <TagPill key={tag} text={tag} className={s.pill} />
        ))}
        {tags.length === 0 && <span className={s.placeholder}>{t('empty')}</span>}
      </div>
      <button
        className={s.delete}
        title={t('buttons.delete')}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Icon component={CloseIcon} width={14} height={14} />
      </button>
    </motion.div>
  );
};
