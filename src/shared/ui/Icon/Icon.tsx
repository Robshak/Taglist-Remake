import React from 'react';

interface IconProps {
  component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  'aria-hidden'?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  component: Component,
  width = 24,
  height = 24,
  className,
  onClick,
  style,
  ...rest
}) => {
  return (
    <Component
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={style}
      {...rest}
    />
  );
};
