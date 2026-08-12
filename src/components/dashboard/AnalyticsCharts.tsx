'use client';

import React from 'react';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { RentalOrder } from '@/types';

interface AnalyticsChartsProps {
  orders?: RentalOrder[];
  totalRevenue?: number;
  totalOrders?: number;
  totalGear?: number;
  totalUsers?: number;
  title?: string;
  subtitle?: string;
  role?: 'ADMIN' | 'PROVIDER' | 'CUSTOMER';
}

export default function AnalyticsCharts({
  orders = [],
  title,
  subtitle,
  role = 'ADMIN',
}: AnalyticsChartsProps) {
  const chartTitle =
    title ||
    (role === 'PROVIDER'
      ? 'Provider Revenue Trend ($)'
      : role === 'CUSTOMER'
      ? 'Rental Spending Trend ($)'
      : 'Platform Revenue Trend ($)');

  const chartSubtitle =
    subtitle ||
    (role === 'PROVIDER'
      ? 'Monthly earnings overview'
      : role === 'CUSTOMER'
      ? 'Monthly rental spending overview'
      : 'Monthly platform earnings overview');

  // Compute monthly data from real orders
  const getMonthlyData = (ordersList: RentalOrder[]) => {
    const now = new Date();

    const dates = ordersList
      .map((o) => {
        const s = o.createdAt || o.startDate;
        return s ? new Date(s) : null;
      })
      .filter((d): d is Date => d !== null && !isNaN(d.getTime()));

    let latestDate = new Date();
    if (dates.length > 0) {
      const maxOrderTime = Math.max(...dates.map((d) => d.getTime()));
      if (maxOrderTime > latestDate.getTime()) {
        latestDate = new Date(maxOrderTime);
      }
    }

    const buckets: { month: string; year: number; monthIdx: number; revenue: number; ordersCount: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(latestDate.getFullYear(), latestDate.getMonth() - i, 1);
      buckets.push({
        month: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        monthIdx: d.getMonth(),
        revenue: 0,
        ordersCount: 0,
      });
    }

    if (ordersList.length > 0) {
      ordersList.forEach((order) => {
        const dateStr = order.createdAt || order.startDate;
        if (!dateStr) return;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return;

        const orderYear = d.getFullYear();
        const orderMonth = d.getMonth();

        const bucket = buckets.find((b) => b.year === orderYear && b.monthIdx === orderMonth);
        if (bucket) {
          if (order.orderStatus !== 'CANCELLED') {
            bucket.revenue += Number(order.totalPrice) || 0;
          }
          bucket.ordersCount += 1;
        }
      });
    }

    return buckets;
  };

  const monthlyData = getMonthlyData(orders);
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 0);

  // Compute real month-over-month growth
  const latestMonthRev = monthlyData[monthlyData.length - 1]?.revenue || 0;
  const prevMonthRev = monthlyData[monthlyData.length - 2]?.revenue || 0;

  let growthText = '0.0% Growth';
  if (prevMonthRev > 0) {
    const growthPercent = ((latestMonthRev - prevMonthRev) / prevMonthRev) * 100;
    growthText = `${growthPercent >= 0 ? '+' : ''}${growthPercent.toFixed(1)}% Growth`;
  } else if (latestMonthRev > 0) {
    growthText = '+100% Growth';
  }

  // Compute real order breakdown
  const orderCount = orders.length;

  const confirmedCount = orders.filter(
    (o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PICKED_UP'
  ).length;

  const pendingCount = orders.filter((o) => o.orderStatus === 'PENDING').length;

  const returnedCount = orders.filter((o) => o.orderStatus === 'RETURNED').length;

  const cancelledCount = orders.filter((o) => o.orderStatus === 'CANCELLED').length;

  const confirmedPct = orderCount > 0 ? Math.round((confirmedCount / orderCount) * 100) : 0;
  const pendingPct = orderCount > 0 ? Math.round((pendingCount / orderCount) * 100) : 0;
  const returnedPct = orderCount > 0 ? Math.round((returnedCount / orderCount) * 100) : 0;
  const cancelledPct = orderCount > 0 ? Math.round((cancelledCount / orderCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dynamic Bar Chart: Monthly Revenue Trend */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{chartTitle}</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{chartSubtitle}</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {growthText}
          </span>
        </div>

        {/* SVG / HTML Bar Visualizer */}
        <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
          {monthlyData.map((item, idx) => {
            const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-end h-32">
                  <div
                    style={{ height: `${item.revenue > 0 ? Math.max(heightPercent, 8) : 4}%` }}
                    className={`w-full ${
                      item.revenue > 0
                        ? 'bg-slate-900 dark:bg-emerald-600 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                    } transition-all rounded-t-lg relative`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10">
                      ${item.revenue.toFixed(0)} ({item.ordersCount} order{item.ordersCount === 1 ? '' : 's'})
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
              <span className="text-emerald-600 dark:text-emerald-400">
                {confirmedPct}% <span className="text-[10px] font-normal text-slate-500">({confirmedCount})</span>
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${confirmedPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Pending Approval</span>
              <span className="text-amber-600 dark:text-amber-400">
                {pendingPct}% <span className="text-[10px] font-normal text-slate-500">({pendingCount})</span>
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${pendingPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Returned / Completed</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {returnedPct}% <span className="text-[10px] font-normal text-slate-500">({returnedCount})</span>
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${returnedPct}%` }}
              />
            </div>
          </div>

          {cancelledCount > 0 && (
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Cancelled</span>
                <span className="text-rose-600 dark:text-rose-400">
                  {cancelledPct}% <span className="text-[10px] font-normal text-slate-500">({cancelledCount})</span>
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${cancelledPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

