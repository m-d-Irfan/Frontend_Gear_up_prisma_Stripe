'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, CreditCard, MapPin, Phone, Mail, FileText, Scale, RotateCcw } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

export default function Footer() {
  const { categories } = useAppData();

  // Emoji map for common category names
  const categoryEmoji = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('cycling') || lower.includes('biking') || lower.includes('bike')) return '🚴‍♂️';
    if (lower.includes('camping') || lower.includes('hiking')) return '⛺';
    if (lower.includes('water') || lower.includes('kayak')) return '🚣‍♂️';
    if (lower.includes('winter') || lower.includes('ski') || lower.includes('snow')) return '⛷️';
    if (lower.includes('climbing') || lower.includes('mountain')) return '🧗‍♂️';
    if (lower.includes('fitness') || lower.includes('gym')) return '💪';
    return '🏕️';
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 mt-auto relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main 4-Column Grid — 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Company Details */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9.5 h-9.5 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center shadow-xs">
                <Dumbbell className="w-4.5 h-4.5 text-emerald-400 dark:text-slate-950 transform -rotate-45" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Grab<span className="text-emerald-600 dark:text-emerald-400">Gear</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Bangladesh&apos;s premier peer-to-peer sports &amp; outdoor equipment rental platform. Rent top-quality gear instantly with secure Stripe payment.
            </p>
            
            <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Hotline: +880 1611-836864</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>grabgear4100@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verified &amp; Secured by Stripe</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/gear" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Explore Gear Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About GrabGear
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Categories (Dynamic from Admin API) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {categories.length > 0 ? (
                categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/gear?category=${encodeURIComponent(cat.name)}`}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5"
                    >
                      <span>{categoryEmoji(cat.name)}</span>
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/gear?category=Cycling%20%26%20Biking" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                      <span>🚴‍♂️</span>
                      <span>Cycling &amp; Biking</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/gear?category=Camping%20%26%20Hiking" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                      <span>⛺</span>
                      <span>Camping &amp; Hiking</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/gear?category=Water%20Sports" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                      <span>🚣‍♂️</span>
                      <span>Water Sports</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/gear?category=Winter%20Sports" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                      <span>⛷️</span>
                      <span>Winter Sports</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Legal & Policies — visually distinct with icons */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link
                  href="/privacy-policy"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group"
                >
                  <Scale className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/rental-policy"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  <span>Refund &amp; Rental Policy</span>
                </Link>
              </li>
            </ul>

            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-500 text-xs font-medium pt-1">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Stripe Checkout Integration</span>
            </div>
          </div>
        </div>

        {/* Professional Copyright Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} GrabGear Outdoor Rentals Ltd. All rights reserved. Gulshan-2, Dhaka 1212, Bangladesh.</p>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <Link href="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy</Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Link href="/terms-of-service" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms</Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Link href="/rental-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
