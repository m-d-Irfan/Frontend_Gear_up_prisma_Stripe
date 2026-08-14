'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter} from 'next/navigation';
import { useAppData } from '@/context/AppDataContext';
import {
  Search,
  SlidersHorizontal,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  RefreshCw,
  MapPin,
  ArrowUpDown,
  Layers,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear } from '@/types';
import GearCard from '@/components/gear/GearCard';
import { GearGridSkeleton } from '@/components/ui/LoadingSkeleton';

const BANGLADESH_DISTRICTS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Cox\'s Bazar',
  'Gazipur',
  'Narayanganj',
  'Comilla',
];

import { useAuthStore } from '@/store/useAuthStore';

function GearCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { allGear, categories: contextCategories } = useAppData();

  const [providerViewMode, setProviderViewMode] = useState<'my_items' | 'all'>('my_items');

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState<number>(Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get('maxPrice')) || 500);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  
  // Sorting State
  const [sortOption, setSortOption] = useState<string>(searchParams.get('sort') || 'newest');
  
  // Pagination States
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState<number>(Number(searchParams.get('limit')) || 10);

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

  const fetchGear = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use pre-fetched gear from the global context instead of an independent API request
      let items = [...allGear];

      // Load all locally created gear across all providers so it's visible in the catalog
      if (typeof window !== 'undefined') {
        const allLocalGear: Gear[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('provider_gear_')) {
            try {
              const cached = localStorage.getItem(key);
              if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed)) allLocalGear.push(...parsed);
              }
            } catch {}
          }
        }
        
        // Append local gear if it doesn't already exist
        allLocalGear.forEach((lg) => {
          if (!items.some((item) => item.id === lg.id)) {
            items.push(lg);
          }
        });
      }

      // Filter by search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        items = items.filter(
          (i) =>
            i.title.toLowerCase().includes(term) ||
            (i.brand && i.brand.toLowerCase().includes(term)) ||
            (i.description && i.description.toLowerCase().includes(term))
        );
      }

      // Filter by location
      if (selectedLocation) {
        items = items.filter((i) => i.location?.toLowerCase() === selectedLocation.toLowerCase());
      }

      // Filter by price range
      items = items.filter((i) => Number(i.pricePerDay) >= minPrice && Number(i.pricePerDay) <= maxPrice);

      // Available Stock Filter
      if (onlyAvailable) {
        items = items.filter((item) => item.isAvailable && (item.stock ?? 0) > 0);
      }

      // Selected Category Filter (Backend + Client Fallback)
      if (selectedCategory) {
        items = items.filter((item) => {
          const catName = item.category?.name || '';
          const catId = item.categoryId || '';
          return (
            catName.toLowerCase() === selectedCategory.toLowerCase() ||
            catId.toLowerCase() === selectedCategory.toLowerCase() ||
            item.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(selectedCategory.toLowerCase()))
          );
        });
      }

      // Provider Store Items Filter (Default for Provider accounts)
      if (user?.role === 'PROVIDER' && providerViewMode === 'my_items') {
        items = items.filter(
          (g) =>
            g.providerId === user?.id ||
            (g.provider?.email && g.provider.email.toLowerCase() === user?.email?.toLowerCase()) ||
            g.providerId === user?.email
        );
      }

      // Client-side sorting since we are using context data
      items.sort((a, b) => {
        if (sortOption === 'title_asc') return a.title.localeCompare(b.title);
        if (sortOption === 'title_desc') return b.title.localeCompare(a.title);
        if (sortOption === 'price_asc') return a.pricePerDay - b.pricePerDay;
        if (sortOption === 'price_desc') return b.pricePerDay - a.pricePerDay;
        if (sortOption === 'location_asc') return (a.location || '').localeCompare(b.location || '');
        // default newest
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });

      const totalItemsCount = items.length;
      const calculatedPages = Math.max(1, Math.ceil(totalItemsCount / limit));
      const startIdx = (page - 1) * limit;
      const paginatedItems = items.slice(startIdx, startIdx + limit);

      setGearList(paginatedItems);
      setTotalCount(totalItemsCount);
      setTotalPages(calculatedPages);
    } catch {
      setGearList([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedLocation, minPrice, maxPrice, onlyAvailable, sortOption, page, limit, user, providerViewMode]);

  useEffect(() => {
    fetchGear();
  }, [fetchGear]);

  // Sync Category from URL query parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam !== null && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

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
    setSelectedLocation('');
    setMinPrice(0);
    setMaxPrice(500);
    setOnlyAvailable(false);
    setSortOption('newest');
    setPage(1);
    setLimit(10);
    router.push('/gear');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Provider Custom Store Inventory Banner */}
      {user?.role === 'PROVIDER' && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Provider Mode Active
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {providerViewMode === 'my_items'
                ? 'Your Store Equipment Directory'
                : 'All Platform Equipment Directory'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {providerViewMode === 'my_items'
                ? 'Displaying strictly equipment items listed by your store account. Click any item card to edit photos, pricing, stock quantity, or details.'
                : 'Browsing all platform equipment catalog.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setProviderViewMode('my_items')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                providerViewMode === 'my_items'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              My Store Items ({gearList.length})
            </button>
            <button
              type="button"
              onClick={() => setProviderViewMode('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                providerViewMode === 'all'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              All Catalog Items
            </button>
          </div>
        </div>
      )}

      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore Equipment <span className="text-emerald-600 dark:text-emerald-400">Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-normal">
            Filter outdoor gear by category, price, district location, and customized page limit.
          </p>
        </div>

        {/* Top Controls: Sorting & Mobile Filter Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2 shadow-xs"
          >
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Filters</span>
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <ArrowUpDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                updateQueryParams('sort', e.target.value);
              }}
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="newest" className="dark:bg-slate-900">Newest First</option>
              <option value="title_asc" className="dark:bg-slate-900">Name (A - Z)</option>
              <option value="title_desc" className="dark:bg-slate-900">Name (Z - A)</option>
              <option value="location_asc" className="dark:bg-slate-900">Location (District A-Z)</option>
              <option value="price_asc" className="dark:bg-slate-900">Price (Low to High)</option>
              <option value="price_desc" className="dark:bg-slate-900">Price (High to Low)</option>
            </select>
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline">Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                setLimit(newLimit);
                setPage(1);
                updateQueryParams('limit', newLimit.toString());
              }}
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="10" className="dark:bg-slate-900">10 / page</option>
              <option value="20" className="dark:bg-slate-900">20 / page</option>
              <option value="50" className="dark:bg-slate-900">50 / page</option>
            </select>
          </div>

          {(searchTerm || selectedCategory || selectedLocation || minPrice > 0 || maxPrice < 500 || onlyAvailable) && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop + Mobile) */}
        <aside
          className={`space-y-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit sticky top-24 ${
            isMobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Filter Equipment</span>
            </h3>
          </div>

          {/* Search Keyword */}
          <div className="space-y-1.5">
            <label htmlFor="catalog-search" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                id="catalog-search"
                type="text"
                placeholder="Search title, brand..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateQueryParams('search', e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label htmlFor="catalog-category" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Gear Category
            </label>
            <select
              id="catalog-category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateQueryParams('category', e.target.value);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 cursor-pointer"
            >
              <option value="">All Categories</option>
              {selectedCategory && !categories.some((c) => c.name.toLowerCase() === selectedCategory.toLowerCase()) && (
                <option value={selectedCategory}>{selectedCategory}</option>
              )}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location District Filter */}
          <div className="space-y-1.5">
            <label htmlFor="catalog-location" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Location (District)</span>
            </label>
            <select
              id="catalog-location"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                updateQueryParams('location', e.target.value);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 cursor-pointer"
            >
              <option value="">All District Locations</option>
              {BANGLADESH_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist} District
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Inputs & Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 dark:text-slate-200">Daily Price Range ($)</label>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">${minPrice} - ${maxPrice}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Price"
                min="0"
                value={minPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMinPrice(val);
                  updateQueryParams('minPrice', val.toString());
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Max Price"
                min="0"
                value={maxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxPrice(val);
                  updateQueryParams('maxPrice', val.toString());
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Availability Filter Dropdown */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label htmlFor="catalog-availability" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Stock Availability
            </label>
            <select
              id="catalog-availability"
              value={onlyAvailable ? 'in_stock' : 'all'}
              onChange={(e) => {
                const isOnly = e.target.value === 'in_stock';
                setOnlyAvailable(isOnly);
                updateQueryParams('isAvailable', isOnly ? 'true' : '');
              }}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Equipment (All Statuses)</option>
              <option value="in_stock">In Stock Only (Ready to Rent)</option>
            </select>
          </div>
        </aside>

        {/* Gear Listing Grid Area */}
        <div className="md:col-span-3 space-y-6">
          {isLoading ? (
            <GearGridSkeleton count={limit > 10 ? 12 : limit} />
          ) : gearList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gearList.map((item) => (
                  <GearCard key={item.id} gear={item} />
                ))}
              </div>

              {/* Pagination Controls & Items Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <p>
                    Showing <span className="font-bold text-slate-900 dark:text-white">{gearList.length}</span> of{' '}
                    <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> items
                  </p>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <div className="flex items-center space-x-1.5">
                    <span>Per Page:</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        const newLimit = Number(e.target.value);
                        setLimit(newLimit);
                        setPage(1);
                        updateQueryParams('limit', newLimit.toString());
                      }}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value={6}>6 items</option>
                      <option value={10}>10 items</option>
                      <option value={20}>20 items</option>
                      <option value={30}>30 items</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const prevPage = Math.max(1, page - 1);
                      setPage(prevPage);
                      updateQueryParams('page', prevPage.toString());
                    }}
                    disabled={page === 1}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => {
                      const nextPage = Math.min(totalPages, page + 1);
                      setPage(nextPage);
                      updateQueryParams('page', nextPage.toString());
                    }}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <Compass className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Equipment Matches Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                We couldn&apos;t find any rental equipment matching your active search, district location, or price range filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 inline-flex items-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
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
          <GearGridSkeleton count={10} />
        </div>
      }
    >
      <GearCatalogContent />
    </Suspense>
  );
}

