import React from 'react';

interface EqualizerProps {
  className?: string;
  barClassName?: string;
}

export const Equalizer: React.FC<EqualizerProps> = ({ className, barClassName }) => {
  return (
    <div className={className}>
      <span className={barClassName}></span>
      <span className={barClassName}></span>
      <span className={barClassName}></span>
    </div>
  );
};
