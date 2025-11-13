import React from 'react';

interface SliderProps {
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

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  onCommit,
  step = 1,
  className,
  style,
  ariaLabel,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleMouseUp = () => {
    onCommit?.();
  };

  const handleTouchEnd = () => {
    onCommit?.();
  };

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
};
