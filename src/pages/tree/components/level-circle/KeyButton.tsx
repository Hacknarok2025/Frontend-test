// KeyButton.tsx
import React from 'react';

interface KeyButtonProps {
  label: string;
  isSpace?: boolean;
  className?: string;
}

const KeyButton: React.FC<KeyButtonProps> = ({
  label,
  isSpace = false,
  className = '',
}) => {
  const baseStyles =
    'flex items-center justify-center border rounded-md shadow-sm text-sm font-mono text-neutral-800 border-neutral-300 hover:bg-neutral-200 transition-colors';

  const getDisplayText = (label: string): string => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel === 'space') return '';
    if (lowerLabel === 'arrowleft') return '←';
    if (lowerLabel === 'arrowright') return '→';
    if (lowerLabel === 'arrowup') return '↑';
    if (lowerLabel === 'arrowdown') return '↓';
    if (lowerLabel === 'mouseclick') return '🖱️';
    if (lowerLabel === 'mousedrag') return '🖱️↔️';
    return label;
  };

  const isArrow = label.toLowerCase().startsWith('arrow');
  const isMouse = label.toLowerCase().startsWith('mouse');
  const sizeStyles = isSpace
    ? 'w-24 h-8'
    : isArrow || isMouse
    ? 'w-10 h-8'
    : 'w-8 h-8';

  const bgStyles = ['🖱️', '🖱️↔️'].includes(getDisplayText(label))
    ? ''
    : 'bg-neutral-100';

  return (
    <div
      className={`${bgStyles} ${baseStyles} ${sizeStyles} ${className} ${
        isSpace ? 'bg-neutral-200' : ''
      }`}
    >
      {getDisplayText(label)}
    </div>
  );
};

export default KeyButton;
