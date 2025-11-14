import VolumeHighIcon from '@shared/svg/VolumeHigh.svg?react';
import VolumeLowIcon from '@shared/svg/VolumeLow.svg?react';
import VolumeMuteIcon from '@shared/svg/VolumeMute.svg?react';
import { Icon, Slider } from '@shared/ui';
import { memo, useMemo } from 'react';

import s from './VolumeControl.module.scss';

interface IVolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  ariaLabel: string;
}

export const VolumeControl = memo(
  ({ volume, onVolumeChange, onToggleMute, ariaLabel }: IVolumeControlProps) => {
    const sliderStyle = useMemo(
      () => ({
        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume * 100}%, var(--color-border) ${volume * 100}%, var(--color-border) 100%)`,
      }),
      [volume]
    );

    return (
      <div className={s.volume}>
        <button className={s.controlBtn} onClick={onToggleMute}>
          {volume === 0 ? (
            <Icon component={VolumeMuteIcon} width={24} height={24} />
          ) : volume < 0.5 ? (
            <Icon component={VolumeLowIcon} width={24} height={24} />
          ) : (
            <Icon component={VolumeHighIcon} width={24} height={24} />
          )}
        </button>
        <div className={s.volumeSlider}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolumeChange}
            className={s.volumeInput}
            style={sliderStyle}
            ariaLabel={ariaLabel}
          />
        </div>
      </div>
    );
  }
);

VolumeControl.displayName = 'VolumeControl';
