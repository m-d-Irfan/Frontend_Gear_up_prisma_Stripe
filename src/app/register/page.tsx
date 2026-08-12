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
  MapPin,
  Check,
  X,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, User } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { DEFAULT_CARTOON_AVATARS } from '@/store/useAuthStore';
import { toast } from 'sonner';

const registerSchema = z
  .object({
    role: z.enum(['CUSTOMER', 'PROVIDER']),
    name: z.string().min(2, 'Full Name must be at least 2 characters'),
    gender: z.string().optional(),
    companyName: z.string().optional(),
    officeAddress: z.string().optional(),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one capital letter')
      .regex(/[a-z]/, 'Password must contain at least one smaller letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .refine((val) => !/\s/.test(val), 'Password must not contain spaces'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const inputClass =
  'w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 transition-colors';
const labelClass = 'text-xs font-bold text-slate-800 dark:text-slate-200';
const errorClass = 'text-xs text-rose-600 font-semibold';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, setAuth } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const destination =
        user.role === 'ADMIN'
          ? '/dashboard/admin'
          : user.role === 'PROVIDER'
          ? '/dashboard/provider'
          : '/dashboard/customer';
      router.push(destination);
    }
  }, [isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'CUSTOMER',
      gender: '',
      companyName: '',
      officeAddress: '',
    },
  });

  const selectedRole = watch('role');
  const passwordValue = watch('password') || '';
  const confirmPasswordValue = watch('confirmPassword') || '';

  // Password Requirement Rules for Live Checklist
  const passwordRules = [
    { label: 'At least 8 characters', met: passwordValue.length >= 8 },
    { label: 'One capital (uppercase) letter', met: /[A-Z]/.test(passwordValue) },
    { label: 'One smaller (lowercase) letter', met: /[a-z]/.test(passwordValue) },
    { label: 'One number', met: /[0-9]/.test(passwordValue) },
    { label: 'No spaces', met: passwordValue.length > 0 && !/\s/.test(passwordValue) },
    {
      label: 'Passwords match',
      met: confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue,
    },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<ApiResponse<User>>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      const registeredUser = response.data?.data;
      toast.success(
        `Welcome ${data.name}! Your ${data.role} account has been created with a random cartoon avatar.`
      );
      router.push('/login');
    } catch {
      // Handled by interceptor
    } finally {
      setIsLoading(false);
    }
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
                  role: selectedRole,
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
                    role: selectedRole,
                  });

                  if (googleRes.data?.data?.user) {
                    const backendUser = googleRes.data.data.user;
                    const backendToken =
                      googleRes.data.data.token || googleRes.data.data.accessToken || '';
                    setAuth(backendUser, backendToken);
                    toast.success(`Registered as ${backendUser.name} (${backendUser.email})`);
                  } else {
                    setAuth(googleUser, 'verified_google_auth');
                    toast.success(`Registered as ${profile.name} (${profile.email})`);
                  }
                } catch {
                  setAuth(googleUser, 'verified_google_auth');
                  toast.success(`Registered as ${profile.name} (${profile.email})`);
                }

                const dest = selectedRole === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/customer';
                router.push(dest);
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
        name: 'Facebook Registered User',
        email: 'facebook.user@gearup.com',
        role: selectedRole,
        status: 'ACTIVE',
        avatarUrl: DEFAULT_CARTOON_AVATARS[2],
      };
      setAuth(mockUser, 'mock_fb_token_jwt');
      toast.success(`Registered with Facebook! Welcome ${mockUser.name}`);
      router.push(selectedRole === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/customer');
    }
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
          {/* Social Sign Up Option */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Quick Social Registration
            </p>
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Clean Centered OR Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              OR
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            {/* Account Type Selector */}
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
              <label htmlFor="register-name" className={labelClass}>
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  {...register('name')}
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="off"
                  className={inputClass}
                />
              </div>
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            {/* Customer Gender Field */}
            {selectedRole === 'CUSTOMER' && (
              <div className="space-y-1.5">
                <label htmlFor="register-gender" className={labelClass}>
                  Gender *
                </label>
                <select
                  {...register('gender')}
                  id="register-gender"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 cursor-pointer"
                >
                  <option value="" disabled>Select Gender *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>
            )}

            {/* Provider Company & Office Address Fields */}
            {selectedRole === 'PROVIDER' && (
              <>
                <div className="space-y-1.5">
                  <label htmlFor="register-company" className={labelClass}>
                    Company / Store Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Store className="w-4 h-4" />
                    </div>
                    <input
                      {...register('companyName')}
                      id="register-company"
                      type="text"
                      placeholder="Apex Outdoor Rentals Ltd."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="register-address" className={labelClass}>
                    Office / Store Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      {...register('officeAddress')}
                      id="register-address"
                      type="text"
                      placeholder="Level 4, Gulshan Avenue, Dhaka"
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className={labelClass}>
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  {...register('email')}
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="off"
                  className={inputClass}
                />
              </div>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className={labelClass}>
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('password')}
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="register-confirm-password" className={labelClass}>
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('confirmPassword')}
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className={errorClass}>{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Live Password Requirement Checklist (Appears when typing) */}
            {passwordValue.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Password Strength Requirements:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {passwordRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-1.5 font-semibold ${
                        rule.met
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {rule.met ? (
                        <Check className="w-3.5 h-3.5 flex-shrink-0 stroke-[3]" />
                      ) : (
                        <X className="w-3.5 h-3.5 flex-shrink-0 stroke-[3]" />
                      )}
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            <Link
              href="/login"
              className="font-bold text-slate-900 dark:text-emerald-400 hover:underline"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
