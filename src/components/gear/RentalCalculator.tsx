'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Loader2, PackageCheck } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Gear, RentalOrder } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

interface RentalCalculatorProps {
  gear: Gear;
}

export default function RentalCalculator({ gear }: RentalCalculatorProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalDays, setTotalDays] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!startDate || !endDate) {
      setTotalDays(0);
      setTotalPrice(0);
      setDateError(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setDateError('Start date cannot be in the past.');
      setTotalDays(0);
      setTotalPrice(0);
      return;
    }

    if (end <= start) {
      setDateError('End date must be after start date.');
      setTotalDays(0);
      setTotalPrice(0);
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDateError(null);
    setTotalDays(diffDays);
    setTotalPrice(diffDays * gear.pricePerDay);
  }, [startDate, endDate, gear.pricePerDay]);

  const handleRentNow = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in as a customer to place a rental order.');
      router.push(`/login?callbackUrl=/gear/${gear.id}`);
      return;
    }

    if (user.role !== 'CUSTOMER') {
      toast.error('Only Customer accounts can place rental orders.');
      return;
    }

    if (!startDate || !endDate || totalDays <= 0 || dateError) {
      toast.error('Please select valid rental start and end dates.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        gearId: gear.id,
        startDate: startDate,
        endDate: endDate,
      };

      const response = await apiClient.post<ApiResponse<RentalOrder>>('/orders', payload);
      const createdOrder = response.data?.data;

      if (createdOrder?.id) {
        toast.success('Rental order created! Redirecting to checkout...');
        router.push(`/checkout/${createdOrder.id}`);
      } else {
        toast.error('Failed to create order.');
      }
    } catch {
      // Error handled by axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-100">${gear.pricePerDay}</span>
          <span className="text-xs text-slate-400 font-medium">per day</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Select your rental duration below to calculate total cost.
        </p>
      </div>

      {/* Date Inputs */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Start Date</span>
          </label>
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>End Date</span>
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {dateError && (
          <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
            {dateError}
          </p>
        )}
      </div>

      {/* Calculated Total Cost Summary */}
      {totalDays > 0 && !dateError && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Rate</span>
            <span className="text-slate-200">${gear.pricePerDay}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Duration</span>
            <span className="text-slate-200">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-bold text-slate-100">
            <span>Total Cost</span>
            <span className="text-emerald-400">${totalPrice}</span>
          </div>
        </div>
      )}

      {/* Rent Action Button */}
      <button
        onClick={handleRentNow}
        disabled={isSubmitting || !gear.isAvailable || gear.stock <= 0 || !!dateError || totalDays <= 0}
        className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white gradient-btn flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Order...</span>
          </>
        ) : (
          <>
            <PackageCheck className="w-4 h-4" />
            <span>Proceed to Rental Checkout</span>
          </>
        )}
      </button>
    </div>
  );
}
