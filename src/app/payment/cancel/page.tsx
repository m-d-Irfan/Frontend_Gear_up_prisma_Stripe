'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-8">
      {/* Canceled Icon Badge */}
      <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-2xl shadow-rose-500/10">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-100">Payment Canceled</h1>
        <p className="text-sm text-slate-400">
          Your Stripe payment process was interrupted or canceled. No charges were made to your account.
        </p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2 text-left">
        <p className="font-semibold text-slate-200">What happens next?</p>
        <ul className="list-disc pl-4 space-y-1 text-slate-400">
          <li>Your selected rental equipment remains saved in your cart/session.</li>
          <li>You can attempt checkout again at any time.</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/gear"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Checkout</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800/60 flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
