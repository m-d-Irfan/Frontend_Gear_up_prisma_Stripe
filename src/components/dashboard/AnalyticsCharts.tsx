'use client';

import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Package } from 'lucide-react';

interface AnalyticsChartsProps {
  totalRevenue?: number;
  totalOrders?: number;
  totalGear?: number;
  totalUsers?: number;
}

export default function AnalyticsCharts({
  totalRevenue = 4850,
  totalOrders = 34,
  totalGear = 18,
  totalUsers = 42,
}: AnalyticsChartsProps) {
  // Monthly Revenue Trend Sample Data
  const monthlyData = [
    { month: 'Jan', revenue: 650, orders: 8 },
    { month: 'Feb', revenue: 920, orders: 12 },
    { month: 'Mar', revenue: 1100, orders: 15 },
    { month: 'Apr', revenue: 850, orders: 11 },
    { month: 'May', revenue: 1450, orders: 19 },
    { month: 'Jun', revenue: 1880, orders: 24 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dynamic Bar Chart: Monthly Revenue Trend */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Platform Revenue Trend ($)</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Monthly earnings overview</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            +24.5% Growth
          </span>
        </div>

        {/* SVG / HTML Bar Visualizer */}
        <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
          {monthlyData.map((item, idx) => {
            const heightPercent = (item.revenue / maxRevenue) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-end h-32">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-slate-900 dark:bg-emerald-600 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-all rounded-t-lg relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                      ${item.revenue}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category & Status Metric Distribution Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Rental Order Breakdown</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Order statuses distribution</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Confirmed & Picked Up</span>
              <span className="text-emerald-600 dark:text-emerald-400">68%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[68%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Pending Approval</span>
              <span className="text-amber-600 dark:text-amber-400">22%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[22%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Returned / Completed</span>
              <span className="text-indigo-600 dark:text-indigo-400">10%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[10%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
