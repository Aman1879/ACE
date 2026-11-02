import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  color = '',
  bg = '',
  className = '',
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-[#FFF1E6] text-[#FF6B00]',
    success: 'bg-[#F3FBF3] text-[#57C76F]',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const styleClass = color && bg ? `${bg} ${color}` : variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${styleClass} ${className}`}
    >
      {children}
    </span>
  );
}

