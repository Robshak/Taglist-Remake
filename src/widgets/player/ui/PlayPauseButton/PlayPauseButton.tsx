import PauseIcon from '@shared/svg/Pause.svg?react';
import PlayIcon from '@shared/svg/Play.svg?react';
import { Icon } from '@shared/ui/Icon/Icon.tsx';
import React from 'react';

interface IPlayPauseButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
  title?: string;
}

export const PlayPauseButton: React.FC<IPlayPauseButtonProps> = ({
  isPlaying,
  onToggle,
  className,
  title,
}) => {
  return (
    <button className={className} onClick={onToggle} title={title}>
      {isPlaying ? (
        <Icon component={PauseIcon} width={32} height={32} />
      ) : (
        <Icon component={PlayIcon} width={32} height={32} />
      )}
    </button>
  );
};
