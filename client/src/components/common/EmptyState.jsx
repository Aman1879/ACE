import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'Get started by creating your first record.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state bg-white rounded-2xl border border-dashed border-[#EAEAEA] p-8 my-4">
      <div className="w-14 h-14 rounded-2xl bg-[#FFF1E6] text-[#FF6B00] flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-[#1B1B1B] mb-1">{title}</h4>
      <p className="text-sm text-[#6B7280] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary !py-2.5 !px-5 !text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

