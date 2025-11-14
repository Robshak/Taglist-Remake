import React from 'react';

interface IEqualizerProps {
  className?: string;
  barClassName?: string;
}

export const Equalizer: React.FC<IEqualizerProps> = React.memo(({ className, barClassName }) => {
  return (
    <div className={className}>
      <span className={barClassName}></span>
      <span className={barClassName}></span>
      <span className={barClassName}></span>
    </div>
  );
});
