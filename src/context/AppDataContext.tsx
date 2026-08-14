'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear, LocationItem } from '@/types';
import { fetchGlobalAppData } from '@/lib/appDataFetcher';

interface AppDataInitial {
  categories: Category[];
  allGear: Gear[];
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
  const [allGear, setAllGear] = useState<Gear[]>(initialData.allGear);
  const [featuredGear, setFeaturedGear] = useState<Gear[]>(initialData.featuredGear);
  const [totalGearCount, setTotalGearCount] = useState<number>(initialData.totalGearCount);
  const [locations, setLocations] = useState<LocationItem[]>(initialData.locations);
  const [stats, setStats] = useState(initialData.stats);
  const [isLoading, setIsLoading] = useState(false); // Starts false since we have initial data!

  const fetchAppData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGlobalAppData();
      setCategories(data.categories);
      setAllGear(data.allGear);
      setFeaturedGear(data.featuredGear);
      setTotalGearCount(data.totalGearCount);
      setLocations(data.locations);
      setStats(data.stats);
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
        allGear,
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
