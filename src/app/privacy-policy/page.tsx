import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, ArrowLeft, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | GrabGear Outdoor Rentals',
  description: 'Learn how GrabGear protects your personal information, Stripe payment credentials, and rental data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen ambient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Protection & Privacy Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Last Updated: August 13, 2026. GrabGear Outdoor Rentals (&quot;GrabGear&quot;, &quot;we&quot;, &quot;us&quot;) is committed to respecting your privacy and protecting personal data processed through our peer-to-peer equipment rental platform.
          </p>
        </div>

        {/* Document Content Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              We collect information that you directly provide when registering an account, listing equipment as a provider, renting gear as a customer, or communicating with support:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Account identity (Full Name, Email Address, Phone Number, Profile Avatar).</li>
              <li>Verification data for equipment providers and renters.</li>
              <li>Transaction data (rental dates, order IDs, payment status).</li>
              <li>Communications sent via WhatsApp or email contact forms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2. Payment Security & Stripe Escrow</span>
            </h2>
            <p>
              GrabGear utilizes **Stripe PCI-DSS Level 1 Certified payment processing**. Your credit card and banking details are encrypted directly by Stripe and are **never stored on GrabGear servers**.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>3. How Information Is Used</span>
            </h2>
            <p>
              Collected information is strictly used to facilitate peer-to-peer equipment rentals, send automated order confirmations via Gmail SMTP, prevent fraudulent transactions, and provide 24/7 customer support.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>4. Your Privacy Rights & Contact</span>
            </h2>
            <p>
              You maintain the right to view, update, or self-delete your account profile data at any time via the **User Dashboard Profile** page. For questions regarding data processing, contact our privacy officer at <span className="font-bold text-emerald-600 dark:text-emerald-400">grabgear4100@gmail.com</span> or via hotline <span className="font-bold text-emerald-600 dark:text-emerald-400">+880 1611-836864</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
