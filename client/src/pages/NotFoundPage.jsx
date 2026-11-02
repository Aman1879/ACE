import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <span className="text-8xl sm:text-9xl font-black text-gray-200">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center font-extrabold text-2xl shadow-orange">
            A
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B] mb-2">Page Not Found</h1>
      <p className="text-sm text-[#6B7280] max-w-sm mb-8">
        The academic record or page you requested does not exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/" className="btn-secondary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link to="/dashboard" className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

