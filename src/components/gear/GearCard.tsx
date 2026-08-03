'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Tag, Star } from 'lucide-react';
import { Gear } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface GearCardProps {
  gear: Gear;
}

const DEFAULT_GEAR_IMAGE =
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop';

export default function GearCard({ gear }: GearCardProps) {
  const [imgSrc, setImgSrc] = useState(gear.imageUrl || DEFAULT_GEAR_IMAGE);

  // Compute average rating if reviews exist
  const avgRating =
    gear.reviews && gear.reviews.length > 0
      ? (
          gear.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
          gear.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="group glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 flex flex-col h-full hover:shadow-xl hover:shadow-emerald-950/30">
      {/* Gear Image Container */}
      <div className="relative w-full h-52 bg-slate-900 overflow-hidden">
        <Image
          src={imgSrc}
          alt={gear.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(DEFAULT_GEAR_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge
            variant={gear.isAvailable && gear.stock > 0 ? 'AVAILABLE' : 'UNAVAILABLE'}
            className="shadow-md backdrop-blur-md"
          >
            {gear.isAvailable && gear.stock > 0
              ? `In Stock (${gear.stock})`
              : 'Out of Stock'}
          </Badge>

          {gear.category?.name && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-md">
              <Tag className="w-3 h-3" />
              <span>{gear.category.name}</span>
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
            <span className="text-lg font-bold text-white">${gear.pricePerDay}</span>
            <span className="text-xs text-slate-400 font-medium"> / day</span>
          </div>
        </div>

        {avgRating && (
          <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 flex items-center space-x-1 text-xs text-amber-400 font-semibold shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{avgRating}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{gear.location || 'Location upon request'}</span>
            {gear.brand && (
              <>
                <span>•</span>
                <span className="truncate font-medium text-slate-300">{gear.brand}</span>
              </>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {gear.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {gear.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Provider: <strong className="text-slate-200">{gear.provider?.name || 'Verified Shop'}</strong>
          </span>

          <Link
            href={`/gear/${gear.id}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:translate-x-0.5 transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
