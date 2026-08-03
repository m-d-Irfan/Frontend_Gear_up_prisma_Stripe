'use client';

import React, { useState } from 'react';
import { Star, Loader2, Send } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import apiClient from '@/lib/axios';
import { ApiResponse, RentalOrder, Review } from '@/types';
import { toast } from 'sonner';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: RentalOrder;
  onSuccess?: () => void;
}

export default function WriteReviewModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Please enter your review feedback comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post<ApiResponse<Review>>('/reviews', {
        gearId: order.gearId,
        rating: rating,
        comment: comment.trim(),
      });

      toast.success('Thank you! Your equipment review has been submitted.');
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
      title="Write Equipment Review"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Reviewing equipment:</p>
          <p className="text-sm font-bold text-slate-900">
            {order.gear?.title || `Gear #${order.gearId}`}
          </p>
        </div>

        {/* Star Rating Picker */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            Star Rating
          </label>
          <div className="flex items-center space-x-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const starValue = index + 1;
              const isFilled =
                starValue <= (hoverRating || rating);

              return (
                <button
                  type="button"
                  key={starValue}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      isFilled
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-bold text-amber-600 pl-2">
              {hoverRating || rating} / 5
            </span>
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Your Feedback & Review
          </label>
          <textarea
            rows={4}
            placeholder="How was the equipment condition? Was the rental smooth?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
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
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
