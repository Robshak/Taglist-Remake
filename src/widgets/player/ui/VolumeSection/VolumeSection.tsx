import VolumeHighIcon from '@shared/svg/VolumeHigh.svg?react';
import VolumeLowIcon from '@shared/svg/VolumeLow.svg?react';
import VolumeMuteIcon from '@shared/svg/VolumeMute.svg?react';
import { Icon, Slider } from '@shared/ui';
import { memo, useMemo } from 'react';

import s from './VolumeSection.module.scss';

interface IVolumeSectionProps {
  volume: number;
  onSetVolume: (v: number) => void;
  onToggleMute: () => void;
  ariaLabel: string;
}

export const VolumeSection = memo(
  ({ volume, onSetVolume, onToggleMute, ariaLabel }: IVolumeSectionProps) => {
    const volPct = Math.max(0, Math.min(100, (volume || 0) * 100));

    const volumeSliderStyle = useMemo(
      () => ({
        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volPct}%, var(--color-border) ${volPct}%, var(--color-border) 100%)`,
      }),
      [volPct]
    );

    return (
      <div className={s.volumeTop}>
        <button className={s.volumeBtn} onClick={onToggleMute} aria-label={ariaLabel}>
          {volume === 0 ? (
            <Icon component={VolumeMuteIcon} width={22} height={22} />
          ) : volume < 0.5 ? (
            <Icon component={VolumeLowIcon} width={22} height={22} />
          ) : (
            <Icon component={VolumeHighIcon} width={22} height={22} />
          )}
        </button>
        <div className={s.volumeSlider}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onSetVolume}
            className={s.volumeInput}
            style={volumeSliderStyle}
            ariaLabel={ariaLabel}
          />
        </div>
      </div>
    );
  }
);

VolumeSection.displayName = 'VolumeSection';
