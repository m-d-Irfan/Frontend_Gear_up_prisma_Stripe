'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Dumbbell } from 'lucide-react';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiResponse, User } from '@/types';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken?: string; token?: string; user: User }>
      >('/auth/login', data);

      const resData = response.data?.data;
      // Handle both `accessToken` and `token` field names from backend
      const token = resData?.accessToken || resData?.token;
      const user = resData?.user;

      if (token && user) {
        setAuth(user, token);
        toast.success(`Welcome back, ${user.name}!`);

        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (user.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (user.role === 'PROVIDER') {
          router.push('/dashboard/provider');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        // Response was 200 but data shape was unexpected
        toast.error('Login failed: unexpected server response. Please try again.');
      }
    } catch {
      // Error already shown by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-xs">
          <Dumbbell className="w-6 h-6 text-emerald-400 transform -rotate-45" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Welcome Back to GearUp
        </h1>
        <p className="text-xs text-slate-600">
          Enter your credentials to access your gear rentals or dashboard.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@gearup.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 font-semibold">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-600 font-semibold">
                {errors.password.message}
              </p>
            )}
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
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Prompt */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-slate-900 hover:text-emerald-700 underline">
            Register here
          </Link>
        </div>
      </div>

      {/* Demo Credentials Helper */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-bold text-slate-700 text-center">Demo Credentials</p>
        <div className="grid grid-cols-1 gap-1.5 text-[11px] text-slate-600">
          <div className="flex justify-between bg-white rounded-lg px-3 py-1.5 border border-slate-200">
            <span className="font-bold text-rose-700">Admin</span>
            <span className="font-mono">admin@gearup.com / 123456</span>
          </div>
          <div className="flex justify-between bg-white rounded-lg px-3 py-1.5 border border-slate-200">
            <span className="font-bold text-indigo-700">Provider</span>
            <span className="font-mono">provider@gearup.com / 123456</span>
          </div>
          <div className="flex justify-between bg-white rounded-lg px-3 py-1.5 border border-slate-200">
            <span className="font-bold text-sky-700">Customer</span>
            <span className="font-mono">customer@gearup.com / 123456</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center space-x-2 text-slate-600">
            <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
            <span className="text-xs font-semibold">Loading login...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
