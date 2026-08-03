import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Tag, ArrowRight, Shield, Star, CheckCircle2 } from 'lucide-react';
import { Gear } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface GearCardProps {
  gear: Gear;
}

export default function GearCard({ gear }: GearCardProps) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-800/80">
      {/* Image Container with Dynamic Stock Badge */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <Image
          src={gear.imageUrl || fallbackImage}
          alt={gear.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Ambient Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

        {/* Category Pill */}
        {gear.category?.name && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-lg">
              {gear.category.name}
            </span>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={gear.isAvailable ? 'available' : 'rented'}>
            {gear.isAvailable ? `${gear.stock} Available` : 'Out of Stock'}
          </Badge>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-baseline space-x-1 shadow-lg">
          <span className="text-xs text-slate-400">$</span>
          <span className="text-lg font-extrabold text-white tracking-tight">
            {Number(gear.pricePerDay).toFixed(2)}
          </span>
          <span className="text-[10px] font-medium text-slate-400">/ day</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {gear.brand || 'GearUp Verified'}
            </span>
            {gear.location && (
              <span className="flex items-center space-x-1 text-slate-400">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[100px]">{gear.location}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {gear.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {gear.description || 'Premium quality rental equipment thoroughly inspected and prepped for outdoor adventure.'}
          </p>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 (Verified)</span>
          </div>

          <Link
            href={`/gear/${gear.id}`}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group/btn"
          >
            <span>Rent Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
