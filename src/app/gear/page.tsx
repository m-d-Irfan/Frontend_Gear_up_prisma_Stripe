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
  Tag,
  Calendar
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
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get('maxPrice')) || 500);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [startDateFilter, setStartDateFilter] = useState<string>(searchParams.get('startDate') || '');
  const [endDateFilter, setEndDateFilter] = useState<string>(searchParams.get('endDate') || '');
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
        setCategories(res.data?.data || []);
      })
      .catch(() => {});
  }, []);

  // Fetch Gear Directory
  const fetchGear = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (maxPrice < 500) params.append('maxPrice', maxPrice.toString());
      params.append('page', page.toString());
      params.append('limit', '9');

      const response = await apiClient.get<ApiResponse<Gear[]>>(`/gear?${params.toString()}`);
      let items = response.data?.data || [];
      const meta = response.data?.meta;

      // Brand Filter (Client-side refinement if specified)
      if (selectedBrand) {
        items = items.filter(
          (item) => item.brand && item.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        );
      }

      // Available Stock Filter
      if (onlyAvailable) {
        items = items.filter((item) => item.isAvailable && item.stock > 0);
      }

      setGearList(items);
      setTotalPages(Math.ceil((meta?.total || items.length) / 9) || 1);
      setTotalCount(meta?.total || items.length);
    } catch {
      setGearList([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedBrand, maxPrice, onlyAvailable, page]);

  useEffect(() => {
    fetchGear();
  }, [fetchGear]);

  // Sync URL Params
  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setPage(1);
    router.push(`/gear?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMaxPrice(500);
    setOnlyAvailable(false);
    setStartDateFilter('');
    setEndDateFilter('');
    setPage(1);
    router.push('/gear');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Equipment <span className="text-emerald-700">Catalog</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-normal">
            Advanced search & filtering by category, brand, rate, and availability dates.
          </p>
        </div>

        {/* Mobile Filter Trigger & Reset */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 flex items-center space-x-2 shadow-xs"
          >
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
          </button>

          {(searchTerm || selectedCategory || selectedBrand || maxPrice < 500 || onlyAvailable || startDateFilter || endDateFilter) && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center space-x-1.5 cursor-pointer"
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
        <aside className="hidden md:block space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Advanced Filter</span>
            </h3>
          </div>

          {/* Search Keyword */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Search Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Mountain Bike, REI..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateQueryParams('search', e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Gear Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateQueryParams('category', e.target.value);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Equipment Brand</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Trek, REI, Yakima..."
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                updateQueryParams('brand', e.target.value);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
            />
          </div>

          {/* Rental Date Availability Filter */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available Rental Dates</span>
            </label>
            <div className="space-y-2">
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={startDateFilter}
                onChange={(e) => {
                  setStartDateFilter(e.target.value);
                  updateQueryParams('startDate', e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
              <input
                type="date"
                min={startDateFilter || new Date().toISOString().split('T')[0]}
                value={endDateFilter}
                onChange={(e) => {
                  setEndDateFilter(e.target.value);
                  updateQueryParams('endDate', e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800">Max Daily Rate</label>
              <span className="font-extrabold text-emerald-700">${maxPrice}/day</span>
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
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStockOnly"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
            />
            <label htmlFor="inStockOnly" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Available Stock Only
            </label>
          </div>
        </aside>

        {/* Gear Listing Grid Area */}
        <div className="md:col-span-3 space-y-6">
          {isLoading ? (
            <GearGridSkeleton count={6} />
          ) : gearList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gearList.map((item) => (
                  <GearCard key={item.id} gear={item} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-3 pt-8 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const prevPage = Math.max(1, page - 1);
                      setPage(prevPage);
                      updateQueryParams('page', prevPage.toString());
                    }}
                    disabled={page === 1}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold text-slate-800">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => {
                      const nextPage = Math.min(totalPages, page + 1);
                      setPage(nextPage);
                      updateQueryParams('page', nextPage.toString());
                    }}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
              <Compass className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Equipment Matches Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn&apos;t find any rental equipment matching your active search and date filter criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 inline-flex items-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>
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
