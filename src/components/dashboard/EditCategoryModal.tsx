'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit3 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import apiClient from '@/lib/axios';
import { ApiResponse, Category } from '@/types';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface EditCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass =
  'w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500';
const labelClass = 'text-xs font-semibold text-slate-700 dark:text-slate-300';

export default function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: EditCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  useEffect(() => {
    if (isOpen && category) {
      reset({
        name: category.name || '',
        description: category.description || '',
      });
    }
  }, [isOpen, category, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    if (!category) return;
    setIsSubmitting(true);
    try {
      await apiClient.patch<ApiResponse<Category>>(`/categories/${category.id}`, data);
      toast.success('Category updated successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      // Fallback try PUT if PATCH fails
      try {
        await apiClient.put<ApiResponse<Category>>(`/categories/${category.id}`, data);
        toast.success('Category updated successfully!');
        if (onSuccess) onSuccess();
        onClose();
      } catch {
        // Handled by axios interceptor
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Category: ${category?.name || ''}`} maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label className={labelClass}>Category Name *</label>
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
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-sm transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
