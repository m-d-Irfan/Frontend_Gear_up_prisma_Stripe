'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Dumbbell, ShoppingBag, Store } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, User, UserRole } from '@/types';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'PROVIDER'], {
    required_error: 'Please select a role',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await apiClient.post<ApiResponse<User>>('/auth/register', data);
      toast.success('Account registered successfully! Please log in.');
      router.push('/login');
    } catch {
      // Error handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center space-x-2.5">
            <div className="w-12 h-12 rounded-2xl gradient-btn flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-100 tracking-tight">
              Gear<span className="gradient-text">Up</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Create your account
          </h1>
          <p className="text-sm text-slate-400">
            Join GearUp to rent gear or list your sports inventory today.
          </p>
        </div>

        {/* Register Card */}
        <div className="glass-card bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Select Your Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'CUSTOMER')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                    selectedRole === 'CUSTOMER'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-xs">Renter (Customer)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('role', 'PROVIDER')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                    selectedRole === 'PROVIDER'
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-semibold shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-xs">Equipment Provider</span>
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white gradient-btn flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Prompt */}
          <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
