'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calendar,
  DollarSign,
  Mountain,
  Bike,
  Waves,
  Snowflake,
  Search,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear } from '@/types';
import GearCard from '@/components/gear/GearCard';
import { GearGridSkeleton } from '@/components/ui/LoadingSkeleton';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Camping: <Mountain className="w-6 h-6 text-emerald-400" />,
  Cycling: <Bike className="w-6 h-6 text-cyan-400" />,
  'Water Sports': <Waves className="w-6 h-6 text-blue-400" />,
  'Winter Sports': <Snowflake className="w-6 h-6 text-indigo-400" />,
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredGear, setFeaturedGear] = useState<Gear[]>([]);
  const [isLoadingGear, setIsLoadingGear] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch categories for showcase
    apiClient
      .get<ApiResponse<Category[]>>('/categories')
      .then((res) => {
        if (res.data?.data) {
          setCategories(res.data.data);
        }
      })
      .catch(() => {
        // Fallback default categories if empty backend
        setCategories([
          { id: 'cat-1', name: 'Camping & Hiking', description: 'Tents, backpacks & outdoor survival gear' },
          { id: 'cat-2', name: 'Cycling & Mountain Bikes', description: 'Road bikes, MTBs & helmets' },
          { id: 'cat-3', name: 'Water Sports & Kayaks', description: 'Kayaks, paddleboards & wetsuits' },
          { id: 'cat-4', name: 'Winter & Ski Equipment', description: 'Skis, snowboards & winter jackets' },
        ]);
      });

    // Fetch featured equipment grid
    apiClient
      .get<ApiResponse<Gear[]>>('/gear?limit=6')
      .then((res) => {
        if (res.data?.data) {
          setFeaturedGear(res.data.data);
        }
      })
      .catch(() => {
        setFeaturedGear([]);
      })
      .finally(() => {
        setIsLoadingGear(false);
      });
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-slate-950 via-slate-900 to-[#0b0f19]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
              <Zap className="w-4 h-4" />
              <span>Rent Outdoor & Sports Gear Instantly</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-tight">
              Gear Up for Your Next <span className="gradient-text">Adventure</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore top-quality bikes, camping tents, kayaks, and outdoor equipment. Rent directly from verified gear providers with flexible daily rates and secure Stripe payment.
            </p>

            {/* Quick Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchTerm) {
                    window.location.href = `/gear?search=${encodeURIComponent(searchTerm)}`;
                  }
                }}
                className="glass-card p-2 rounded-2xl border border-slate-800 flex items-center shadow-2xl"
              >
                <div className="pl-3.5 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search bikes, tents, kayaks, skis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn flex items-center space-x-1.5 shrink-0"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-xl mx-auto text-center">
              <div>
                <p className="text-2xl font-black text-emerald-400">2,500+</p>
                <p className="text-xs text-slate-400">Active Listings</p>
              </div>
              <div>
                <p className="text-2xl font-black text-cyan-400">99.8%</p>
                <p className="text-xs text-slate-400">Verified Providers</p>
              </div>
              <div>
                <p className="text-2xl font-black text-indigo-400">Instant</p>
                <p className="text-xs text-slate-400">Stripe Booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Browse Popular <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Find equipment tailored specifically to your sport or activity.
            </p>
          </div>
          <Link
            href="/gear"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const icon =
              CATEGORY_ICONS[cat.name] || <Compass className="w-6 h-6 text-emerald-400" />;
            return (
              <Link
                key={cat.id || idx}
                href={`/gear?category=${encodeURIComponent(cat.id)}`}
                className="group glass-card p-6 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between h-44 hover:translate-y-[-4px]"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {cat.description || 'Explore top gear in this category'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Equipment Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Featured <span className="gradient-text">Equipment</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top rated gear available for instant daily rental.
            </p>
          </div>
          <Link
            href="/gear"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Explore All Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoadingGear ? (
          <GearGridSkeleton count={6} />
        ) : featuredGear.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGear.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <Compass className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-200">No Featured Gear Available</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Check back soon as providers add new rental listings to the platform catalog.
            </p>
            <Link
              href="/gear"
              className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-btn"
            >
              Browse Catalog
            </Link>
          </div>
        )}
      </section>

      {/* Why Rent With GearUp Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card bg-slate-900/60 rounded-3xl border border-slate-800 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Why Sports Enthusiasts Choose <span className="gradient-text">GearUp</span>
            </h2>
            <p className="text-sm text-slate-400">
              The easiest way to access premium equipment without heavy purchase costs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Verified Quality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All listed gear undergoes quality check by verified equipment shop owners.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Flexible Dates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pick start and end dates with transparent daily rates and dynamic calculation.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Instant Stripe Payment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless checkout with Stripe Elements and instant status confirmation.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Save Up to 80%</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy expensive outdoor equipment for weekend trips without buying outright.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-btn p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Have Equipment Sitting Idle?
            </h2>
            <p className="text-sm text-emerald-100">
              Register as a GearUp Provider today and start earning money by renting out your sports & outdoor equipment.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 shrink-0">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 shadow-lg text-center"
            >
              Become a Provider
            </Link>
            <Link
              href="/gear"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-950/40 border border-white/20 text-white font-semibold text-sm hover:bg-emerald-950/60 text-center"
            >
              Browse Gear
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
