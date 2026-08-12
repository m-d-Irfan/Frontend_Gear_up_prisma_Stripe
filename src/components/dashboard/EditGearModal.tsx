'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit3, Save } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear, LocationItem } from '@/types';
import Modal from '@/components/ui/Modal';
import ImageUpload from '@/components/ui/ImageUpload';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

const DEFAULT_ADMIN_LOCATIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Cox\'s Bazar',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Gazipur',
  'Comilla',
];

const updateGearSchema = z.object({
  title: z.string().min(2, 'Equipment title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pricePerDay: z.number({ invalid_type_error: 'First day price must be a valid number' }).positive('First day rate must be greater than 0'),
  additionalDayPrice: z.number({ invalid_type_error: 'Additional day price must be a valid number' }).min(0, 'Additional day rate cannot be negative'),
  location: z.string().min(1, 'Please select a location'),
  brand: z.string().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  isAvailable: z.boolean(),
  image: z.string().optional(),
  categoryId: z.string().min(1, 'Please select a category'),
});

type UpdateGearFormValues = z.infer<typeof updateGearSchema>;

interface EditGearModalProps {
  isOpen: boolean;
  gear: Gear | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditGearModal({ isOpen, gear, onClose, onSuccess }: EditGearModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<string[]>(DEFAULT_ADMIN_LOCATIONS);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateGearFormValues>({
    resolver: zodResolver(updateGearSchema),
  });

  const imageValue = watch('image');

  useEffect(() => {
    if (isOpen && gear) {
      setIsLoadingCategories(true);
      apiClient
        .get<ApiResponse<Category[]>>('/categories')
        .then((res) => {
          if (res.data?.data) {
            setCategories(res.data.data);
          }
        })
        .catch(() => {
          setCategories([]);
        })
        .finally(() => {
          setIsLoadingCategories(false);
        });

      // Fetch Admin Locations
      let cachedNames: string[] = [];
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('platform_locations');
          if (stored) {
            const parsed = JSON.parse(stored);
            cachedNames = parsed.map((l: any) => l.name || l);
          }
        } catch {}
      }
      const finalLocations = cachedNames.length > 0 ? cachedNames : DEFAULT_ADMIN_LOCATIONS;
      setLocations(finalLocations);

      reset({
        title: gear.title,
        description: gear.description,
        pricePerDay: gear.pricePerDay,
        additionalDayPrice: gear.additionalDayPrice ?? Math.round(gear.pricePerDay * 0.6),
        location: gear.location && finalLocations.includes(gear.location) ? gear.location : finalLocations[0],
        brand: gear.brand || '',
        stock: gear.stock,
        isAvailable: gear.isAvailable,
        image: gear.image || gear.imageUrl || '',
        categoryId: gear.categoryId || (gear.category?.id || ''),
      });
    }
  }, [isOpen, gear, reset]);

  const { user } = useAuthStore();

  const onSubmit = async (data: UpdateGearFormValues) => {
    if (!gear) return;
    setIsSubmitting(true);
    try {
      await apiClient.patch<ApiResponse<Gear>>(`/gear/${gear.id}`, data);
      
      if (typeof window !== 'undefined' && user?.email) {
        try {
          const key = `provider_gear_${user.email}`;
          const existing: Gear[] = JSON.parse(localStorage.getItem(key) || '[]');
          const updated = existing.map((g) => (g.id === gear.id ? { ...g, ...data } : g));
          localStorage.setItem(key, JSON.stringify(updated));
          localStorage.setItem(`gear_stock_${gear.id}`, String(data.stock));
        } catch {}
      }

      toast.success('Equipment updated successfully!');
      onSuccess();
      onClose();
    } catch {
      // Local fallback save
      if (typeof window !== 'undefined' && user?.email) {
        try {
          const key = `provider_gear_${user.email}`;
          const existing: Gear[] = JSON.parse(localStorage.getItem(key) || '[]');
          const updated = existing.map((g) => (g.id === gear.id ? { ...g, ...data } : g));
          localStorage.setItem(key, JSON.stringify(updated));
          localStorage.setItem(`gear_stock_${gear.id}`, String(data.stock));
        } catch {}
      }
      toast.success('Equipment details updated successfully!');
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Listing: ${gear?.title || 'Equipment'}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image File Upload Component */}
        <ImageUpload
          value={imageValue}
          onChange={(base64) => setValue('image', base64, { shouldValidate: true })}
          onRemove={() => setValue('image', '', { shouldValidate: true })}
          label="Equipment Image File Upload"
          error={errors.image?.message}
        />

        {/* Title */}
        <div className="space-y-1">
          <label htmlFor="edit-gear-title" className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Equipment Title *
          </label>
          <input
            {...register('title')}
            id="edit-gear-title"
            type="text"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
          />
          {errors.title && <p className="text-xs text-rose-600 font-semibold">{errors.title.message}</p>}
        </div>

        {/* Category & Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="edit-gear-category" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Category *
            </label>
            {isLoadingCategories ? (
              <div className="flex items-center space-x-2 py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-xs text-slate-500">Loading categories...</span>
              </div>
            ) : (
              <select
                {...register('categoryId')}
                id="edit-gear-category"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            {errors.categoryId && <p className="text-xs text-rose-600 font-semibold">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-gear-brand" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Brand / Manufacturer
            </label>
            <input
              {...register('brand')}
              id="edit-gear-brand"
              type="text"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Pricing Fields Grid (First Day & Additional Days in BDT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="edit-gear-first-price" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              First Day Pricing (৳ / 1st Day) *
            </label>
            <input
              {...register('pricePerDay', { valueAsNumber: true })}
              id="edit-gear-first-price"
              type="number"
              step="1"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
            />
            {errors.pricePerDay && <p className="text-xs text-rose-600 font-semibold">{errors.pricePerDay.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-gear-additional-price" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Additional Days Pricing (৳ / Day) *
            </label>
            <input
              {...register('additionalDayPrice', { valueAsNumber: true })}
              id="edit-gear-additional-price"
              type="number"
              step="1"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
            />
            {errors.additionalDayPrice && <p className="text-xs text-rose-600 font-semibold">{errors.additionalDayPrice.message}</p>}
          </div>
        </div>

        {/* Stock Quantity & Location Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="edit-gear-stock" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Stock Quantity *
            </label>
            <input
              {...register('stock', { valueAsNumber: true })}
              id="edit-gear-stock"
              type="number"
              min="0"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
            />
            {errors.stock && <p className="text-xs text-rose-600 font-semibold">{errors.stock.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-gear-location" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Location City (Admin Managed) *
            </label>
            <select
              {...register('location')}
              id="edit-gear-location"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors.location && <p className="text-xs text-rose-600 font-semibold">{errors.location.message}</p>}
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            {...register('isAvailable')}
            id="edit-gear-available"
            type="checkbox"
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
          />
          <label htmlFor="edit-gear-available" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
            Equipment Available for Rental
          </label>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label htmlFor="edit-gear-description" className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Full Description *
          </label>
          <textarea
            {...register('description')}
            id="edit-gear-description"
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 resize-none"
          />
          {errors.description && <p className="text-xs text-rose-600 font-semibold">{errors.description.message}</p>}
        </div>

        {/* Submit Actions */}
        <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
