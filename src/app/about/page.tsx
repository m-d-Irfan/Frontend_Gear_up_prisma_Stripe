'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Users, Award, HeartHandshake, Dumbbell, ArrowRight, MapPin } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Gear, LocationItem, RentalOrder } from '@/types';

// Custom Count-Up Animation Hook
function useCountUp(endValue: number, duration: number = 1800) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (endValue <= 0) return;
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Smooth ease-out expo curve
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeOut * endValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [endValue, duration]);

  return count;
}

export default function AboutPage() {
  const [itemsCount, setItemsCount] = useState<number>(50);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [districtsCount, setDistrictsCount] = useState<number>(8);

  useEffect(() => {
    // 1. Fetch Verified Equipment Count
    apiClient
      .get<ApiResponse<Gear[]>>('/gear')
      .then((res) => {
        const apiList = res.data?.data || [];
        let deletedIds: string[] = [];
        if (typeof window !== 'undefined') {
          try {
            deletedIds = JSON.parse(localStorage.getItem('deleted_gear_ids') || '[]');
          } catch {}
        }
        const activeApiList = apiList.filter((g) => !deletedIds.includes(g.id));
        setItemsCount(Math.max(50, activeApiList.length));
      })
      .catch(() => {
        setItemsCount(50);
      });

    // 2. Fetch Completed Orders Count
    apiClient
      .get<ApiResponse<RentalOrder[]>>('/orders')
      .then((res) => {
        const apiOrders = res.data?.data || [];
        setOrdersCount(apiOrders.length);
      })
      .catch(() => {
        setOrdersCount(0);
      });

    // 3. Fetch Admin Districts Count
    apiClient
      .get<ApiResponse<LocationItem[]>>('/locations')
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setDistrictsCount(res.data.data.length);
        } else {
          loadStoredDistricts();
        }
      })
      .catch(() => {
        loadStoredDistricts();
      });

    function loadStoredDistricts() {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('platform_locations');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setDistrictsCount(parsed.length);
              return;
            }
          }
        } catch {}
      }
      setDistrictsCount(8); // Default admin districts fallback
    }
  }, []);

  // Compute Target Display Thresholds
  let itemsTarget = 50;
  if (itemsCount < 100) {
    itemsTarget = Math.max(50, Math.floor(itemsCount / 10) * 10);
  } else {
    itemsTarget = Math.floor(itemsCount / 100) * 100;
  }

  const totalRentalsRaw = 200 + ordersCount;
  const rentalsTarget = Math.max(200, Math.floor(totalRentalsRaw / 100) * 100);

  const districtsTarget = Math.max(1, districtsCount);
  const satisfactionTarget = 95.5;

  // Animated Count Values
  const animatedItems = useCountUp(itemsTarget);
  const animatedRentals = useCountUp(rentalsTarget);
  const animatedDistricts = useCountUp(districtsTarget);
  const animatedSatisfaction = useCountUp(satisfactionTarget);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-32">
      {/* Hero Section */}
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto space-y-6 animate-fade-in-up duration-1000">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-bold shadow-sm">
          <Dumbbell className="w-5 h-5 transform -rotate-45 text-emerald-500 animate-pulse" />
          <span>About GrabGear Platform</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Empowering Outdoor Adventure Through Shared Gear
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          GrabGear connects outdoor enthusiasts with verified equipment providers across Bangladesh. Rent top-tier mountain bikes, camping tents, kayaking gear, and sports equipment without high ownership costs.
        </p>
      </div>

      {/* Dynamic Animated Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 min-h-[40vh] items-center">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white font-mono group-hover:scale-110 transition-transform duration-500">
            {Math.floor(animatedItems)}+
          </p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Verified Items</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-600 dark:text-emerald-400 font-mono group-hover:scale-110 transition-transform duration-500">
            {Math.floor(animatedRentals)}+
          </p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Rentals</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white font-mono group-hover:scale-110 transition-transform duration-500">
            {Math.floor(animatedDistricts)}
          </p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Districts</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-600 dark:text-emerald-400 font-mono group-hover:scale-110 transition-transform duration-500">
            {animatedSatisfaction.toFixed(1)}%
          </p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Satisfaction</p>
        </div>
      </div>

      {/* Core Values */}
      <div className="min-h-[70vh] flex flex-col justify-center space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">Our Mission & Core Values</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 uppercase tracking-widest">Why thousands choose GrabGear</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Verified Equipment Only</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Every item listed on GrabGear undergoes provider verification and safety inspection before being offered for rental.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Community & Sustainability</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              By sharing quality outdoor gear, we reduce manufacturing waste and enable everyone to enjoy nature affordably.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Seamless Stripe Payments</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Secure, instant checkout with real-time rental calculations and automated booking protection.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-[3rem] p-12 sm:p-20 text-center space-y-8 shadow-2xl relative overflow-hidden group">
          {/* Decorative Backgrounds */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-colors duration-1000" />
          
          <h2 className="text-4xl sm:text-5xl font-black relative z-10">Ready to Start Your Adventure?</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Explore our wide collection of outdoor gear or list your own equipment to earn income today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 relative z-10 pt-4">
            <Link
              href="/gear"
              className="px-8 py-4 rounded-2xl text-sm font-black text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-xl hover:shadow-emerald-400/30 hover:-translate-y-1 inline-flex items-center space-x-3 transition-all cursor-pointer uppercase tracking-wider"
            >
              <span>Explore Catalog</span>
              <Compass className="w-5 h-5" />
            </Link>
            <Link
              href="/register?type=provider"
              className="px-8 py-4 rounded-2xl text-sm font-black text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md hover:-translate-y-1 inline-flex items-center space-x-3 transition-all cursor-pointer uppercase tracking-wider"
            >
              <span>Become a Provider</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
