import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Dumbbell 
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear } from '@/types';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import GearCard from '@/components/gear/GearCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-900 text-xs font-bold mb-8 shadow-xs">
            <span>Next-Gen Peer-To-Peer Gear Rentals</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            Rent Premium Outdoor Gear <span className="text-emerald-600">Instantly.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Skip buying expensive equipment. Explore kayaks, bikes, tents, and skis from verified local owners with dynamic date pricing and instant Stripe checkout.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/gear"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md flex items-center justify-center space-x-2 group transition-all"
            >
              <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform" />
              <span>Explore Gear Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-xs flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>List Equipment as Provider</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Stripe Payment Security</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-2xl font-black text-slate-900">500+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Verified Gear Items</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-2xl font-black text-emerald-600">4.9 ★</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Customer Rating</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-2xl font-black text-slate-900">24/7</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Provider Fulfillment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <CategoryShowcase categories={categories} />

      {/* Featured Gear Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Top Rated Listings
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                Featured Equipment Rentals
              </h2>
            </div>
            <Link
              href="/gear"
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center space-x-2 shadow-xs"
            >
              <span>Explore All Equipment</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>

          {featuredGear.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredGear.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xs text-center max-w-lg mx-auto space-y-4">
              <Dumbbell className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Equipment Listed Yet</h3>
              <p className="text-xs text-slate-500">
                Be the first provider to list rental gear on GearUp!
              </p>
              <Link
                href="/register"
                className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
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
