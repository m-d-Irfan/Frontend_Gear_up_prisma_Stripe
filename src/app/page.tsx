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
import HeroSection from '@/components/home/HeroSection';

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

  return (
    <div className="flex flex-col min-h-screen ambient-bg">
      {/* Interactive 65vh Hero Section with Image Slider & PC Upload Support */}
      <HeroSection />

      {/* Categories Showcase Section with Smooth Scroll Anchor */}
      <div id="categories-section" className="scroll-mt-6">
        <CategoryShowcase categories={categories} />
      </div>

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
