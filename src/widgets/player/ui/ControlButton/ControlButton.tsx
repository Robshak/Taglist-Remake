import React from 'react';

interface IControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ControlButton: React.FC<IControlButtonProps> = ({ className, children, ...rest }) => {
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
};
