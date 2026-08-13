import React from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, Clock, ArrowLeft, Check } from 'lucide-react';

export const metadata = {
  title: 'Refund & Rental Policy | GrabGear Outdoor Rentals',
  description: 'Understand equipment return guidelines, damage policy, and instant refund terms on GrabGear.',
};

export default function RentalPolicyPage() {
  return (
    <div className="min-h-screen ambient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <RefreshCw className="w-4 h-4" />
            <span>Refund & Inspection Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Refund & Rental Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Last Updated: August 13, 2026. This policy outlines equipment inspection standards, return deadlines, security deposit releases, and refund terms.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>1. Pickup & Return Timeframes</span>
            </h2>
            <p>
              Gear rental periods commence at 09:00 AM on the agreed start date and expire at 08:00 PM on the scheduled return date. Late returns beyond a 2-hour grace period incur standard daily extension rates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2. Instant Stripe Refund Guarantee</span>
            </h2>
            <p>
              If gear received is significantly not as described or fails safety inspection at pickup, renters receive an **instant 100% full refund via Stripe** with zero cancellation penalty.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>3. Wear-and-Tear vs Damage Policy</span>
            </h2>
            <p>
              Normal minor wear and tear (dust, light mud, superficial surface scuffs) is fully covered by GrabGear Protection. Severe damage resulting from negligence or lost items is deducted from the authorization deposit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
