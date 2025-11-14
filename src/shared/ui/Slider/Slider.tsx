import React, { memo, useCallback } from 'react';

interface ISliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
  step?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export const Slider = memo<ISliderProps>(
  ({ min, max, value, onChange, onCommit, step = 1, className, style, ariaLabel }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value));
      },
      [onChange]
    );

    const handleMouseUp = useCallback(() => {
      onCommit?.();
    }, [onCommit]);

    const handleTouchEnd = useCallback(() => {
      onCommit?.();
    }, [onCommit]);

    return (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        className={className}
        style={style}
        aria-label={ariaLabel}
      />
    );
  }
);

Slider.displayName = 'Slider';
