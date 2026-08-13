import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Dumbbell,
  Search,
  Calendar,
  CreditCard,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear } from '@/types';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import GearCard from '@/components/gear/GearCard';
import HeroSection from '@/components/home/HeroSection';
import AboutStatsSection from '@/components/home/AboutStatsSection';
import { SEEDED_GEAR_CATALOG } from '@/data/gearCatalog';

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
    const apiItems = res.data?.data || [];
    
    // Combine API items with seeded catalog to ensure exactly 6 items display
    const combined = [...apiItems];
    SEEDED_GEAR_CATALOG.forEach((seeded) => {
      if (!combined.some((item) => item.id === seeded.id || item.title === seeded.title)) {
        combined.push(seeded);
      }
    });

    return combined.slice(0, 6);
  } catch (error) {
    return SEEDED_GEAR_CATALOG.slice(0, 6);
  }
}

const TOP_BANGLADESH_BRANDS = [
  { name: 'Decathlon Bangladesh', logo: '⚽', tag: 'Global Outdoor Partner' },
  { name: 'The North Face', logo: '🏔️', tag: 'Wilderness Exploration' },
  { name: 'Columbia Sportswear', logo: '🧥', tag: 'All-Weather Apparel' },
  { name: 'Osprey Packs', logo: '🎒', tag: 'Expedition Backpacking' },
  { name: 'Petzl Climbing', logo: '🧗‍♂️', tag: 'Safety & Alpine Rigging' },
];

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

      {/* Featured Gear Showcase (Strictly 6 Cards & 3 Cards Side-by-Side on Desktop) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Top Rated Listings
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Featured Equipment Rentals (Top 6 Items)
              </h2>
            </div>
            <Link
              href="/gear"
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center space-x-2 shadow-xs group"
            >
              <span>Explore Full 31+ Catalog</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredGear.length > 0 ? (
            /* Desktop Grid: Strictly 3 Cards Side-by-Side (lg:grid-cols-3) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredGear.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-center max-w-lg mx-auto space-y-4">
              <Dumbbell className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Equipment Listed Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Be the first provider to list rental gear on GrabGear!
              </p>
              <Link
                href="/register"
                className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800"
              >
                Become a Provider
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* NEW SECTION 1: How GrabGear Works (4-Step Flow) */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How GrabGear Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Rent premium bikes, kayaks, tents, and climbing equipment effortlessly in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 space-y-4 relative group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Search className="w-4 h-4 text-emerald-500" />
                <span>Browse & Filter</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore 30+ verified equipment items categorized by activity, district location, and price.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 space-y-4 relative group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Pick Rental Dates</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Select your start and return dates. Dynamic pricing calculates first night & discount rates.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 space-y-4 relative group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>Stripe Checkout</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete instant PCI-compliant payment. Funds are held in escrow until pickup confirmation.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 space-y-4 relative group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Pick Up & Enjoy</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Collect gear from local verified providers or resort pickup spots. Enjoy your wilderness adventure!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About GrabGear Rental & Safety Guarantee — Client Component with live data */}
      <AboutStatsSection />

      {/* NEW SECTION 3: Top 5 Gear Brands in Bangladesh */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Trusted Industry Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Top 5 Outdoor Gear Companies in Bangladesh
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TOP_BANGLADESH_BRANDS.map((brand, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-center space-y-2 hover:border-emerald-500 transition-all group"
              >
                <div className="text-3xl group-hover:scale-110 transition-transform">{brand.logo}</div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {brand.name}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {brand.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
