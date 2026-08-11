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
import { ApiResponse, User } from '@/types';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'PROVIDER'], { required_error: 'Please select a role' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const inputClass =
  'w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 transition-colors';
const labelClass = 'text-xs font-bold text-slate-800 dark:text-slate-200';
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
      toast.success('Account registered successfully! A random cartoon avatar has been assigned to your profile.');
      router.push('/login');
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} Sign-Up initialized. Redirecting...`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md">
            <Dumbbell className="w-6 h-6 transform -rotate-45" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Your GearUp Account
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Join GearUp to rent gear or list your sports inventory today.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Social Sign Up Options */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Quick Social Registration</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">or register with email</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection Cards */}
            <div className="space-y-2">
              <label className={labelClass}>Select Your Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'CUSTOMER')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                    selectedRole === 'CUSTOMER'
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
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
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-500 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-xs font-bold">Equipment Provider</span>
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className={labelClass}>Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input {...register('name')} id="register-name" type="text" placeholder="John Doe" className={inputClass} />
              </div>
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className={labelClass}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input {...register('email')} id="register-email" type="email" placeholder="name@example.com" className={inputClass} />
              </div>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className={labelClass}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('password')}
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 hover:bg-slate-800 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
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
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-slate-900 dark:text-emerald-400 hover:underline">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

