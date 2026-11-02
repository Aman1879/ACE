import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-[#FFF1E6]',
  iconColor = 'text-[#FF6B00]',
  trend,
  className = '',
}) {
  return (
    <div className={`card hover:shadow-card-hover transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#6B7280]">{title}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-[#1B1B1B]">{value}</h4>
        {trend && (
          <span className="text-xs font-semibold text-[#57C76F] bg-[#F3FBF3] px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-[#6B7280] mt-1">{subtitle}</p>}
    </div>
  );
}

