'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Package } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import apiClient from '@/lib/axios';
import { ApiResponse, Category, Gear } from '@/types';
import { toast } from 'sonner';

const addGearSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pricePerDay: z.number().min(1, 'Price per day must be at least $1'),
  location: z.string().min(2, 'Location is required'),
  brand: z.string().optional(),
  stock: z.number().min(1, 'Stock must be at least 1 unit'),
  categoryId: z.string().min(1, 'Please select a category'),
  imageUrl: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
});

type AddGearFormValues = z.infer<typeof addGearSchema>;

interface AddGearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddGearModal({
  isOpen,
  onClose,
  onSuccess,
}: AddGearModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddGearFormValues>({
    resolver: zodResolver(addGearSchema),
    defaultValues: {
      pricePerDay: 45,
      stock: 1,
      location: 'San Francisco, CA',
    },
  });

  useEffect(() => {
    if (isOpen) {
      apiClient
        .get<ApiResponse<Category[]>>('/categories')
        .then((res) => {
          if (res.data?.data) {
            setCategories(res.data.data);
          }
        })
        .catch(() => {
          setCategories([
            { id: 'cat-1', name: 'Camping & Hiking' },
            { id: 'cat-2', name: 'Cycling & Mountain Bikes' },
            { id: 'cat-3', name: 'Water Sports & Kayaks' },
            { id: 'cat-4', name: 'Winter & Ski Equipment' },
          ]);
        });
    }
  }, [isOpen]);

  const onSubmit = async (data: AddGearFormValues) => {
    setIsSubmitting(true);
    try {
      await apiClient.post<ApiResponse<Gear>>('/gear', data);
      toast.success('Equipment listed successfully!');
      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      // Error handled by axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="List New Equipment for Rent"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">
            Equipment Title
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g. Trek Mountain Bike 2026 Edition"
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {errors.title && (
            <p className="text-xs text-rose-400 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Category & Brand Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <select
              {...register('categoryId')}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-rose-400 font-medium">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Brand (Optional)</label>
            <input
              {...register('brand')}
              type="text"
              placeholder="e.g. Trek, Salomon, REI"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Price, Stock & Location Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Price/Day ($)</label>
            <input
              {...register('pricePerDay', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            {errors.pricePerDay && (
              <p className="text-xs text-rose-400 font-medium">{errors.pricePerDay.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Stock Quantity</label>
            <input
              {...register('stock', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            {errors.stock && (
              <p className="text-xs text-rose-400 font-medium">{errors.stock.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Location</label>
            <input
              {...register('location')}
              type="text"
              placeholder="e.g. San Francisco, CA"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            {errors.location && (
              <p className="text-xs text-rose-400 font-medium">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">
            Image URL
          </label>
          <input
            {...register('imageUrl')}
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {errors.imageUrl && (
            <p className="text-xs text-rose-400 font-medium">{errors.imageUrl.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">
            Full Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Detailed equipment specifications, included accessories, and condition notes..."
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {errors.description && (
            <p className="text-xs text-rose-400 font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white gradient-btn flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Listing...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>List Equipment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
