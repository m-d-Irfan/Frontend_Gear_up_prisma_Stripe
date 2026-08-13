import React from 'react';
import { Loader2, Dumbbell } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md animate-pulse">
        <Dumbbell className="w-6 h-6 text-emerald-400" />
      </div>
      <div className="flex items-center space-x-2 text-slate-500 text-sm font-semibold">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
        <span>Loading GrabGear Application...</span>
      </div>
    </div>
  );
}
