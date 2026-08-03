'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  CreditCard,
  Star,
  ExternalLink,
  Compass,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, RentalOrder, Payment } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAuthStore } from '@/store/useAuthStore';
import WriteReviewModal from '@/components/dashboard/WriteReviewModal';

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'payments'>('orders');
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(true);
  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const { user } = useAuthStore();

  useEffect(() => {
    setIsLoadingOrders(true);
    apiClient.get<ApiResponse<RentalOrder[]>>('/orders/my-orders')
      .then((res) => { if (res.data?.data) setOrders(res.data.data); })
      .catch(() => setOrders([]))
      .finally(() => setIsLoadingOrders(false));
  }, []);

  useEffect(() => {
    setIsLoadingPayments(true);
    apiClient.get<ApiResponse<Payment[]>>('/payments/history')
      .then((res) => { if (res.data?.data) setPayments(res.data.data); })
      .catch(() => setPayments([]))
      .finally(() => setIsLoadingPayments(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Customer'}</h1>
              <Badge variant="CUSTOMER">Customer Account</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold">
            Total Rentals: <strong className="text-emerald-700">{orders.length}</strong>
          </div>
          <Link href="/gear" className="px-4 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs flex items-center space-x-1.5 transition-all">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Browse New Gear</span>
          </Link>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'orders' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>My Rental Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'payments' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>Payment Receipts ({payments.length})</span>
        </button>
      </div>

      {/* TAB 1: Rental Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {isLoadingOrders ? (
            <TableSkeleton rows={4} columns={6} />
          ) : orders.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Equipment</th>
                      <th className="px-6 py-4">Rental Duration</th>
                      <th className="px-6 py-4">Total Cost</th>
                      <th className="px-6 py-4">Order Status</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{ord.gear?.title || `Gear ID: ${ord.gearId}`}</td>
                        <td className="px-6 py-4">
                          <p className="text-slate-700">{ord.startDate} → {ord.endDate}</p>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">({ord.totalDays} day{ord.totalDays > 1 ? 's' : ''})</p>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-emerald-700">${ord.totalPrice}</td>
                        <td className="px-6 py-4"><Badge variant={ord.orderStatus} /></td>
                        <td className="px-6 py-4"><Badge variant={ord.paymentStatus} /></td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {ord.paymentStatus === 'UNPAID' && (
                            <Link href={`/checkout/${ord.id}`} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all">
                              Pay Now
                            </Link>
                          )}
                          {ord.orderStatus === 'RETURNED' && (
                            <button
                              onClick={() => { setReviewOrder(ord); setIsReviewModalOpen(true); }}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
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
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Rental Orders Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven&apos;t placed any gear rental reservations. Explore our catalog to rent sports gear today.
              </p>
              <Link href="/gear" className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800">
                Explore Gear Catalog
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Payment History Receipts */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {isLoadingPayments ? (
            <TableSkeleton rows={4} columns={5} />
          ) : payments.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Receipt ID</th>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Amount Paid</th>
                      <th className="px-6 py-4">Stripe Transaction ID</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {payments.map((pmt) => (
                      <tr key={pmt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">{pmt.id.slice(0, 12)}...</td>
                        <td className="px-6 py-4 font-mono text-slate-600 text-[11px]">{pmt.orderId.slice(0, 12)}...</td>
                        <td className="px-6 py-4 font-extrabold text-emerald-700">${pmt.amount}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{pmt.transactionId || 'tx_stripe_verified'}</td>
                        <td className="px-6 py-4 text-right"><Badge variant={pmt.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <CreditCard className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Payment History</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Completed Stripe payment receipts will appear here automatically.</p>
            </div>
          )}
        </div>
      )}

      {reviewOrder && (
        <WriteReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          order={reviewOrder}
          onSuccess={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
}
