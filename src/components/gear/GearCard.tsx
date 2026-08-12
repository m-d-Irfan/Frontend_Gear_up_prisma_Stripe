import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Tag, ArrowRight, Star, Edit3, Trash2 } from 'lucide-react';
import { Gear } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface GearCardProps {
  gear: Gear;
  onEdit?: (gear: Gear) => void;
  onDelete?: (gear: Gear) => void;
}

export default function GearCard({ gear, onEdit, onDelete }: GearCardProps) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop';
  const displayImage = gear.image || gear.imageUrl || fallbackImage;

  const stock = gear.stock ?? 0;
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

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900 dark:bg-emerald-600 text-white px-3 py-1.5 rounded-xl flex items-baseline space-x-1 shadow-md">
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

          <Link
            href={`/gear/${gear.slug || gear.id}`}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/btn"
          >
            <span>Rent Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

