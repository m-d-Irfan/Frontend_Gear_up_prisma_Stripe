import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
        <Compass className="w-10 h-10 text-emerald-600 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          404 Page Not Found
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Out of <span className="text-emerald-700">Bounds</span>
        </h1>
        <p className="text-sm text-slate-500">
          The requested route or equipment page does not exist or was moved.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/gear"
          className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center space-x-2 shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Explore Equipment Catalog</span>
        </Link>
      </div>
    </div>
  );
}
