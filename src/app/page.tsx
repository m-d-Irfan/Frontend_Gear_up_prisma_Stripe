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
  MapPin,
  DollarSign,
  ShieldCheck,
  PlusCircle,
  Users
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

async function getGearData(): Promise<{ featured: Gear[]; totalCount: number }> {
  try {
    const res = await apiClient.get<ApiResponse<Gear[]>>('/gear');
    const apiItems = res.data?.data || [];
    
    // Combine API items with seeded catalog
    const combined = [...apiItems];
    SEEDED_GEAR_CATALOG.forEach((seeded) => {
      if (!combined.some((item) => item.id === seeded.id || item.title === seeded.title)) {
        combined.push(seeded);
      }
    });

    return {
      featured: combined.slice(0, 6),
      totalCount: combined.length
    };
  } catch (error) {
    return {
      featured: SEEDED_GEAR_CATALOG.slice(0, 6),
      totalCount: SEEDED_GEAR_CATALOG.length
    };
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
  const { featured: featuredGear, totalCount: gearCount } = await getGearData();

  // Dynamic catalog label: 30+ if >= 30, 40+ if >= 40, etc.
  const catalogCountLabel = gearCount >= 10 
    ? `${Math.floor(gearCount / 10) * 10}+` 
    : gearCount > 0 
      ? `${gearCount}+` 
      : '';

  return (
    <div className="flex flex-col min-h-screen ambient-bg">
      {/* Interactive Hero Section */}
      <HeroSection />

      {/* Categories Showcase Section with Smooth Scroll Anchor */}
      <div id="categories-section" className="scroll-mt-6 min-h-[75vh] flex flex-col justify-center py-16 lg:py-24">
        <CategoryShowcase categories={categories} />
      </div>

      {/* Featured Gear Showcase Section (Minimum ~80% Viewport Height Presence) */}
      <section className="py-20 lg:py-28 min-h-[80vh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Top Rated Listings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Featured Equipment Rentals
              </h2>
            </div>
            <Link
              href="/gear"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center space-x-2 shadow-xs group w-fit"
            >
              <span>Explore Full {catalogCountLabel ? `${catalogCountLabel} ` : ''}Catalog</span>
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
                className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 transition-all"
              >
                Become a Provider
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How GrabGear Works (4-Step Flow Section) (Minimum ~80% Viewport Height Presence) */}
      <section className="py-20 lg:py-28 min-h-[80vh] flex flex-col justify-center bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 w-full">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
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
                Explore {catalogCountLabel ? `${catalogCountLabel} ` : ''}verified equipment items categorized by activity, district location, and price.
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

      {/* About GrabGear Rental & Safety Guarantee — Client Component with live data (80%+ Viewport Height) */}
      <div className="min-h-[80vh] flex flex-col justify-center py-16 lg:py-24">
        <AboutStatsSection />
      </div>

      {/* Top 5 Gear Brands in Bangladesh (Spacious 70%+ Viewport Height) */}
      <section className="py-20 lg:py-24 min-h-[70vh] flex flex-col justify-center bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 w-full">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Trusted Industry Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Top 5 Outdoor Gear Companies in Bangladesh
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Our gear providers carry authentic equipment backed by Bangladesh&apos;s leading outdoor and sporting brands.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {TOP_BANGLADESH_BRANDS.map((brand, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 text-center space-y-3 hover:border-emerald-500 hover:-translate-y-1 transition-all group shadow-xs"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">{brand.logo}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {brand.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  {brand.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Become a Provider / List Your Gear (80%+ Viewport Height Presence) */}
      <section className="py-20 lg:py-28 min-h-[80vh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Heading & Value Prop */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Monetize Your Outdoor Gear</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  Have Sports Gear Sitting Idle? <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    Earn by Becoming a Provider.
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Turn your tents, kayaks, bikes, and climbing equipment into regular income. GrabGear provides complete Stripe escrow protection, rental agreement insurance, and direct access to thousands of verified local adventurers.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/register"
                    className="px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-xl hover:shadow-emerald-400/20 flex items-center space-x-2 cursor-pointer uppercase tracking-wider group"
                  >
                    <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    <span>Register as Provider</span>
                  </Link>

                  <Link
                    href="/about"
                    className="px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Learn How It Works</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </Link>
                </div>
              </div>

              {/* Right Column: 3 Benefit Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center space-x-3 text-emerald-400">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-bold text-white">100% Escrow Security</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Set your custom daily rates & security deposits. Funds are held safely in escrow before gear handover.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center space-x-3 text-emerald-400">
                    <DollarSign className="w-5 h-5 flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-bold text-white">Zero Upfront Listing Fees</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    List as many equipment items as you like for free. Keep maximum earnings with automated payouts.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center space-x-3 text-emerald-400">
                    <Users className="w-5 h-5 flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-bold text-white">Verified Local Renters</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Rent only to verified users across 64 Bangladesh districts with complete identity checks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

