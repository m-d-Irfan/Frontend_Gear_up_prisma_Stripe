import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 space-y-6 ambient-bg">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          The outdoor gear listing or page you are searching for does not exist or has been moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          href="/gear"
          className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 border border-slate-700 transition-all shadow-xs flex items-center space-x-2"
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Browse Gear Catalog</span>
        </Link>
      </div>
    </div>
  );
}
