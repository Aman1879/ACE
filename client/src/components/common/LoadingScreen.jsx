import React from 'react';

export default function LoadingScreen({ message = 'Loading ACE...' }) {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#57C76F] animate-spin opacity-80" />
        <div className="absolute w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
          <span className="font-extrabold text-xl text-[#FF6B00]">A</span>
        </div>
      </div>
      <h2 className="text-xl font-bold text-[#1B1B1B] tracking-tight mb-1">ACE</h2>
      <p className="text-sm font-medium text-[#6B7280]">{message}</p>
    </div>
  );
}

