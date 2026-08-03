'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus } from 'lucide-react';
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

const inputClass = 'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900';
const labelClass = 'text-xs font-semibold text-slate-700';
const errorClass = 'text-xs text-rose-600 font-medium';

export default function AddGearModal({ isOpen, onClose, onSuccess }: AddGearModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddGearFormValues>({
    resolver: zodResolver(addGearSchema),
    defaultValues: { pricePerDay: 45, stock: 1, location: 'San Francisco, CA' },
  });

  useEffect(() => {
    if (isOpen) {
      apiClient.get<ApiResponse<Category[]>>('/categories')
        .then((res) => { if (res.data?.data) setCategories(res.data.data); })
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
      // Handled by axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="List New Equipment for Rent" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className={labelClass}>Equipment Title</label>
          <input {...register('title')} type="text" placeholder="e.g. Trek Mountain Bike 2026 Edition" className={inputClass} />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category & Brand Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={labelClass}>Category</label>
            <select {...register('categoryId')} className={inputClass}>
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            {errors.categoryId && <p className={errorClass}>{errors.categoryId.message}</p>}
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Brand (Optional)</label>
            <input {...register('brand')} type="text" placeholder="e.g. Trek, Salomon, REI" className={inputClass} />
          </div>
        </div>

        {/* Price, Stock & Location Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className={labelClass}>Price/Day ($)</label>
            <input {...register('pricePerDay', { valueAsNumber: true })} type="number" min="1" className={inputClass} />
            {errors.pricePerDay && <p className={errorClass}>{errors.pricePerDay.message}</p>}
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Stock Qty</label>
            <input {...register('stock', { valueAsNumber: true })} type="number" min="1" className={inputClass} />
            {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Location</label>
            <input {...register('location')} type="text" placeholder="e.g. San Francisco, CA" className={inputClass} />
            {errors.location && <p className={errorClass}>{errors.location.message}</p>}
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-1">
          <label className={labelClass}>Image URL</label>
          <input {...register('imageUrl')} type="url" placeholder="https://images.unsplash.com/photo-..." className={inputClass} />
          {errors.imageUrl && <p className={errorClass}>{errors.imageUrl.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className={labelClass}>Full Description</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Detailed equipment specifications, included accessories, and condition notes..."
            className={inputClass}
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-sm transition-all"
          >
            {isSubmitting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Listing...</span></>
            ) : (
              <><Plus className="w-3.5 h-3.5 text-emerald-400" /><span>List Equipment</span></>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
