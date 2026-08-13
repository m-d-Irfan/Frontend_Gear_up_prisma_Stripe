'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp, Grid } from 'lucide-react';
import { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[];
}

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const defaultCategoryNames = [
    'Camping & Hiking',
    'Cycling & Biking',
    'Water Sports',
    'Winter Sports',
  ];

  const categoryIcons: Record<string, string> = {
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

  const categoryDescriptions: Record<string, string> = {
    'Camping & Hiking': 'Tents, sleeping bags, stoves, and backpacks',
    'Cycling & Biking': 'Mountain bikes, road bikes, and helmets',
    'Water Sports': 'Kayaks, paddleboards, and life jackets',
    'Winter Sports': 'Skis, snowboards, and thermal gear',
  };

  // Build combined category list
  const allCategories = [...categories];

  // Ensure default 4 exist if not returned from API
  defaultCategoryNames.forEach((defName) => {
    if (!allCategories.some((c) => c.name.toLowerCase() === defName.toLowerCase())) {
      allCategories.push({
        id: `def-${defName}`,
        name: defName,
        description: categoryDescriptions[defName] || 'High quality rental inventory available now.',
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
    return '';
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Categorized Directory
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Browse Equipment by Category
            </h2>
          </div>
          <Link
            href="/gear"
            className="mt-4 md:mt-0 text-xs font-bold text-slate-900 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center space-x-1 group"
          >
            <span>Explore All Equipment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* First 4 Default Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultFour.map((cat) => {
            const catImg = getCategoryImage(cat);
            return (
              <Link
                key={cat.id}
                href={`/gear?category=${encodeURIComponent(cat.name)}`}
                className="bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {catImg ? (
                    <div className="h-36 sm:h-40 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={catImg}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
                      {categoryIcons[cat.name] || '🎒'}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {cat.description || categoryDescriptions[cat.name] || 'Explore available rental gear in this category.'}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-slate-900 dark:text-white font-bold pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span>Browse Listings</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Collapsible Additional Categories Grid */}
        {remainingCategories.length > 0 && (
          <div
            className={`transition-all duration-500 overflow-hidden ${
              isExpanded ? 'max-h-[2000px] opacity-100 pt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {remainingCategories.map((cat) => {
                const catImg = getCategoryImage(cat);
                return (
                  <Link
                    key={cat.id}
                    href={`/gear?category=${encodeURIComponent(cat.name)}`}
                    className="bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {catImg ? (
                        <div className="h-36 sm:h-40 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={catImg}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
                          {categoryIcons[cat.name] || '🎒'}
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {cat.description || categoryDescriptions[cat.name] || 'Explore available rental gear in this category.'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-xs text-slate-900 dark:text-white font-bold pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span>Browse Listings</span>
                      <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
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
