import { formatDuration } from '@shared/lib/helpers';
import { Slider } from '@shared/ui';
import { memo, useMemo } from 'react';

import s from './ProgressSection.module.scss';

interface IProgressSectionProps {
  currentTime: number;
  duration: number;
  onSeek: (v: number) => void;
  onSeekCommit: () => void;
}

export const ProgressSection = memo(
  ({ currentTime, duration, onSeek, onSeekCommit }: IProgressSectionProps) => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const progressSliderStyle = useMemo(
      () => ({
        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${progress}%, var(--color-border) ${progress}%, var(--color-border) 100%)`,
      }),
      [progress]
    );

    return (
      <>
        <div className={s.progress}>
          <Slider
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            onCommit={onSeekCommit}
            className={s.slider}
            style={progressSliderStyle}
          />
        </div>
        <div className={s.progressTimes}>
          <div className={s.time}>{formatDuration(currentTime)}</div>
          <div className={s.time}>{formatDuration(duration)}</div>
        </div>
      </>
    );
  }
);

ProgressSection.displayName = 'ProgressSection';
