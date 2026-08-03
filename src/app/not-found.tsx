import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-2xl">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
          404 Page Not Found
        </span>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Out of <span className="gradient-text">Bounds</span>
        </h1>
        <p className="text-sm text-slate-400">
          The requested route or equipment page does not exist or was moved.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/gear"
          className="px-6 py-3 rounded-xl text-xs font-semibold text-white gradient-btn flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Equipment Catalog</span>
        </Link>
      </div>
    </div>
  );
}
