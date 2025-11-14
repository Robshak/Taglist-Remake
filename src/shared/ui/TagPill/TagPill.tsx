import React from 'react';

interface ITagPillProps {
  text: string;
  variant?: 'default' | 'active' | 'empty';
  className?: string;
  onClick?: () => void;
}

export const TagPill: React.FC<ITagPillProps> = React.memo(({ text, className, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      {text}
    </span>
  );
});
