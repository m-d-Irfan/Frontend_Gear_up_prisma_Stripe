import React from 'react';

export function GearCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse flex flex-col h-full border border-slate-800">
      <div className="w-full h-48 bg-slate-800/60" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-slate-800/80 rounded w-1/3" />
          <div className="h-6 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800/60 rounded w-1/2" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <div className="h-6 bg-slate-800 rounded w-20" />
          <div className="h-9 bg-slate-800 rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
}

export function GearGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <GearCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse border-b border-slate-800/60">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <div className="h-4 bg-slate-800/80 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 glass-card">
      <table className="w-full text-left">
        <thead className="bg-slate-900/60 border-b border-slate-800">
          <tr>
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} className="px-6 py-3">
                <div className="h-4 bg-slate-800 rounded w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => (
            <TableRowSkeleton key={idx} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
