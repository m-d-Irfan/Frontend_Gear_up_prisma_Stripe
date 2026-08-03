'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  RefreshCw,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear } from '@/types';
import GearCard from '@/components/gear/GearCard';
import { GearGridSkeleton } from '@/components/ui/LoadingSkeleton';

function GearCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    Number(searchParams.get('maxPrice')) || 500
  );
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);

  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [gearList, setGearList] = useState<Gear[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Fetch Categories for Sidebar
  useEffect(() => {
    apiClient
      .get<ApiResponse<Category[]>>('/categories')
      .then((res) => {
        if (res.data?.data) {
          setCategories(res.data.data);
        }
      })
      .catch(() => {
        // Fallback default categories
        setCategories([
          { id: 'cat-1', name: 'Camping & Hiking' },
          { id: 'cat-2', name: 'Cycling & Mountain Bikes' },
          { id: 'cat-3', name: 'Water Sports & Kayaks' },
          { id: 'cat-4', name: 'Winter & Ski Equipment' },
        ]);
      });
  }, []);

  // Fetch Gear List
  const fetchGear = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('searchTerm', searchTerm);
      if (selectedCategory) params.set('categoryId', selectedCategory);
      if (maxPrice && maxPrice < 500) params.set('maxPrice', maxPrice.toString());
      if (onlyAvailable) params.set('isAvailable', 'true');
      params.set('page', page.toString());
      params.set('limit', '9');

      const response = await apiClient.get<ApiResponse<Gear[]>>(`/gear?${params.toString()}`);
      const data = response.data?.data || [];
      const meta = response.data?.meta;

      setGearList(data);
      if (meta) {
        setTotalPages(Math.ceil(meta.total / meta.limit) || 1);
        setTotalCount(meta.total);
      } else {
        setTotalPages(1);
        setTotalCount(data.length);
      }
    } catch {
      setGearList([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, maxPrice, onlyAvailable, page]);

  useEffect(() => {
    fetchGear();
  }, [fetchGear]);

  // Sync state to URL params
  const updateQueryParams = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    current.set('page', '1');
    setPage(1);
    router.push(`/gear?${current.toString()}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMaxPrice(500);
    setOnlyAvailable(false);
    setPage(1);
    router.push('/gear');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Explore Equipment <span className="gradient-text">Catalog</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse {totalCount > 0 ? `${totalCount} available` : 'all'} sports & outdoor rental items.
          </p>
        </div>

        {/* Mobile Filter Trigger & Reset */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden px-4 py-2 rounded-xl glass-card bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Filters</span>
          </button>

          {(searchTerm || selectedCategory || maxPrice < 500 || onlyAvailable) && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl glass-card border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/10 transition-colors flex items-center space-x-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block space-y-6 glass-card p-6 rounded-2xl border border-slate-800/80 h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Filter Catalog</span>
            </h3>
          </div>

          {/* Search Term Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Search Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Mountain Bike..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateQueryParams('search', e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateQueryParams('category', e.target.value);
              }}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Max Daily Price</span>
              <span className="text-emerald-400 font-bold">${maxPrice}/day</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                updateQueryParams('maxPrice', e.target.value);
              }}
              className="w-full accent-emerald-500 bg-slate-950"
            />
          </div>

          {/* Stock Availability Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4 bg-slate-950 border-slate-800"
              />
              <span className="text-xs font-medium text-slate-300">Show Available Only</span>
            </label>
          </div>
        </aside>

        {/* Mobile Sidebar Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-sm p-4 flex flex-col justify-end">
            <div className="glass-card bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Filter Gear</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Mobile Inputs */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search Keyword..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateQueryParams('search', e.target.value);
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    updateQueryParams('category', e.target.value);
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white gradient-btn"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gear Catalog Grid */}
        <main className="md:col-span-3 space-y-8">
          {isLoading ? (
            <GearGridSkeleton count={6} />
          ) : gearList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gearList.map((gear) => (
                <GearCard key={gear.id} gear={gear} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center rounded-2xl border border-slate-800/80 space-y-4">
              <Compass className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-slate-200">No Equipment Matches Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try adjusting your search criteria, category selection, or max price range slider.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-6">
              <p className="text-xs text-slate-400">
                Page <strong className="text-slate-200">{page}</strong> of{' '}
                <strong className="text-slate-200">{totalPages}</strong>
              </p>

              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => {
                    const newPage = page - 1;
                    setPage(newPage);
                    updateQueryParams('page', newPage.toString());
                  }}
                  className="p-2 rounded-xl glass-card border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => {
                    const newPage = page + 1;
                    setPage(newPage);
                    updateQueryParams('page', newPage.toString());
                  }}
                  className="p-2 rounded-xl glass-card border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function GearCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <GearGridSkeleton count={6} />
        </div>
      }
    >
      <GearCatalogContent />
    </Suspense>
  );
}
