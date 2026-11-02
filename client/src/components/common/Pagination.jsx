import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-[#EAEAEA] pt-4 mt-6">
      <p className="text-xs font-medium text-[#6B7280]">
        Page <span className="font-bold text-[#1B1B1B]">{page}</span> of{' '}
        <span className="font-bold text-[#1B1B1B]">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-xl border border-[#EAEAEA] bg-white text-[#6B7280] hover:text-[#1B1B1B] hover:border-[#FF6B00] disabled:opacity-40 disabled:hover:border-[#EAEAEA] disabled:hover:text-[#6B7280] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-xl border border-[#EAEAEA] bg-white text-[#6B7280] hover:text-[#1B1B1B] hover:border-[#FF6B00] disabled:opacity-40 disabled:hover:border-[#EAEAEA] disabled:hover:text-[#6B7280] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

