import React from 'react';
import { Loader2, Dumbbell } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-2xl gradient-btn flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 animate-pulse">
        <Dumbbell className="w-6 h-6" />
      </div>
      <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        <span>Loading GearUp Application...</span>
      </div>
    </div>
  );
}
