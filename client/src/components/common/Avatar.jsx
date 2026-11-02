import React from 'react';
import { getInitials } from '../../utils/formatters';

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
    '2xl': 'w-28 h-28 text-2xl font-extrabold',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${currentSize} rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${currentSize} rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FF8C1A] text-white flex items-center justify-center font-bold tracking-wider shadow-sm flex-shrink-0 border-2 border-white ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

