'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Dumbbell,
  ShoppingBag,
  Store,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, User, UserRole } from '@/types';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'PROVIDER'], { required_error: 'Please select a role' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const inputClass =
  'w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors';
const labelClass = 'text-xs font-bold text-slate-800';
const errorClass = 'text-xs text-rose-600 font-semibold';

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
    defaultValues: { role: 'CUSTOMER' },
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
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-xs">
            <Dumbbell className="w-6 h-6 text-emerald-400 transform -rotate-45" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Your GearUp Account
          </h1>
          <p className="text-xs text-slate-600">
            Join GearUp to rent gear or list your sports inventory today.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection Cards */}
            <div className="space-y-2">
              <label className={labelClass}>Select Your Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'CUSTOMER')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                    selectedRole === 'CUSTOMER'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-xs font-bold">Renter (Customer)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('role', 'PROVIDER')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                    selectedRole === 'PROVIDER'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-xs font-bold">Equipment Provider</span>
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input {...register('name')} type="text" placeholder="John Doe" className={inputClass} />
              </div>
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input {...register('email')} type="email" placeholder="name@example.com" className={inputClass} />
              </div>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className={labelClass}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
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
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-slate-900 hover:text-emerald-700 underline">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
