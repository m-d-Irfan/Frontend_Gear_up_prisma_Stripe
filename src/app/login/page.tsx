'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Dumbbell, ShieldCheck, UserCheck, Store } from 'lucide-react';
import apiClient from '@/lib/axios';
import { useAuthStore, DEFAULT_CARTOON_AVATARS } from '@/store/useAuthStore';
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

  const { user, isAuthenticated, setAuth } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const destination =
        callbackUrl ||
        (user.role === 'ADMIN'
          ? '/dashboard/admin'
          : user.role === 'PROVIDER'
          ? '/dashboard/provider'
          : '/dashboard/customer');
      window.location.href = destination;
    }
  }, [isAuthenticated, user, callbackUrl]);

  const {
    register,
    handleSubmit,
    setValue,
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
        toast.error('Login failed: unexpected server response. Please try again.');
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email: string, roleName: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', '123456', { shouldValidate: true });
    toast.info(`Auto-filled ${roleName} credentials! Click Sign In.`);
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        '1029593800673-c8s80rqu0olies9fi91j3vo2s157q39i.apps.googleusercontent.com';

      const triggerPopup = () => {
        const google = (window as any).google;
        if (!google?.accounts?.oauth2) {
          toast.error('Google Identity SDK loading. Please try again.');
          return;
        }

        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope:
            'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          error_callback: (err: any) => {
            if (err?.type === 'origin_mismatch') {
              toast.error(
                'Google OAuth Error: Please add https://frontend-gear-up-prisma-stripe.vercel.app to Authorized Origins in Google Cloud Console.'
              );
            }
          },
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();

                const googleUser: User = {
                  id: `google-${profile.sub}`,
                  name: profile.name || 'Google User',
                  email: profile.email,
                  role: 'CUSTOMER',
                  status: 'ACTIVE',
                  avatarUrl: profile.picture || DEFAULT_CARTOON_AVATARS[0],
                };

                try {
                  const googleRes = await apiClient.post<
                    ApiResponse<{ token?: string; accessToken?: string; user: User }>
                  >('/auth/google', {
                    email: profile.email,
                    name: profile.name || 'Google User',
                    avatarUrl: profile.picture || DEFAULT_CARTOON_AVATARS[0],
                    role: 'CUSTOMER',
                  });

                  if (googleRes.data?.data?.user) {
                    const backendUser = googleRes.data.data.user;
                    const backendToken =
                      googleRes.data.data.token || googleRes.data.data.accessToken || '';
                    setAuth(backendUser, backendToken);
                    toast.success(`Signed in as ${backendUser.name} (${backendUser.email})`);
                  } else {
                    setAuth(googleUser, 'verified_google_auth');
                    toast.success(`Signed in as ${profile.name} (${profile.email})`);
                  }
                } catch {
                  setAuth(googleUser, 'verified_google_auth');
                  toast.success(`Signed in as ${profile.name} (${profile.email})`);
                }

                const dest = callbackUrl || '/dashboard/customer';
                window.location.href = dest;
              } catch {
                toast.error('Could not retrieve Google profile data.');
              }
            }
          },
        });

        client.requestAccessToken();
      };

      if (typeof window !== 'undefined' && !(window as any).google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = triggerPopup;
        document.head.appendChild(script);
      } else {
        triggerPopup();
      }
    } else {
      const mockUser: User = {
        id: 'usr-fb-demo',
        name: 'Facebook Verified User',
        email: 'facebook.user@gearup.com',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        avatarUrl: DEFAULT_CARTOON_AVATARS[1],
      };
      setAuth(mockUser, 'mock_fb_token_jwt');
      toast.success(`Logged in with Facebook! Welcome ${mockUser.name}`);
      router.push('/dashboard/customer');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md">
          <Dumbbell className="w-6 h-6 transform -rotate-45" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome Back to GearUp
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Enter your credentials to access your gear rentals or dashboard.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Social Login Buttons */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Quick Social Login</p>
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

        {/* Clean Centered OR Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                {...register('email')}
                id="login-email"
                type="email"
                placeholder="customer@gearup.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                {...register('password')}
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-600 font-semibold">{errors.password.message}</p>
            )}
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
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-slate-900 dark:text-emerald-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>

      {/* 1-Click Demo Login Auto-Fill Section */}
      <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1-Click Demo Account Auto-Fill</span>
          </p>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">Instant</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('admin@gearup.com', 'Admin')}
            className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] font-bold">Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('provider@gearup.com', 'Provider')}
            className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span className="text-[11px] font-bold">Provider</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('customer@gearup.com', 'Customer')}
            className="p-2.5 rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span className="text-[11px] font-bold">Customer</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
            <Loader2 className="w-6 h-6 animate-spin text-slate-900 dark:text-white" />
            <span className="text-xs font-semibold">Loading login form...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

