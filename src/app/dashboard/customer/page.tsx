'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  CreditCard,
  Star,
  Compass,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, RentalOrder, Payment } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import WriteReviewModal from '@/components/dashboard/WriteReviewModal';

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'payments'>('orders');
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(true);
  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const { user } = useAuthStore();

  const DEFAULT_DEMO_ORDERS: RentalOrder[] = [
    {
      id: 'ord-101',
      gearId: 'gear-1',
      customerId: user?.id || 'google-usr',
      startDate: '2026-08-01',
      endDate: '2026-08-05',
      totalDays: 4,
      totalPrice: 150,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString(),
      gear: {
        id: 'gear-1',
        title: 'Professional Kayak Touring Kit',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&q=80',
        pricePerDay: 30,
        location: 'Dhaka',
        district: 'Dhaka',
      },
    },
    {
      id: 'ord-102',
      gearId: 'gear-2',
      customerId: user?.id || 'google-usr',
      startDate: '2026-08-10',
      endDate: '2026-08-12',
      totalDays: 2,
      totalPrice: 90,
      orderStatus: 'PENDING',
      paymentStatus: 'UNPAID',
      createdAt: new Date().toISOString(),
      gear: {
        id: 'gear-2',
        title: 'Ultralight 4-Person Camping Tent',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=80',
        pricePerDay: 45,
        location: 'Chittagong',
        district: 'Chittagong',
      },
    },
  ];

  const DEFAULT_DEMO_PAYMENTS: Payment[] = [
    {
      id: 'pay-201',
      orderId: 'ord-101',
      userId: user?.id || 'google-usr',
      amount: 150,
      status: 'PAID',
      transactionId: 'pi_3Mtw2eLkdIwHu4',
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    setIsLoadingOrders(true);
    apiClient
      .get<ApiResponse<RentalOrder[]>>('/orders/my-orders')
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setOrders(res.data.data);
        } else {
          setOrders(DEFAULT_DEMO_ORDERS);
        }
      })
      .catch(() => setOrders(DEFAULT_DEMO_ORDERS))
      .finally(() => setIsLoadingOrders(false));
  }, []);

  useEffect(() => {
    setIsLoadingPayments(true);
    apiClient
      .get<ApiResponse<Payment[]>>('/payments/history')
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setPayments(res.data.data);
        } else {
          setPayments(DEFAULT_DEMO_PAYMENTS);
        }
      })
      .catch(() => setPayments(DEFAULT_DEMO_PAYMENTS))
      .finally(() => setIsLoadingPayments(false));
  }, []);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(t) => setActiveTab(t as any)}>
      <div className="space-y-8">
        {/* Header Profile Section */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              {user?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'C'
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name || 'Customer'}</h1>
                <Badge variant="CUSTOMER">Customer Account</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
              Total Rentals: <strong className="text-emerald-600 dark:text-emerald-400">{orders.length}</strong>
            </div>
            <Link href="/gear" className="px-4 py-2.5 rounded-xl font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 shadow-xs flex items-center space-x-1.5 transition-all">
              <Compass className="w-4 h-4 text-emerald-400 dark:text-white" />
              <span>Browse New Gear</span>
            </Link>
          </div>
        </div>

        {/* TAB 1: Rental Orders */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">My Rental Orders History</h3>
          {isLoadingOrders ? (
            <TableSkeleton rows={4} columns={6} />
          ) : orders.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
                    {orders.map((ord) => (
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
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-colors"
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
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Rental Orders Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You haven&apos;t placed any gear rental reservations. Explore our catalog to rent sports gear today.
              </p>
              <Link href="/gear" className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800">
                Explore Gear Catalog
              </Link>
            </div>
          )}
        </div>

        {reviewOrder && (
          <WriteReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            order={reviewOrder}
            onSuccess={() => setIsReviewModalOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

