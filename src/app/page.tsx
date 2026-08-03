import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Dumbbell, 
  CheckCircle2, 
  Star, 
  CreditCard,
  Layers,
  Search
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear } from '@/types';
import GearCard from '@/components/gear/GearCard';

export const revalidate = 60; // Revalidate every minute

async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return res.data?.data || [];
  } catch (error) {
    return [];
  }
}

async function getFeaturedGear(): Promise<Gear[]> {
  try {
    const res = await apiClient.get<ApiResponse<Gear[]>>('/gear?limit=6');
    return res.data?.data || [];
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();
  const featuredGear = await getFeaturedGear();

  const categoryIcons: Record<string, string> = {
    'Cycling & Biking': '🚴‍♂️',
    'Camping & Hiking': '⛺',
    'Water Sports': '🚣‍♂️',
    'Winter Sports': '⛷️',
  };

  return (
    <div className="flex flex-col min-h-screen ambient-bg">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-8 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Peer-To-Peer Gear Rentals</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Rent Premium Outdoor Gear <span className="gradient-text">Instantly.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Skip buying expensive equipment. Explore kayaks, bikes, tents, and skis from verified local owners with dynamic date pricing and instant Stripe checkout.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/gear"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white gradient-btn shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 group"
            >
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              <span>Explore Gear Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-200 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 hover:text-white transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>List Equipment as Provider</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
              <p className="text-2xl font-extrabold text-white gradient-text">100%</p>
              <p className="text-xs text-slate-400 mt-1">Stripe Payment Security</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
              <p className="text-2xl font-extrabold text-white gradient-text">500+</p>
              <p className="text-xs text-slate-400 mt-1">Verified Equipment Items</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
              <p className="text-2xl font-extrabold text-white gradient-text">4.9 ★</p>
              <p className="text-xs text-slate-400 mt-1">Customer Review Rating</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
              <p className="text-2xl font-extrabold text-white gradient-text">24/7</p>
              <p className="text-xs text-slate-400 mt-1">Provider Fulfillment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Categorized Directory
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Browse Equipment by Category
              </h2>
            </div>
            <Link
              href="/gear"
              className="mt-4 md:mt-0 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/gear?category=${encodeURIComponent(cat.name)}`}
                  className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {categoryIcons[cat.name] || '🎒'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {cat.description || 'Explore available rental gear in this category.'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-emerald-400 font-semibold pt-4 border-t border-slate-800/60">
                    <span>Browse Listings</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))
            ) : (
              ['Cycling & Biking', 'Camping & Hiking', 'Water Sports', 'Winter Sports'].map(
                (name, idx) => (
                  <Link
                    key={idx}
                    href={`/gear?category=${encodeURIComponent(name)}`}
                    className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
                        {categoryIcons[name] || '🏕️'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          High quality rental inventory available now.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-xs text-emerald-400 font-semibold pt-4 border-t border-slate-800/60">
                      <span>Explore Category</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                )
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Gear Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Top Rated Listings
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Featured Equipment Rentals
              </h2>
            </div>
            <Link
              href="/gear"
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center space-x-2"
            >
              <span>Explore All Equipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredGear.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredGear.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto space-y-4">
              <Dumbbell className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
              <h3 className="text-lg font-bold text-white">No Equipment Listed Yet</h3>
              <p className="text-xs text-slate-400">
                Be the first provider to list rental gear on GearUp!
              </p>
              <Link
                href="/register"
                className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn"
              >
                Become a Provider
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
