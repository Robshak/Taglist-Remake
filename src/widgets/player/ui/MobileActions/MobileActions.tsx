import TagIcon from '@shared/svg/Tag.svg?react';
import { Icon } from '@shared/ui';
import { memo } from 'react';

import { PlayPauseButton } from '../PlayPauseButton';
import s from './MobileActions.module.scss';

interface IMobileActionsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onEditTags: () => void;
  translations: {
    play: string;
    pause: string;
    editTags: string;
  };
}

export const MobileActions = memo(
  ({ isPlaying, onTogglePlay, onEditTags, translations }: IMobileActionsProps) => {
    return (
      <div className={s.actions}>
        <button className={s.controlBtn} onClick={onEditTags} title={translations.editTags}>
          <Icon component={TagIcon} width={20} height={20} />
        </button>
        <PlayPauseButton
          className={`${s.controlBtn} ${s.playBtn}`}
          isPlaying={isPlaying}
          onToggle={onTogglePlay}
          title={isPlaying ? translations.pause : translations.play}
        />
      </div>
    );
  }
);

MobileActions.displayName = 'MobileActions';
