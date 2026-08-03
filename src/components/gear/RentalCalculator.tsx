'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Loader2, PackageCheck, ShieldCheck, Lock } from 'lucide-react';
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
        toast.success('Rental order created! Redirecting to Stripe checkout...');
        router.push(`/checkout/${createdOrder.id}`);
      } else {
        toast.error('Failed to create rental order.');
      }
    } catch {
      // Error toast fired by axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    isAuthenticated &&
    user?.role === 'CUSTOMER' &&
    startDate &&
    endDate &&
    totalDays > 0 &&
    !dateError &&
    gear.isAvailable &&
    gear.stock > 0;

  const getButtonText = () => {
    if (isSubmitting) return 'Creating Rental Order...';
    if (!gear.isAvailable || gear.stock <= 0) return 'Currently Out of Stock';
    if (!isAuthenticated) return 'Log In to Place Order';
    if (user?.role !== 'CUSTOMER') return 'Customer Account Required';
    if (!startDate || !endDate) return 'Select Dates Above to Rent';
    if (dateError) return 'Fix Invalid Dates Above';
    return 'Proceed to Stripe Checkout';
  };

  return (
    <div className="glass-card bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <div className="border-b border-slate-800/80 pb-4 flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-extrabold text-white tracking-tight">
            ${Number(gear.pricePerDay).toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 font-medium ml-1">/ day</span>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stripe Secured</span>
          </span>
        </div>
      </div>

      {/* Date Pickers */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span>Rental Start Date</span>
          </label>
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span>Rental Return Date</span>
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {dateError && (
          <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
            {dateError}
          </p>
        )}
      </div>

      {/* Calculated Total Cost Summary */}
      {totalDays > 0 && !dateError && (
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Rental Rate</span>
            <span className="text-slate-200 font-semibold">${Number(gear.pricePerDay).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Selected Duration</span>
            <span className="text-slate-200 font-semibold">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-base font-extrabold text-white">
            <span>Total Cost</span>
            <span className="text-emerald-400 gradient-text text-xl">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleRentNow}
        disabled={isSubmitting || !isFormValid}
        className="w-full py-4 px-4 rounded-xl text-xs font-bold text-white gradient-btn flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Order...</span>
          </>
        ) : !isAuthenticated ? (
          <>
            <Lock className="w-4 h-4" />
            <span>{getButtonText()}</span>
          </>
        ) : (
          <>
            <PackageCheck className="w-4 h-4" />
            <span>{getButtonText()}</span>
          </>
        )}
      </button>
    </div>
  );
}
