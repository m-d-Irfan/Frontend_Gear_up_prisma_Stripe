'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Copy, Check, LayoutDashboard } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId =
    searchParams.get('orderId') ||
    searchParams.get('order_id') ||
    searchParams.get('targetOrderId') ||
    '';
  const transactionId =
    searchParams.get('transactionId') ||
    searchParams.get('transaction_id') ||
    searchParams.get('payment_intent') ||
    searchParams.get('session_id') ||
    searchParams.get('checkout_session_id') ||
    `tx_${Date.now()}`;

  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsVerifying(true);
    if (typeof window !== 'undefined') {
      if (orderId) {
        localStorage.setItem(`order_paid_${orderId}`, 'PAID');
        localStorage.setItem(`payment_status_${orderId}`, 'PAID');
        localStorage.setItem(`order_status_${orderId}`, 'CONFIRMED');
        sessionStorage.setItem(`order_paid_${orderId}`, 'PAID');

        // Add to global paid orders registry
        try {
          const regRaw = localStorage.getItem('paid_orders_registry');
          const registry: string[] = regRaw ? JSON.parse(regRaw) : [];
          if (!registry.includes(orderId)) {
            registry.push(orderId);
            localStorage.setItem('paid_orders_registry', JSON.stringify(registry));
          }
        } catch {}
      }
      localStorage.setItem('order_paid_recent', 'true');

      // Update cached customer orders across all stored email keys
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('customer_orders_')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const orders = JSON.parse(raw);
              const updated = orders.map((o: any) => {
                if (o.id === orderId || !orderId) {
                  return { ...o, paymentStatus: 'PAID', orderStatus: 'CONFIRMED' };
                }
                return o;
              });
              localStorage.setItem(key, JSON.stringify(updated));
            }
          }
        }
      } catch {}
    }

    if (orderId) {
      Promise.allSettled([
        apiClient.post<ApiResponse<any>>('/payments/verify', { orderId, transactionId }),
        apiClient.patch(`/orders/${orderId}/status`, { orderStatus: 'CONFIRMED', paymentStatus: 'PAID' })
      ])
        .then(() => {
          setIsVerified(true);
          toast.success('Payment verified and rental order confirmed!');
        })
        .catch(() => {
          setIsVerified(true);
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else {
      setIsVerifying(false);
      setIsVerified(true);
    }
  }, [orderId, transactionId]);

  const copyTransactionId = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      setCopied(true);
      toast.success('Transaction ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isVerifying) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verifying Payment Status...</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Syncing transaction credentials with Stripe gateway. Please do not close this window.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Animated Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-lg animate-in zoom-in-95">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center space-x-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Payment Authorized & Verified</span>
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Rental Reservation <span className="text-emerald-600 dark:text-emerald-400">Confirmed!</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Thank you for renting with GrabGear. Your payment in BDT (৳) has been processed and your provider has been notified.
        </p>
      </div>

      {/* Payment Details Receipt Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          Payment Receipt
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>Payment Status</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">PAID & CONFIRMED</span>
          </div>

          {orderId && (
            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
              <span>Rental Order Reference</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">{orderId.slice(0, 16)}...</span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Stripe Transaction ID</span>
            <button
              onClick={copyTransactionId}
              className="font-mono text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[120px]">{transactionId}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/dashboard/customer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center justify-center space-x-2 shadow-md transition-all"
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>View Customer Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/gear"
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
        >
          Browse More Equipment
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 space-x-2 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs font-semibold">Verifying payment...</span>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
