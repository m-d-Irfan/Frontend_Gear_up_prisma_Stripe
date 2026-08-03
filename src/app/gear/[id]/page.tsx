'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Star,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Calendar as CalendarIcon,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  PackageCheck,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Gear } from '@/types';
import { Badge } from '@/components/ui/Badge';
import RentalCalculator from '@/components/gear/RentalCalculator';

const DEFAULT_GEAR_IMAGE =
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop';

export default function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const gearId = resolvedParams.id;

  const [gear, setGear] = useState<Gear | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imgSrc, setImgSrc] = useState<string>('');

  // Fetch Gear Details
  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get<ApiResponse<Gear>>(`/gear/${gearId}`)
      .then((res) => {
        if (res.data?.data) {
          setGear(res.data.data);
          setImgSrc(res.data.data.imageUrl || DEFAULT_GEAR_IMAGE);
        }
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
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
        <p className="text-sm text-slate-400">Loading equipment specs & details...</p>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-200">Equipment Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested rental item does not exist or was removed.
        </p>
        <Link
          href="/gear"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const avgRating =
    gear.reviews && gear.reviews.length > 0
      ? (
          gear.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
          gear.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/gear"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Equipment Directory</span>
        </Link>
      </div>

      {/* Main Grid: Gallery & Rental Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Image & Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image Gallery */}
          <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden glass-card border border-slate-800">
            <Image
              src={imgSrc}
              alt={gear.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              onError={() => setImgSrc(DEFAULT_GEAR_IMAGE)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Badge
                variant={gear.isAvailable && gear.stock > 0 ? 'AVAILABLE' : 'UNAVAILABLE'}
                className="shadow-lg backdrop-blur-md px-3 py-1 text-xs"
              >
                {gear.isAvailable && gear.stock > 0
                  ? `Available (${gear.stock} in stock)`
                  : 'Currently Unavailable'}
              </Badge>

              {gear.category?.name && (
                <span className="inline-flex items-center space-x-1 text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full shadow-lg">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{gear.category.name}</span>
                </span>
              )}
            </div>
          </div>

          {/* Title & Location Header */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{gear.location || 'San Francisco, CA'}</span>
              </span>
              {gear.brand && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-slate-300">Brand: {gear.brand}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
              {gear.title}
            </h1>

            {avgRating && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(Number(avgRating))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-200">{avgRating}</span>
                <span className="text-xs text-slate-400">
                  ({gear.reviews?.length} customer review{gear.reviews?.length === 1 ? '' : 's'})
                </span>
              </div>
            )}
          </div>

          {/* Specifications & Description */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
              Equipment Specifications & Details
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {gear.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] text-slate-400">Daily Rate</p>
                <p className="text-base font-bold text-emerald-400">${gear.pricePerDay}/day</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] text-slate-400">Inventory Stock</p>
                <p className="text-base font-bold text-slate-200">{gear.stock} units</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] text-slate-400">Category</p>
                <p className="text-base font-bold text-slate-200">
                  {gear.category?.name || 'General Gear'}
                </p>
              </div>
            </div>
          </div>

          {/* Verified Provider Info */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                {gear.provider?.name ? gear.provider.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-slate-100">
                    {gear.provider?.name || 'Verified Shop Provider'}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400">{gear.provider?.email || 'Verified Partner'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-slate-300 font-semibold">
                Equipment Owner
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Rental Date Calculator Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <RentalCalculator gear={gear} />
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Renter Reviews & Feedback</span>
          </h3>
          {avgRating && (
            <span className="text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
              ★ {avgRating} out of 5.0
            </span>
          )}
        </div>

        {gear.reviews && gear.reviews.length > 0 ? (
          <div className="space-y-4">
            {gear.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">
                      {rev.customer?.name || 'Verified Renter'}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-2 text-slate-400">
            <p className="text-xs">No reviews submitted for this gear yet.</p>
            <p className="text-[11px] text-slate-500">
              Be the first customer to rent and leave feedback!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
