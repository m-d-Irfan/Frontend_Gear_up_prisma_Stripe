'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Tag,
  ArrowLeft,
  ShieldCheck,
  Star,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
  MessageSquare,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Gear } from '@/types';
import { Badge } from '@/components/ui/Badge';
import RentalCalculator from '@/components/gear/RentalCalculator';

const DEFAULT_GEAR_IMAGE =
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&auto=format&fit=crop';

export default function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const gearId = resolvedParams.id;

  const [gear, setGear] = useState<Gear | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!gearId) return;

    setIsLoading(true);
    apiClient
      .get<ApiResponse<Gear>>(`/gear/${gearId}`)
      .then((res) => {
        setGear(res.data?.data || null);
      })
      .catch(() => {
        setGear(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [gearId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Loading gear details...</p>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-xs">
        <h2 className="text-xl font-black text-slate-900">Equipment Listing Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested equipment listing could not be found or may have been removed.
        </p>
        <Link
          href="/gear"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gear Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/gear"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Equipment Directory</span>
        </Link>

        {gear.category?.name && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {gear.category.name}
          </span>
        )}
      </div>

      {/* Grid Layout: Main Specs & Image vs Rental Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image Gallery */}
          <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
            <Image
              src={gear.imageUrl || DEFAULT_GEAR_IMAGE}
              alt={gear.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 66vw"
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Badge
                variant={gear.isAvailable && gear.stock > 0 ? 'AVAILABLE' : 'UNAVAILABLE'}
                className="shadow-sm px-3 py-1 text-xs"
              >
                {gear.isAvailable && gear.stock > 0
                  ? `Available (${gear.stock} in stock)`
                  : 'Currently Unavailable'}
              </Badge>
            </div>
          </div>

          {/* Title & Brand Specs */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
                {gear.brand && (
                  <span className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>{gear.brand}</span>
                  </span>
                )}
                {gear.location && (
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{gear.location}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>4.9 (Verified Reviews)</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {gear.title}
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Equipment Description & Specifications
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {gear.description ||
                  'No detailed description provided. This equipment item is maintained and verified by the rental provider.'}
              </p>
            </div>

            {/* Provider Verification Card */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {gear.provider?.name ? gear.provider.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Listed by {gear.provider?.name || 'Verified Provider'}
                  </p>
                  <p className="text-[10px] text-slate-500">Verified Equipment Vendor</p>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Listing</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Rental Calculator & Stripe Checkout Column */}
        <div className="space-y-6">
          <RentalCalculator gear={gear} />
        </div>
      </div>
    </div>
  );
}
