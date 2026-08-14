import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear, LocationItem } from '@/types';
import { SEEDED_GEAR_CATALOG } from '@/data/gearCatalog';

export interface AppDataResult {
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

export async function fetchGlobalAppData(): Promise<AppDataResult> {
  try {
    const [categoriesRes, gearRes, locationsRes] = await Promise.allSettled([
      apiClient.get<ApiResponse<Category[]>>('/categories'),
      apiClient.get<ApiResponse<Gear[]>>('/gear'),
      apiClient.get<ApiResponse<LocationItem[]>>('/locations'),
    ]);

    let categories: Category[] = [];
    if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data?.data) {
      categories = categoriesRes.value.data.data;
    }

    let allGear: Gear[] = [];
    let featuredGear: Gear[] = [];
    let totalGearCount = SEEDED_GEAR_CATALOG.length;
    
    if (gearRes.status === 'fulfilled' && gearRes.value.data?.data) {
      const fetchedGear = gearRes.value.data.data;
      const combined = [...fetchedGear];
      SEEDED_GEAR_CATALOG.forEach((seeded) => {
        if (!combined.some((item) => item.id === seeded.id)) {
          combined.push(seeded);
        }
      });
      allGear = combined;
      featuredGear = combined.slice(0, 6);
      totalGearCount = combined.length;
    } else {
      allGear = SEEDED_GEAR_CATALOG;
      featuredGear = SEEDED_GEAR_CATALOG.slice(0, 6);
    }

    let locations: LocationItem[] = [];
    if (locationsRes.status === 'fulfilled' && locationsRes.value.data?.data) {
      locations = locationsRes.value.data.data;
    }

    const stats = {
      usersCount: 50 + (totalGearCount * 2),
      locationsCount: locations.length,
      categoriesCount: categories.length,
      districtsCount: 8,
    };

    return { categories, allGear, featuredGear, totalGearCount, locations, stats };
  } catch (error) {
    // Return empty fallback on severe failure
    return {
      categories: [],
      allGear: SEEDED_GEAR_CATALOG,
      featuredGear: SEEDED_GEAR_CATALOG.slice(0, 6),
      totalGearCount: SEEDED_GEAR_CATALOG.length,
      locations: [],
      stats: { usersCount: 50, locationsCount: 0, categoriesCount: 0, districtsCount: 8 },
    };
  }
}
