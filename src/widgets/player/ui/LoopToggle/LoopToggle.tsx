import LoopIcon from '@shared/svg/Loop.svg?react';
import { Icon } from '@shared/ui/Icon/Icon.tsx';
import React from 'react';

interface ILoopToggleProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
  activeClassName?: string;
  title?: string;
}

export const LoopToggle: React.FC<ILoopToggleProps> = ({
  isActive,
  onToggle,
  className,
  activeClassName,
  title,
}) => {
  const classes = [className, isActive ? activeClassName : ''].filter(Boolean).join(' ');
  return (
    <button className={classes} onClick={onToggle} title={title}>
      <Icon component={LoopIcon} width={20} height={20} />
    </button>
  );
};
