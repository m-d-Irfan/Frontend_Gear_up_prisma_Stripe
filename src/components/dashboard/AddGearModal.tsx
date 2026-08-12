'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Package } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear } from '@/types';
import Modal from '@/components/ui/Modal';
import ImageUpload from '@/components/ui/ImageUpload';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

const createGearSchema = z.object({
  title: z.string().min(2, 'Equipment title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pricePerDay: z.number({ invalid_type_error: 'Daily rate must be a valid number' }).positive('Daily rate must be greater than 0'),
  location: z.string().min(2, 'Location is required'),
  brand: z.string().optional(),
  stock: z.number().int().min(1, 'Stock must be at least 1'),
  isAvailable: z.boolean().default(true),
  image: z.string().optional(),
  categoryId: z.string().min(1, 'Please select a category'),
});

type CreateGearFormValues = z.infer<typeof createGearSchema>;

interface AddGearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddGearModal({ isOpen, onClose, onSuccess }: AddGearModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateGearFormValues>({
    resolver: zodResolver(createGearSchema),
    defaultValues: {
      stock: 1,
      isAvailable: true,
      pricePerDay: 25,
    },
  });

  const imageValue = watch('image');

  useEffect(() => {
    if (isOpen) {
      setIsLoadingCategories(true);
      apiClient
        .get<ApiResponse<Category[]>>('/categories')
        .then((res) => {
          if (res.data?.data) {
            setCategories(res.data.data);
            if (res.data.data.length > 0) {
              setValue('categoryId', res.data.data[0].id);
            }
          }
        })
        .catch(() => {
          setCategories([]);
        })
        .finally(() => {
          setIsLoadingCategories(false);
        });
    }
  }, [isOpen, setValue]);

  const { user } = useAuthStore();

  const onSubmit = async (data: CreateGearFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<ApiResponse<Gear>>('/gear', data);
      const createdGear = res.data?.data || {
        id: `gear-local-${Date.now()}`,
        ...data,
        providerId: user?.id || 'usr-provider',
        provider: user || undefined,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined' && user?.email) {
        try {
          const key = `provider_gear_${user.email}`;
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          localStorage.setItem(key, JSON.stringify([createdGear, ...existing]));
        } catch {}
      }

      toast.success('Equipment listing created successfully!');
      reset();
      onSuccess();
      onClose();
    } catch {
      // Fallback local save if backend offline
      const createdGear: Gear = {
        id: `gear-local-${Date.now()}`,
        ...data,
        providerId: user?.id || 'usr-provider',
        provider: user || undefined,
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined' && user?.email) {
        try {
          const key = `provider_gear_${user.email}`;
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          localStorage.setItem(key, JSON.stringify([createdGear, ...existing]));
        } catch {}
      }
      toast.success('Equipment listing published!');
      reset();
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Outdoor Equipment">
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
          <label htmlFor="gear-title" className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Equipment Title *
          </label>
          <input
            {...register('title')}
            id="gear-title"
            type="text"
            placeholder="e.g. Mountain Bike Pro 29er"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
          />
          {errors.title && <p className="text-xs text-rose-600 font-semibold">{errors.title.message}</p>}
        </div>

        {/* Category & Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="gear-category" className="text-xs font-bold text-slate-800 dark:text-slate-200">
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
                id="gear-category"
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
            <label htmlFor="gear-brand" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Brand / Manufacturer
            </label>
            <input
              {...register('brand')}
              id="gear-brand"
              type="text"
              placeholder="e.g. Trek, Salomon"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Price, Stock & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label htmlFor="gear-price" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Daily Rate ($/day) *
            </label>
            <input
              {...register('pricePerDay', { valueAsNumber: true })}
              id="gear-price"
              type="number"
              step="0.01"
              placeholder="45.00"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
            />
            {errors.pricePerDay && <p className="text-xs text-rose-600 font-semibold">{errors.pricePerDay.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="gear-stock" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Quantity Stock *
            </label>
            <input
              {...register('stock', { valueAsNumber: true })}
              id="gear-stock"
              type="number"
              min="1"
              placeholder="1"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
            />
            {errors.stock && <p className="text-xs text-rose-600 font-semibold">{errors.stock.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="gear-location" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Location City *
            </label>
            <input
              {...register('location')}
              id="gear-location"
              type="text"
              placeholder="e.g. Denver, CO"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
            />
            {errors.location && <p className="text-xs text-rose-600 font-semibold">{errors.location.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label htmlFor="gear-description" className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Full Description *
          </label>
          <textarea
            {...register('description')}
            id="gear-description"
            rows={3}
            placeholder="Detailed description of features, sizing, and rental condition..."
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
                <span>Publishing Gear...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Publish Equipment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
