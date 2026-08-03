import React from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, CreditCard, Heart, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center text-white">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-100 tracking-tight">
                Gear<span className="gradient-text">Up</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              GearUp is the ultimate equipment rental platform. Rent premium camping gear, bikes, water sports gear, and outdoor equipment instantly with secure Stripe checkout.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-slate-400">
              <div className="flex items-center space-x-1.5 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Stripe Encrypted</span>
              </div>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/gear" className="hover:text-emerald-400 transition-colors">
                  Camping & Hiking
                </Link>
              </li>
              <li>
                <Link href="/gear" className="hover:text-emerald-400 transition-colors">
                  Cycling & Mountain Bikes
                </Link>
              </li>
              <li>
                <Link href="/gear" className="hover:text-emerald-400 transition-colors">
                  Water Sports & Kayaks
                </Link>
              </li>
              <li>
                <Link href="/gear" className="hover:text-emerald-400 transition-colors">
                  Winter & Ski Equipment
                </Link>
              </li>
              <li>
                <Link href="/gear" className="hover:text-emerald-400 transition-colors">
                  Climbing & Trekking
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/gear" className="hover:text-emerald-400 transition-colors">
                  Browse All Gear
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition-colors">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-emerald-400 transition-colors">
                  Track Rental Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>San Francisco, CA & Global</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@gearup-rental.com</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (800) 555-GEAR</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GearUp Inc. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with Next.js 15, Tailwind CSS v4 & Stripe</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
