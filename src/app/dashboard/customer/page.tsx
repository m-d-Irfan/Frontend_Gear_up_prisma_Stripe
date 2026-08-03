'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  CreditCard,
  Star,
  Clock,
  ExternalLink,
  Loader2,
  Calendar,
  AlertCircle,
  MessageSquare,
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

  // Review Modal state
  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const { user } = useAuthStore();

  // Fetch Customer Rental Orders
  useEffect(() => {
    setIsLoadingOrders(true);
    apiClient
      .get<ApiResponse<RentalOrder[]>>('/orders/my-orders')
      .then((res) => {
        if (res.data?.data) {
          setOrders(res.data.data);
        }
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setIsLoadingOrders(false);
      });
  }, []);

  // Fetch Payment History
  useEffect(() => {
    setIsLoadingPayments(true);
    apiClient
      .get<ApiResponse<Payment[]>>('/payments/history')
      .then((res) => {
        if (res.data?.data) {
          setPayments(res.data.data);
        }
      })
      .catch(() => {
        setPayments([]);
      })
      .finally(() => {
        setIsLoadingPayments(false);
      });
  }, []);

  const openReviewModal = (order: RentalOrder) => {
    setReviewOrder(order);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-2xl shadow-xl shadow-emerald-500/10">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-100">{user?.name || 'Customer'}</h1>
              <Badge variant="CUSTOMER">Customer Account</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300">
            Total Rentals: <strong className="text-emerald-400">{orders.length}</strong>
          </div>
          <Link
            href="/gear"
            className="px-4 py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md"
          >
            Browse New Gear
          </Link>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Rental Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Receipts ({payments.length})</span>
        </button>
      </div>

      {/* TAB 1: Rental Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {isLoadingOrders ? (
            <TableSkeleton rows={4} columns={6} />
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Equipment</th>
                    <th className="px-6 py-4">Rental Duration</th>
                    <th className="px-6 py-4">Total Cost</th>
                    <th className="px-6 py-4">Order Status</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-100">
                        {ord.gear?.title || `Gear ID: ${ord.gearId}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p>{ord.startDate} to {ord.endDate}</p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            ({ord.totalDays} day{ord.totalDays > 1 ? 's' : ''})
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">
                        ${ord.totalPrice}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ord.orderStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ord.paymentStatus} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {ord.paymentStatus === 'UNPAID' && (
                          <Link
                            href={`/checkout/${ord.id}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white gradient-btn"
                          >
                            Pay Now
                          </Link>
                        )}
                        {ord.orderStatus === 'RETURNED' && (
                          <button
                            onClick={() => openReviewModal(ord)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
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
            <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-200">No Rental Orders Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven&apos;t placed any gear rental reservations. Explore our catalog to rent sports gear today.
              </p>
              <Link
                href="/gear"
                className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-btn"
              >
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
            <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Receipt ID</th>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Amount Paid</th>
                    <th className="px-6 py-4">Stripe Transaction ID</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {payments.map((pmt) => (
                    <tr key={pmt.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-400">{pmt.id}</td>
                      <td className="px-6 py-4 font-mono text-slate-300">{pmt.orderId}</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">${pmt.amount}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {pmt.transactionId || 'tx_stripe_verified'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant={pmt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
              <CreditCard className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-200">No Payment History</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Completed Stripe payment receipts will appear here automatically.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Review Modal Integration */}
      {reviewOrder && (
        <WriteReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          order={reviewOrder}
          onSuccess={() => {
            setIsReviewModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
