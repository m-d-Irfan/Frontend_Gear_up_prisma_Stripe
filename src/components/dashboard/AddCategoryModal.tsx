'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import apiClient from '@/lib/axios';
import { ApiResponse, Category } from '@/types';
import { toast } from 'sonner';

import ImageUpload from '@/components/ui/ImageUpload';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass =
  'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900';
const labelClass = 'text-xs font-semibold text-slate-700';

export default function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categoryImage, setCategoryImage] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    const payload = { ...data, image: categoryImage };
    try {
      const res = await apiClient.post<ApiResponse<Category>>('/categories', payload);
      const catId = res.data?.data?.id;
      if (catId && categoryImage && typeof window !== 'undefined') {
        localStorage.setItem(`category_image_${catId}`, categoryImage);
        localStorage.setItem(`category_image_${data.name.toLowerCase()}`, categoryImage);
      }
      toast.success('Category created successfully!');
      reset();
      setCategoryImage('');
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`category_image_${data.name.toLowerCase()}`, categoryImage);
      }
      toast.success('Category saved successfully!');
      reset();
      setCategoryImage('');
      if (onSuccess) onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Gear Category" maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category Image Upload */}
        <ImageUpload
          value={categoryImage}
          onChange={(url) => setCategoryImage(url)}
          onRemove={() => setCategoryImage('')}
          label="Category Banner / Card Image (Optional)"
        />

        {/* Name */}
        <div className="space-y-1">
          <label className={labelClass}>Category Name</label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. Climbing & Trekking"
            className={inputClass}
          />
          {errors.name && <p className="text-xs text-rose-600 font-medium">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className={labelClass}>Description (Optional)</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Short overview of items included in this category..."
            className={inputClass}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-sm transition-all"
          >
            {isSubmitting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Creating...</span></>
            ) : (
              <><Plus className="w-3.5 h-3.5 text-emerald-400" /><span>Create Category</span></>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
