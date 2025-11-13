import React from 'react';

interface ControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ControlButton: React.FC<ControlButtonProps> = ({ className, children, ...rest }) => {
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
};
