'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Tag } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import apiClient from '@/lib/axios';
import { ApiResponse, Category } from '@/types';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      await apiClient.post<ApiResponse<Category>>('/categories', data);
      toast.success('Category created successfully!');
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
      title="Create New Gear Category"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">
            Category Name
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. Climbing & Trekking"
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          {errors.name && (
            <p className="text-xs text-rose-400 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Short overview of items included in this category..."
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
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
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-md font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Create Category</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
