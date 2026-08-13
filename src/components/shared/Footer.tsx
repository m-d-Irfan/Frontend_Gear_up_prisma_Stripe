import React from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, CreditCard, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 mt-auto relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col & Official Details */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9.5 h-9.5 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center shadow-xs">
                <Dumbbell className="w-4.5 h-4.5 text-emerald-400 dark:text-slate-950 transform -rotate-45" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Grab<span className="text-emerald-600 dark:text-emerald-400">Gear</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Bangladesh&apos;s premier peer-to-peer sports & outdoor equipment rental platform. Rent top-quality gear instantly with secure Stripe payment.
            </p>
            
            <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Hotline: +880 1611-836864</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Official: grabgear4100@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verified & Secured by Stripe</span>
            </div>
          </div>

          {/* Navigation & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation & Legal
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
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
                  Contact Support Channel
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link href="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-slate-500 dark:text-slate-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-slate-500 dark:text-slate-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/rental-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-slate-500 dark:text-slate-400">
                  Refund & Rental Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="/gear?category=Cycling%20%26%20Biking" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <span>🚴‍♂️</span>
                  <span>Cycling & Biking</span>
                </Link>
              </li>
              <li>
                <Link href="/gear?category=Camping%20%26%20Hiking" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <span>⛺</span>
                  <span>Camping & Hiking</span>
                </Link>
              </li>
              <li>
                <Link href="/gear?category=Water%20Sports" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <span>🚣‍♂️</span>
                  <span>Water Sports & Kayaking</span>
                </Link>
              </li>
              <li>
                <Link href="/gear?category=Winter%20Sports" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <span>⛷️</span>
                  <span>Winter Sports & Skis</span>
                </Link>
              </li>
              <li>
                <Link href="/gear?category=Climbing%20%26%20Mountaineering" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <span>🧗‍♂️</span>
                  <span>Climbing & Mountaineering</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Guarantee Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Safety & Guarantee
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Every rental is protected by GrabGear Verification. Real-time availability tracking and multi-role dashboards for Renter, Provider, and Admin.
            </p>
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 text-xs font-semibold pt-1">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Stripe Checkout Integration</span>
            </div>
          </div>
        </div>

        {/* Professional Copyright Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 GrabGear Outdoor Rentals. All Rights Reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 text-slate-600 dark:text-slate-400 font-medium">
            <span>Built for outdoor lovers with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
