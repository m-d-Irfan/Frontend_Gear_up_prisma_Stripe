import React from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldCheck, CreditCard, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 mt-auto relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Dumbbell className="w-4 h-4 text-emerald-400 transform -rotate-45" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Gear<span className="text-emerald-600">Up</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Peer-to-peer sports & outdoor equipment rental platform. Rent top-quality gear instantly with secure Stripe payment processing.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified & Secured by Stripe</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/gear" className="hover:text-slate-900 transition-colors">
                  Explore Gear Catalog
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-slate-900 transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-slate-900 transition-colors">
                  Register as Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="hover:text-slate-900 transition-colors">Cycling & Biking</li>
              <li className="hover:text-slate-900 transition-colors">Camping & Hiking</li>
              <li className="hover:text-slate-900 transition-colors">Water Sports & Kayaking</li>
              <li className="hover:text-slate-900 transition-colors">Winter Sports & Skis</li>
            </ul>
          </div>

          {/* Security & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Safety & Guarantee
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every rental is covered by GearUp verification. Real-time availability tracking and multi-role dashboards for Customers, Providers, and Admins.
            </p>
            <div className="flex items-center space-x-2 text-slate-700 text-xs font-semibold pt-1">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Stripe Checkout Integration</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GearUp Platform. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 text-slate-600 font-medium">
            <span>Built for outdoor lovers with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
