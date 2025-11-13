import React from 'react';

interface TagPillProps {
  text: string;
  variant?: 'default' | 'active' | 'empty';
  className?: string;
  onClick?: () => void;
}

export const TagPill: React.FC<TagPillProps> = ({ text, className, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      {text}
    </span>
  );
};
