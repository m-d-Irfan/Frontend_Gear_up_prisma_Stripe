import React from 'react';
import Link from 'next/link';
import { FileCheck, Shield, Scale, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | GrabGear Outdoor Rentals',
  description: 'Read the terms and conditions for using GrabGear equipment rental services in Bangladesh.',
};

export default function TermsOfServicePage() {
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
            <Scale className="w-4 h-4" />
            <span>Platform Service Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Last Updated: August 13, 2026. Welcome to GrabGear. By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>1. Renter & Provider Eligibility</span>
            </h2>
            <p>
              Users must be at least 18 years of age or possess legal parental consent to rent equipment. Providers listing equipment represent and warrant that they possess legal ownership of listed gear.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2. Equipment Rental Terms & Security Deposits</span>
            </h2>
            <p>
              Renters agree to return equipment in the condition received. Security deposits are authorized via Stripe checkout and released upon successful gear return inspection by the equipment provider.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>3. Cancellations & Disputes</span>
            </h2>
            <p>
              Cancellations made prior to scheduled pickup receive full Stripe refund processing. Equipment disputes are mediated by GrabGear support within 48 hours of report submission.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
