import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Tag, ArrowRight, Star } from 'lucide-react';
import { Gear } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface GearCardProps {
  gear: Gear;
}

export default function GearCard({ gear }: GearCardProps) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop';

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Image Container with Dynamic Stock Badge */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <Image
          src={gear.imageUrl || fallbackImage}
          alt={gear.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category Pill */}
        {gear.category?.name && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 border border-slate-200 shadow-sm backdrop-blur-md">
              {gear.category.name}
            </span>
          </div>
        )}

        {/* Stock Badge - FIXED TYPE ERROR HERE */}
        <div className="absolute top-3 right-3">
          <Badge variant={gear.isAvailable && gear.stock > 0 ? 'AVAILABLE' : 'UNAVAILABLE'}>
            {gear.isAvailable && gear.stock > 0 ? `${gear.stock} Available` : 'Out of Stock'}
          </Badge>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-baseline space-x-1 shadow-md">
          <span className="text-xs text-slate-300">$</span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            {Number(gear.pricePerDay).toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-300">/ day</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-600" />
              {gear.brand || 'GearUp Verified'}
            </span>
            {gear.location && (
              <span className="flex items-center space-x-1 text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[100px]">{gear.location}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {gear.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {gear.description || 'Premium quality rental equipment thoroughly inspected and prepped for outdoor adventure.'}
          </p>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-amber-600 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9 (Verified)</span>
          </div>

          <Link
            href={`/gear/${gear.id}`}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 hover:text-emerald-700 group/btn"
          >
            <span>Rent Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
