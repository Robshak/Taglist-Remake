import PlusIcon from '@shared/svg/Plus.svg?react';
import { Icon } from '@shared/ui';
import { useEffect, useState } from 'react';

import { useI18n } from '../../lib';
import { useFilterStore } from '../../model';
import { TagBlock } from '../TagBlock';
import s from './TagBlocksBuilder.module.scss';

interface TagBlocksBuilderProps {
  availableTags: string[];
}

export const TagBlocksBuilder = ({ availableTags }: TagBlocksBuilderProps) => {
  const { t } = useI18n();
  const { tagBlocks, addTagBlock, addTagToBlock, removeTagFromBlock, deleteTagBlock } =
    useFilterStore();
  const [activeBlock, setActiveBlock] = useState<number | null>(null);

  useEffect(() => {
    if (tagBlocks.length === 0) {
      setActiveBlock(null);
    } else if (activeBlock !== null && !tagBlocks[activeBlock]) {
      setActiveBlock(null);
    }
  }, [tagBlocks, activeBlock]);

  const startNewBlock = () => {
    addTagBlock();
    const nextIndex = tagBlocks.length;
    setActiveBlock(nextIndex);
  };

  const handleTagClick = (tag: string) => {
    if (activeBlock === null || !tagBlocks[activeBlock]) {
      addTagBlock([tag]);
      const nextIndex = tagBlocks.length;
      setActiveBlock(nextIndex);
    } else {
      const block = tagBlocks[activeBlock] || [];
      if (block.includes(tag)) {
        removeTagFromBlock(activeBlock, tag);
      } else {
        addTagToBlock(activeBlock, tag);
      }
    }
  };

  return (
    <div className={s.tagBlocks}>
      <div className={s['constructor']}>
        {tagBlocks.map((block, i) => (
          <TagBlock
            key={i}
            tags={block}
            isActive={activeBlock === i}
            onToggle={() => setActiveBlock(activeBlock === i ? null : i)}
            onDelete={() => {
              deleteTagBlock(i);
              if (activeBlock === i) setActiveBlock(null);
            }}
          />
        ))}
        <button
          className={`${s.add} ${activeBlock === null ? s.ready : ''}`}
          onClick={startNewBlock}
          title={t('buttons.newBlock')}
        >
          <Icon component={PlusIcon} width={18} height={18} />
        </button>
      </div>
      <div className={s.tags}>
        {availableTags.map((tag) => (
          <button
            key={tag}
            className={`${s.tag} ${activeBlock !== null && tagBlocks[activeBlock]?.includes(tag) ? s.inBlock : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className={s.hint}>
        <p>{t('hint')}</p>
      </div>
    </div>
  );
};
