'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear, LocationItem } from '@/types';
import { SEEDED_GEAR_CATALOG } from '@/data/gearCatalog';

interface AppDataInitial {
  categories: Category[];
  featuredGear: Gear[];
  totalGearCount: number;
  locations: LocationItem[];
  stats: {
    usersCount: number;
    locationsCount: number;
    categoriesCount: number;
    districtsCount: number;
  };
}

interface AppDataState extends AppDataInitial {
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataState | undefined>(undefined);

export function AppDataProvider({ 
  children, 
  initialData 
}: { 
  children: ReactNode;
  initialData: AppDataInitial;
}) {
  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [featuredGear, setFeaturedGear] = useState<Gear[]>(initialData.featuredGear);
  const [totalGearCount, setTotalGearCount] = useState<number>(initialData.totalGearCount);
  const [locations, setLocations] = useState<LocationItem[]>(initialData.locations);
  const [stats, setStats] = useState(initialData.stats);
  const [isLoading, setIsLoading] = useState(false); // Starts false since we have initial data!

  const fetchAppData = async () => {
    setIsLoading(true);
    try {
      // Run fetches in parallel for speed
      const [categoriesRes, gearRes, locationsRes] = await Promise.allSettled([
        apiClient.get<ApiResponse<Category[]>>('/categories'),
        apiClient.get<ApiResponse<Gear[]>>('/gear'),
        apiClient.get<ApiResponse<LocationItem[]>>('/locations')
      ]);

      // 1. Handle Categories
      let fetchedCategories: Category[] = [];
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data?.data) {
        fetchedCategories = categoriesRes.value.data.data;
        setCategories(fetchedCategories);
      }

      // 2. Handle Gear & combine with fallback data
      let fetchedGear: Gear[] = [];
      if (gearRes.status === 'fulfilled' && gearRes.value.data?.data) {
        fetchedGear = gearRes.value.data.data;
        
        const combined = [...fetchedGear];
        SEEDED_GEAR_CATALOG.forEach((seeded) => {
          if (!combined.some((item) => item.id === seeded.id || item.title === seeded.title)) {
            combined.push(seeded);
          }
        });
        setFeaturedGear(combined.slice(0, 6));
        setTotalGearCount(combined.length);
      }

      // 3. Handle Locations
      let fetchedLocations: LocationItem[] = [];
      if (locationsRes.status === 'fulfilled' && locationsRes.value.data?.data) {
        fetchedLocations = locationsRes.value.data.data;
        setLocations(fetchedLocations);
      }

      // 4. Update Stats
      setStats({
        usersCount: 50 + (fetchedGear.length * 2),
        locationsCount: fetchedLocations.length,
        categoriesCount: fetchedCategories.length,
        districtsCount: 8
      });

    } catch (error) {
      console.error('Error fetching global app data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        categories,
        featuredGear,
        totalGearCount,
        locations,
        stats,
        isLoading,
        refreshData: fetchAppData
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
