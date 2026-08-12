'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Tag, ArrowRight, Star, Edit3, Trash2 } from 'lucide-react';
import { Gear } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';

interface GearCardProps {
  gear: Gear;
  onEdit?: (gear: Gear) => void;
  onDelete?: (gear: Gear) => void;
  isProvider?: boolean;
}

export default function GearCard({ gear, onEdit, onDelete, isProvider: isProviderProp }: GearCardProps) {
  const { user } = useAuthStore();
  const isProvider = isProviderProp ?? (user?.role === 'PROVIDER' || Boolean(onEdit));
  const fallbackImage =
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop';
  const displayImage = gear.image || gear.imageUrl || fallbackImage;

  let stock = gear.stock ?? 0;
  if (typeof window !== 'undefined') {
    const cachedStock = localStorage.getItem(`gear_stock_${gear.id}`);
    if (cachedStock !== null) {
      stock = Math.max(0, Number(cachedStock));
    }
  }
  const isAvailable = Boolean(gear.isAvailable) && stock > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Image Container with Dynamic Stock Badge */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {displayImage.startsWith('data:') ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={displayImage}
            alt={gear.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Image
            src={displayImage}
            alt={gear.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Category Pill */}
        {gear.category?.name && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
              {gear.category.name}
            </span>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}>
            {isAvailable ? `${stock} Available` : 'Out of Stock'}
          </Badge>
        </div>

        {/* Action Buttons (Edit & Delete) */}
        {(onEdit || onDelete) && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center space-x-1.5 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(gear);
                }}
                className="p-1.5 text-slate-200 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Edit Equipment"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(gear);
                }}
                className="p-1.5 text-slate-200 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Delete Listing"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Price Tag Overlay (First Night & Additional Night in BDT) */}
        <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md dark:bg-slate-950/95 text-white p-2.5 rounded-2xl shadow-xl border border-white/10 space-y-0.5">
          <div className="flex items-baseline space-x-1">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">From</span>
            <span className="text-sm font-black text-emerald-400">৳{Number(gear.pricePerDay)}</span>
            <span className="text-[10px] text-slate-300">first night</span>
          </div>
          <div className="text-[10px] font-semibold text-slate-300 flex items-center space-x-1">
            <span className="text-white font-bold">৳{gear.additionalDayPrice ?? Math.round(gear.pricePerDay * 0.6)}</span>
            <span>/ additional night</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {gear.brand || 'GearUp Verified'}
            </span>
            {gear.location && (
              <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[100px]">{gear.location}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {gear.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {gear.description || 'Premium quality rental equipment thoroughly inspected and prepped for outdoor adventure.'}
          </p>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9 (Verified)</span>
          </div>

          {user?.role === 'PROVIDER' ? (
            gear.providerId === user?.id ||
            gear.providerId === user?.email ||
            (gear.provider?.email && gear.provider.email.toLowerCase() === user?.email?.toLowerCase()) ||
            isProviderProp ? (
              <Link
                href={`/gear/${gear.slug || gear.id}`}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/btn"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Edit Item</span>
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-lg cursor-not-allowed border border-slate-200 dark:border-slate-700"
                title="Provider accounts cannot rent equipment"
              >
                <span>Rent (Providers N/A)</span>
              </button>
            )
          ) : (
            <Link
              href={`/gear/${gear.slug || gear.id}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/btn"
            >
              <span>Rent Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

