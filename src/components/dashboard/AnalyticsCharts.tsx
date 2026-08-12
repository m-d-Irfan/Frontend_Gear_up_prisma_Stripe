'use client';

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  ShieldCheck,
  Package,
  BarChart3,
  CreditCard,
  Layers,
  Activity,
  Sparkles,
  PieChart,
} from 'lucide-react';
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

// Helper: Monthly data calculation from real order list
function calculateMonthlyBuckets(ordersList: RentalOrder[]) {
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
}

export default function AnalyticsCharts({
  orders = [],
  totalRevenue,
  totalOrders,
  totalGear = 0,
  totalUsers = 0,
  title,
  subtitle,
  role = 'ADMIN',
}: AnalyticsChartsProps) {
  const monthlyData = calculateMonthlyBuckets(orders);
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 0);

  // Compute month-over-month growth
  const latestMonthRev = monthlyData[monthlyData.length - 1]?.revenue || 0;
  const prevMonthRev = monthlyData[monthlyData.length - 2]?.revenue || 0;

  let growthText = '0.0% Growth';
  if (prevMonthRev > 0) {
    const growthPercent = ((latestMonthRev - prevMonthRev) / prevMonthRev) * 100;
    growthText = `${growthPercent >= 0 ? '+' : ''}${growthPercent.toFixed(1)}% Growth`;
  } else if (latestMonthRev > 0) {
    growthText = '+100% Growth';
  }

  // Compute status counts
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

  // ==========================================
  // 1. PROVIDER ROLE CUSTOM DESIGN
  // ==========================================
  if (role === 'PROVIDER') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Store className="w-5 h-5 text-emerald-500" />
              <span>{title || 'Store Performance & Rental Fulfillment'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle || 'Real-time store earnings and customer rental status metrics'}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Store Earnings Active</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Provider Earnings Trend Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Provider Earnings Trend (৳)</span>
                </h3>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  ৳{(totalRevenue ?? monthlyData.reduce((a, b) => a + b.revenue, 0)).toFixed(0)}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {growthText}
              </span>
            </div>

            {/* Bars */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100 dark:border-slate-800">
              {monthlyData.map((item, idx) => {
                const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                const barHeight = item.revenue > 0 ? Math.max(heightPercent, 14) : 10;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="relative w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden flex items-end h-32 border border-slate-200/60 dark:border-slate-700/60">
                      <div
                        style={{ height: `${barHeight}%` }}
                        className={`w-full ${
                          item.revenue > 0
                            ? 'bg-gradient-to-t from-emerald-900 via-emerald-600 to-teal-400 dark:from-emerald-800 dark:via-emerald-500 dark:to-teal-300 group-hover:from-emerald-600 group-hover:to-teal-300 shadow-sm'
                            : 'bg-emerald-500/15 dark:bg-emerald-400/20 border-t-2 border-dashed border-emerald-500/50'
                        } transition-all duration-300 rounded-t-lg relative`}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-20">
                          ৳{item.revenue.toFixed(0)} ({item.ordersCount} order{item.ordersCount === 1 ? '' : 's'})
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Provider Fulfillment & Order Status Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Customer Rental Fulfillment</span>
                  </h3>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {orderCount} Incoming Order{orderCount === 1 ? '' : 's'}
                  </p>
                </div>
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                  {confirmedCount} Rented Out
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Rented Out & Picked Up</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {confirmedPct}% <span className="text-[10px] text-slate-400">({confirmedCount})</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${confirmedPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Pending Approval / Fulfillment</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {pendingPct}% <span className="text-[10px] text-slate-400">({pendingCount})</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pendingPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Returned & Completed</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {returnedPct}% <span className="text-[10px] text-slate-400">({returnedCount})</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${returnedPct}%` }} />
                  </div>
                </div>

                {cancelledCount > 0 && (
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Cancelled Orders</span>
                      <span className="text-rose-600 dark:text-rose-400">
                        {cancelledPct}% <span className="text-[10px] text-slate-400">({cancelledCount})</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${cancelledPct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <Package className="w-3.5 h-3.5 text-emerald-500" />
                <span>Store Catalog Items: {totalGear}</span>
              </span>
              <span>Live Fulfillment Rate</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. CUSTOMER ROLE CUSTOM DESIGN
  // ==========================================
  if (role === 'CUSTOMER') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>{title || 'Outdoor Adventure Expenses & Rental Activity'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle || 'Track your gear rental investments and reservation statuses'}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1.5">
            <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
            <span>Verified Customer</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Spending Trend Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Rental Spending Trend ($)</span>
                </h3>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  ${(totalRevenue ?? monthlyData.reduce((a, b) => a + b.revenue, 0)).toFixed(2)}
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                {growthText}
              </span>
            </div>

            {/* Bars */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100 dark:border-slate-800">
              {monthlyData.map((item, idx) => {
                const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                const barHeight = item.revenue > 0 ? Math.max(heightPercent, 14) : 10;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="relative w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden flex items-end h-32 border border-slate-200/60 dark:border-slate-700/60">
                      <div
                        style={{ height: `${barHeight}%` }}
                        className={`w-full ${
                          item.revenue > 0
                            ? 'bg-gradient-to-t from-sky-900 via-indigo-600 to-cyan-400 dark:from-indigo-900 dark:via-indigo-500 dark:to-cyan-300 group-hover:from-indigo-600 group-hover:to-cyan-300 shadow-sm'
                            : 'bg-indigo-500/15 dark:bg-indigo-400/20 border-t-2 border-dashed border-indigo-500/50'
                        } transition-all duration-300 rounded-t-lg relative`}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-20">
                          ${item.revenue.toFixed(0)} ({item.ordersCount} booking{item.ordersCount === 1 ? '' : 's'})
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Rental History Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>My Gear Rental History</span>
                  </h3>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {orderCount} Reservation{orderCount === 1 ? '' : 's'} Placed
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {returnedCount} Completed
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Active & Confirmed Rentals</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {confirmedPct}% <span className="text-[10px] text-slate-400">({confirmedCount})</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${confirmedPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Pending Provider Approval</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {pendingPct}% <span className="text-[10px] text-slate-400">({pendingCount})</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pendingPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Returned Equipment</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {returnedPct}% <span className="text-[10px] text-slate-400">({returnedCount})</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${returnedPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Verified Adventure Account</span>
              </span>
              <span>100% Safe Checkout</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. ADMIN ROLE CUSTOM DESIGN (DEFAULT)
  // ==========================================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            <span>{title || 'Platform Overview & System Analytics'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle || 'Platform-wide revenue stream, total orders, and system inventory health'}
          </p>
        </div>
        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 flex items-center space-x-1.5">
          <PieChart className="w-3.5 h-3.5 text-purple-500" />
          <span>System Admin Active</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Platform Revenue Trend Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Platform Gross Revenue Trend ($)</span>
              </h3>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                ${(totalRevenue ?? monthlyData.reduce((a, b) => a + b.revenue, 0)).toFixed(2)}
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
              {growthText}
            </span>
          </div>

          {/* Bars */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100 dark:border-slate-800">
            {monthlyData.map((item, idx) => {
              const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              const barHeight = item.revenue > 0 ? Math.max(heightPercent, 14) : 10;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden flex items-end h-32 border border-slate-200/60 dark:border-slate-700/60">
                    <div
                      style={{ height: `${barHeight}%` }}
                      className={`w-full ${
                        item.revenue > 0
                          ? 'bg-gradient-to-t from-slate-950 via-purple-800 to-emerald-400 dark:from-purple-950 dark:via-purple-600 dark:to-emerald-400 group-hover:from-purple-600 group-hover:to-emerald-400 shadow-sm'
                          : 'bg-purple-500/15 dark:bg-purple-400/20 border-t-2 border-dashed border-purple-500/50'
                      } transition-all duration-300 rounded-t-lg relative`}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-20">
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

        {/* Admin Platform-Wide Status & Inventory Health */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Platform Rental Order Distribution</span>
                </h3>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {orderCount} Total System Orders
                </p>
              </div>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                System Active
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Confirmed & Rented</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {confirmedPct}% <span className="text-[10px] text-slate-400">({confirmedCount})</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${confirmedPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Pending Approval</span>
                  <span className="text-amber-600 dark:text-amber-400">
                    {pendingPct}% <span className="text-[10px] text-slate-400">({pendingCount})</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pendingPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Returned & Completed</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {returnedPct}% <span className="text-[10px] text-slate-400">({returnedCount})</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${returnedPct}%` }} />
                </div>
              </div>

              {cancelledCount > 0 && (
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Cancelled System Orders</span>
                    <span className="text-rose-600 dark:text-rose-400">
                      {cancelledPct}% <span className="text-[10px] text-slate-400">({cancelledCount})</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${cancelledPct}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Package className="w-3.5 h-3.5 text-purple-500" />
              <span>Platform Listings: {totalGear}</span>
            </span>
            <span>Registered Accounts: {totalUsers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


