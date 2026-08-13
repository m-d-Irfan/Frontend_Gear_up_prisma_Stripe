'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp, Grid } from 'lucide-react';
import { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[];
}

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  'Camping & Hiking': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
  'Cycling & Biking': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
  'Water Sports': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Winter Sports': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80',
  'Fitness & Gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'Photography & Drone': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  'Climbing & Mountaineering': 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
  'Diving & Snorkeling': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Trekking & Tactical': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
};

const CATEGORY_ICONS: Record<string, string> = {
  'Camping & Hiking': '⛺',
  'Cycling & Biking': '🚴‍♂️',
  'Water Sports': '🚣‍♂️',
  'Winter Sports': '⛷️',
  'Fitness & Gym': '🏋️‍♂️',
  'Photography & Drone': '📷',
  'Climbing & Mountaineering': '🧗‍♂️',
  'Diving & Snorkeling': '🤿',
  'Trekking & Tactical': '🥾',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Camping & Hiking': 'Tents, sleeping bags, stoves, and backpacks',
  'Cycling & Biking': 'Mountain bikes, road bikes, and helmets',
  'Water Sports': 'Kayaks, paddleboards, and life jackets',
  'Winter Sports': 'Skis, snowboards, and thermal gear',
};

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const defaultCategoryNames = [
    'Camping & Hiking',
    'Cycling & Biking',
    'Water Sports',
    'Winter Sports',
  ];

  // Build combined category list
  const allCategories = [...categories];

  // Ensure default 4 exist if not returned from API
  defaultCategoryNames.forEach((defName) => {
    if (!allCategories.some((c) => c.name.toLowerCase() === defName.toLowerCase())) {
      allCategories.push({
        id: `def-${defName}`,
        name: defName,
        description: CATEGORY_DESCRIPTIONS[defName] || 'High quality rental inventory available now.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });

  // Re-order so default 4 appear first
  const sortedCategories: Category[] = [];
  defaultCategoryNames.forEach((defName) => {
    const match = allCategories.find((c) => c.name.toLowerCase() === defName.toLowerCase());
    if (match) sortedCategories.push(match);
  });
  allCategories.forEach((c) => {
    if (!sortedCategories.some((sc) => sc.id === c.id)) {
      sortedCategories.push(c);
    }
  });

  const defaultFour = sortedCategories.slice(0, 4);
  const remainingCategories = sortedCategories.slice(4);

  const getCategoryImage = (cat: Category) => {
    if (cat.image || cat.imageUrl) return cat.image || cat.imageUrl;
    if (typeof window !== 'undefined') {
      try {
        const stored =
          localStorage.getItem(`category_image_${cat.id}`) ||
          localStorage.getItem(`category_image_${cat.name.toLowerCase()}`);
        if (stored) return stored;
      } catch {}
    }
    // Fallback based on category name matching
    for (const [key, url] of Object.entries(CATEGORY_DEFAULT_IMAGES)) {
      if (cat.name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cat.name.toLowerCase())) {
        return url;
      }
    }
    return CATEGORY_DEFAULT_IMAGES['Camping & Hiking'];
  };

  const renderCategoryCard = (cat: Category) => {
    const catImg = getCategoryImage(cat);
    const icon = CATEGORY_ICONS[cat.name] || '🏕️';
    const desc = cat.description || CATEGORY_DESCRIPTIONS[cat.name] || 'Explore available rental gear in this category.';

    return (
      <Link
        key={cat.id}
        href={`/gear?category=${encodeURIComponent(cat.name)}`}
        className="bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
      >
        {/* Full Card Top Image Container */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={catImg}
            alt={cat.name}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = CATEGORY_DEFAULT_IMAGES['Camping & Hiking'];
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
          />
          {/* Gradient Overlay for photo depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
          
          {/* Emoji Badge on top-right */}
          <span className="absolute top-3.5 right-3.5 text-base p-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/20 shadow-md">
            {icon}
          </span>
        </div>

        {/* Card Content & Action Button */}
        <div className="p-6 flex flex-col justify-between flex-1 space-y-5">
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {desc}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <span>Browse Listings</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Categorized Directory
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Browse Equipment by Category
            </h2>
          </div>
          <Link
            href="/gear"
            className="text-xs font-bold text-slate-900 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center space-x-1 group w-fit"
          >
            <span>Explore All Equipment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* First 4 Default Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultFour.map((cat) => renderCategoryCard(cat))}
        </div>

        {/* Collapsible Additional Categories Grid */}
        {remainingCategories.length > 0 && (
          <div
            className={`transition-all duration-500 overflow-hidden ${
              isExpanded ? 'max-h-[2000px] opacity-100 pt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {remainingCategories.map((cat) => renderCategoryCard(cat))}
            </div>
          </div>
        )}

        {/* Collapsible Toggle Button Positioned Under Default 4 Categories */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
          >
            <Grid className="w-4 h-4 text-emerald-400 dark:text-slate-950" />
            <span>{isExpanded ? 'Show Less Categories' : 'View Full Categories'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-300 dark:text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-300 dark:text-slate-950 group-hover:translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

