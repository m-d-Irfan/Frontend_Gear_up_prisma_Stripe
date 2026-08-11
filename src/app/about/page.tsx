'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Users, Award, HeartHandshake, Dumbbell, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <Dumbbell className="w-4 h-4 transform -rotate-45" />
          <span>About GearUp Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Empowering Outdoor Adventure Through Shared Gear
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          GearUp connects outdoor enthusiasts with verified equipment providers across Bangladesh. Rent top-tier mountain bikes, camping tents, kayaking gear, and sports equipment without high ownership costs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm">
          <p className="text-3xl font-black text-slate-900 dark:text-white">5,000+</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Verified Equipment Items</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm">
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">12,000+</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Successful Rentals</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm">
          <p className="text-3xl font-black text-slate-900 dark:text-white">64</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Districts Covered</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm">
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">99.8%</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Satisfaction Score</p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Our Mission & Core Values</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Why thousands choose GearUp for outdoor equipment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Verified Equipment Only</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every item listed on GearUp undergoes provider verification and safety inspection before being offered for rental.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Community & Sustainability</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              By sharing quality outdoor gear, we reduce manufacturing waste and enable everyone to enjoy nature affordably.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Seamless Stripe Payments</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Secure, instant checkout with real-time rental calculations and automated booking protection.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 dark:bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black">Ready to Start Your Adventure?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Explore our wide collection of outdoor gear or list your own equipment to earn income today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/gear"
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 inline-flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Explore Catalog</span>
            <Compass className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 inline-flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Become a Provider</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
