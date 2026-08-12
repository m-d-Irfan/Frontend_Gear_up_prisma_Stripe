'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  CreditCard,
  Star,
  Compass,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, RentalOrder, Payment } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import WriteReviewModal from '@/components/dashboard/WriteReviewModal';
import { useAuthStore } from '@/store/useAuthStore';

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'payments' | 'analytics'>('orders');
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(true);
  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Filters & Pagination
  const [orderSearchTerm, setOrderSearchTerm] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderPage, setOrderPage] = useState<number>(1);
  const [paymentPage, setPaymentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const { user } = useAuthStore();

  useEffect(() => {
    setIsLoadingOrders(true);
    const updatePaidStatus = (list: RentalOrder[]) => {
      return list.map((ord) => {
        const isPaid =
          typeof window !== 'undefined' &&
          (localStorage.getItem(`order_paid_${ord.id}`) === 'PAID' ||
            sessionStorage.getItem(`order_paid_${ord.id}`) === 'PAID' ||
            localStorage.getItem('order_paid_recent') === 'true');
        if (isPaid) {
          return { ...ord, paymentStatus: 'PAID' as const, orderStatus: 'CONFIRMED' as const };
        }
        return ord;
      });
    };

    apiClient
      .get<ApiResponse<RentalOrder[]>>('/orders/my-orders')
      .then((res) => {
        const rawOrders = res.data?.data || [];
        let localOrders: RentalOrder[] = [];
        if (typeof window !== 'undefined' && user?.email) {
          try {
            const cached = localStorage.getItem(`customer_orders_${user.email}`);
            if (cached) localOrders = JSON.parse(cached);
          } catch {}
        }
        const combined = [...rawOrders];
        localOrders.forEach((lo) => {
          if (!combined.some((item) => item.id === lo.id)) {
            combined.push(lo);
          }
        });

        setOrders(updatePaidStatus(combined));
      })
      .catch(() => {
        let localOrders: RentalOrder[] = [];
        if (typeof window !== 'undefined' && user?.email) {
          try {
            const cached = localStorage.getItem(`customer_orders_${user.email}`);
            if (cached) localOrders = JSON.parse(cached);
          } catch {}
        }
        setOrders(updatePaidStatus(localOrders));
      })
      .finally(() => setIsLoadingOrders(false));
  }, [user]);

  useEffect(() => {
    setIsLoadingPayments(true);
    apiClient
      .get<ApiResponse<Payment[]>>('/payments/history')
      .then((res) => {
        setPayments(res.data?.data || []);
      })
      .catch(() => {
        setPayments([]);
      })
      .finally(() => setIsLoadingPayments(false));
  }, []);

  const totalSpent = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (ord.gear?.title && ord.gear.title.toLowerCase().includes(orderSearchTerm.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'ALL' || ord.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrderPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ITEMS_PER_PAGE,
    orderPage * ITEMS_PER_PAGE
  );

  const totalPaymentPages = Math.ceil(payments.length / ITEMS_PER_PAGE) || 1;
  const paginatedPayments = payments.slice(
    (paymentPage - 1) * ITEMS_PER_PAGE,
    paymentPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(tabKey) => setActiveTab(tabKey as any)}>
      <div className="space-y-8">
        {/* Profile Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              {user?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'C'
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name || 'Customer'}</h1>
                <Badge variant="CUSTOMER">Renter Account</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage your gear rentals, check payment status, and write reviews.
              </p>
            </div>
          </div>

          <Link
            href="/gear"
            className="px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-slate-800 flex items-center space-x-2 shadow-xs transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Outdoor Gear</span>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Rentals</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{orders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Invested</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Reservations</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {orders.filter((o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PENDING').length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gear Reviews</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {orders.filter((o) => o.orderStatus === 'RETURNED').length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1: Orders History Table */}
        {(activeTab === 'orders' || activeTab === 'overview' as any) && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">My Rental Orders History</h3>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-grow sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search order or equipment..."
                    value={orderSearchTerm}
                    onChange={(e) => {
                      setOrderSearchTerm(e.target.value);
                      setOrderPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => {
                    setOrderStatusFilter(e.target.value);
                    setOrderPage(1);
                  }}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="RETURNED">RETURNED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {isLoadingOrders ? (
              <TableSkeleton rows={4} columns={6} />
            ) : paginatedOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Equipment</th>
                      <th className="px-6 py-4">Rental Duration</th>
                      <th className="px-6 py-4">Total Cost</th>
                      <th className="px-6 py-4">Order Status</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{ord.gear?.title || `Gear ID: ${ord.gearId}`}</td>
                        <td className="px-6 py-4">
                          <p className="text-slate-700 dark:text-slate-300">{ord.startDate} → {ord.endDate}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">({ord.totalDays} day{ord.totalDays > 1 ? 's' : ''})</p>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">${ord.totalPrice}</td>
                        <td className="px-6 py-4"><Badge variant={ord.orderStatus} /></td>
                        <td className="px-6 py-4"><Badge variant={ord.paymentStatus} /></td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {ord.paymentStatus === 'UNPAID' && (
                            <Link href={`/checkout/${ord.id}`} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 transition-all">
                              Pay Now
                            </Link>
                          )}
                          {ord.orderStatus === 'RETURNED' && (
                            <button
                              onClick={() => { setReviewOrder(ord); setIsReviewModalOpen(true); }}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              <span>Leave Review</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No rental orders matching search criteria.</p>
            )}

            {/* Pagination Controls */}
            {totalOrderPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <p className="text-slate-500 font-semibold">
                  Showing {(orderPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(orderPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={orderPage === 1}
                    onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Page {orderPage} of {totalOrderPages}
                  </span>
                  <button
                    disabled={orderPage === totalOrderPages}
                    onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Payments History */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Payment Statements & Transactions</h3>
            {isLoadingPayments ? (
              <TableSkeleton rows={3} columns={4} />
            ) : paginatedPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Amount Paid</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{p.transactionId || p.id}</td>
                        <td className="px-6 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">${p.amount}</td>
                        <td className="px-6 py-4"><Badge variant={p.status || 'PAID'} /></td>
                        <td className="px-6 py-4 text-right text-slate-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No payment transactions recorded.</p>
            )}
          </div>
        )}

        {/* Charts & Analytics */}
        <AnalyticsCharts orders={orders} totalRevenue={totalSpent} totalOrders={orders.length} totalUsers={1} role="CUSTOMER" />
      </div>

      {/* Review Modal */}
      {reviewOrder && (
        <WriteReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => { setReviewOrder(null); setIsReviewModalOpen(false); }}
          order={reviewOrder}
          onSuccess={() => { setReviewOrder(null); setIsReviewModalOpen(false); }}
        />
      )}
    </DashboardLayout>
  );
}
