import LoopIcon from '@shared/svg/Loop.svg?react';
import NextIcon from '@shared/svg/Next.svg?react';
import PauseIcon from '@shared/svg/Pause.svg?react';
import PlayIcon from '@shared/svg/Play.svg?react';
import PrevIcon from '@shared/svg/Prev.svg?react';
import TagIcon from '@shared/svg/Tag.svg?react';
import { Icon } from '@shared/ui';
import { memo } from 'react';

import s from './ControlButtons.module.scss';

interface IControlButtonsProps {
  isPlaying: boolean;
  isLooping: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleLoop: () => void;
  onEditTags?: () => void;
  translations: {
    editTags: string;
    tags: string;
    previous: string;
    pausePlay: string;
    next: string;
    loopOn: string;
    loopOff: string;
  };
}

export const ControlButtons = memo(
  ({
    isPlaying,
    isLooping,
    onTogglePlay,
    onPrev,
    onNext,
    onToggleLoop,
    onEditTags,
    translations,
  }: IControlButtonsProps) => {
    return (
      <div className={s.buttons}>
        {onEditTags && (
          <button
            className={s.btn}
            onClick={onEditTags}
            aria-label={translations.editTags}
            title={translations.tags}
          >
            <Icon component={TagIcon} width={20} height={20} />
          </button>
        )}
        <button className={s.btn} onClick={onPrev} aria-label={translations.previous}>
          <Icon component={PrevIcon} width={28} height={28} />
        </button>
        <button
          className={`${s.btn} ${s.play}`}
          onClick={onTogglePlay}
          aria-label={translations.pausePlay}
        >
          {isPlaying ? (
            <Icon component={PauseIcon} width={32} height={32} />
          ) : (
            <Icon component={PlayIcon} width={32} height={32} />
          )}
        </button>
        <button className={s.btn} onClick={onNext} aria-label={translations.next}>
          <Icon component={NextIcon} width={28} height={28} />
        </button>
        <button
          className={`${s.btn} ${isLooping ? s.btnActive : ''}`}
          onClick={onToggleLoop}
          aria-label={isLooping ? translations.loopOn : translations.loopOff}
          title={isLooping ? translations.loopOn : translations.loopOff}
        >
          <Icon component={LoopIcon} width={20} height={20} />
        </button>
      </div>
    );
  }
);

ControlButtons.displayName = 'ControlButtons';
