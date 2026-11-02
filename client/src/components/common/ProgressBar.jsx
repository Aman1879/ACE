import React from 'react';

export default function ProgressBar({
  progress = 0,
  label,
  valueText,
  color = 'bg-[#57C76F]',
  height = 'h-2.5',
  className = '',
}) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {(label || valueText) && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          {label && <span className="text-[#1B1B1B]">{label}</span>}
          {valueText && <span className="text-[#6B7280]">{valueText}</span>}
        </div>
      )}
      <div className={`w-full bg-[#EAEAEA] rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

