import NextIcon from '@shared/svg/Next.svg?react';
import PrevIcon from '@shared/svg/Prev.svg?react';
import { Icon } from '@shared/ui';
import { memo } from 'react';

import { ControlButton } from '../ControlButton';
import { LoopToggle } from '../LoopToggle';
import { PlayPauseButton } from '../PlayPauseButton';
import { ProgressBar } from '../ProgressBar';
import s from './DesktopControls.module.scss';

interface IPlaybackState {
  isPlaying: boolean;
  isLooping: boolean;
}

interface IProgressState {
  currentTime: number;
  duration: number;
  progress: number;
}

interface IPlaybackHandlers {
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleLoop: () => void;
}

interface IProgressHandlers {
  onSeek: (time: number) => void;
  onSeekCommit: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface IDesktopControlsProps {
  playbackState: IPlaybackState;
  progressState: IProgressState;
  playbackHandlers: IPlaybackHandlers;
  progressHandlers: IProgressHandlers;
  translations: {
    play: string;
    pause: string;
    previous: string;
    next: string;
    loopOn: string;
    loopOff: string;
    playbackPosition: string;
  };
}

export const DesktopControls = memo(
  ({
    playbackState,
    progressState,
    playbackHandlers,
    progressHandlers,
    translations,
  }: IDesktopControlsProps) => {
    const { isPlaying, isLooping } = playbackState;
    const { currentTime, duration, progress } = progressState;
    const { onTogglePlay, onPrev, onNext, onToggleLoop } = playbackHandlers;
    const { onSeek, onSeekCommit, onProgressClick } = progressHandlers;
    return (
      <div className={s.controls}>
        <div className={s.buttons}>
          <ControlButton
            className={`${s.controlBtn} ${s.controlBtnSmall}`}
            onClick={onPrev}
            title={translations.previous}
          >
            <Icon component={PrevIcon} width={24} height={24} />
          </ControlButton>
          <PlayPauseButton
            className={`${s.controlBtn} ${s.playBtn}`}
            isPlaying={isPlaying}
            onToggle={onTogglePlay}
            title={isPlaying ? translations.pause : translations.play}
          />
          <ControlButton
            className={`${s.controlBtn} ${s.controlBtnSmall}`}
            onClick={onNext}
            title={translations.next}
          >
            <Icon component={NextIcon} width={24} height={24} />
          </ControlButton>
          <LoopToggle
            className={`${s.controlBtn} ${s.controlBtnSmall}`}
            activeClassName={s.active}
            isActive={isLooping}
            onToggle={onToggleLoop}
            title={isLooping ? translations.loopOn : translations.loopOff}
          />
        </div>
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          progress={progress}
          onSeek={onSeek}
          onSeekCommit={onSeekCommit}
          onProgressClick={onProgressClick}
          ariaLabel={translations.playbackPosition}
        />
      </div>
    );
  }
);

DesktopControls.displayName = 'DesktopControls';
