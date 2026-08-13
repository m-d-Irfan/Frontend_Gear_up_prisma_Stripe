'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Award, Users } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

// Count-up animation hook (same pattern as About page)
function useCountUp(endValue: number, duration: number = 1800) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (endValue <= 0) return;
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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

export default function AboutStatsSection() {
  const { stats } = useAppData();
  
  const districtsTarget = Math.max(1, stats.districtsCount);
  const animatedDistricts = useCountUp(districtsTarget);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 dark:border-slate-700 shadow-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bangladesh Verified Rental Escrow Protection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              About GrabGear Rental Network
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              GrabGear connects outdoor enthusiasts across Dhaka, Chittagong, Cox&apos;s Bazar, and Sylhet with verified equipment owners. Avoid paying full retail prices for gear you only use a few times a year.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">Stripe Escrow Guarantee</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-white font-mono">
                  {Math.floor(animatedDistricts)}
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">Service Locations</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
                <div className="text-2xl font-black text-emerald-400">24/7</div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">Customer Support</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 space-y-3">
              <div className="flex items-center space-x-3 text-emerald-400">
                <Award className="w-6 h-6" />
                <h3 className="text-base font-bold text-white">Gear Inspection Standard</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Every listed helmet, kayak, boot pair, and life jacket undergoes mandatory provider maintenance checks before release.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 space-y-3">
              <div className="flex items-center space-x-3 text-emerald-400">
                <Users className="w-6 h-6" />
                <h3 className="text-base font-bold text-white">24/7 Hotline Support</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Have questions during your rental? Reach our dedicated support team via WhatsApp & Hotline at <span className="text-emerald-400 font-bold">+880 1611-836864</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
