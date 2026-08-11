import { create } from 'zustand';
import { User, ApiResponse } from '@/types';
import apiClient from '@/lib/axios';

export const DEFAULT_CARTOON_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=GearUpHero1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=GearUpHero2',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=GearUpHero3',
  'https://api.dicebear.com/7.x/micah/svg?seed=GearUpHero4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=GearUpHero5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=GearUpHero6',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=GearUpHero7',
  'https://api.dicebear.com/7.x/micah/svg?seed=GearUpHero8',
];

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchMe: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax;`;
    }
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax;';
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;

      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return null;
      }

      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      const user = response.data?.data || null;

      if (user) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        return user;
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return null;
      }
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax;';
      }
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },
}));
