import { Slider } from '@shared/ui';
import { memo, useMemo } from 'react';

import s from './ProgressBar.module.scss';

interface IProgressBarProps {
  currentTime: number;
  duration: number;
  progress: number;
  onSeek: (time: number) => void;
  onSeekCommit: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  ariaLabel: string;
}

export const ProgressBar = memo(
  ({
    currentTime,
    duration,
    progress,
    onSeek,
    onSeekCommit,
    onProgressClick,
    ariaLabel,
  }: IProgressBarProps) => {
    const sliderStyle = useMemo(
      () => ({
        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${progress}%, var(--color-border) ${progress}%, var(--color-border) 100%)`,
      }),
      [progress]
    );

    return (
      <div className={s.progressContainer}>
        <div className={s.time}>
          {Math.floor(currentTime / 60)}:{`${Math.floor(currentTime % 60)}`.padStart(2, '0')}
        </div>
        <div className={s.progressWrapper} onClick={onProgressClick}>
          <Slider
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            onCommit={onSeekCommit}
            className={s.progress}
            style={sliderStyle}
            ariaLabel={ariaLabel}
          />
        </div>
        <div className={s.time}>
          {Math.floor(duration / 60)}:{`${Math.floor(duration % 60)}`.padStart(2, '0')}
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
