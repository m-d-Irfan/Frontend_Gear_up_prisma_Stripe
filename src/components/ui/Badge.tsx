import React from 'react';
import { clsx } from 'clsx';
import { OrderStatus, PaymentStatus, UserRole, UserStatus } from '@/types';

type BadgeVariant = OrderStatus | PaymentStatus | UserRole | UserStatus | 'AVAILABLE' | 'UNAVAILABLE' | 'DEFAULT';

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  // Order Statuses
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  PICKED_UP: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  RETURNED: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',

  // Payment Statuses
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  UNPAID: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',

  // User Roles
  CUSTOMER: 'bg-sky-50 text-sky-700 border-sky-200 font-semibold',
  PROVIDER: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold',
  ADMIN: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',

  // User Statuses
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  SUSPENDED: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',

  // Gear Availability
  AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  UNAVAILABLE: 'bg-slate-100 text-slate-600 border-slate-200 font-semibold',

  DEFAULT: 'bg-slate-100 text-slate-700 border-slate-200 font-semibold',
};

export function Badge({ variant, children, className }: BadgeProps) {
  const style = variantStyles[variant] || variantStyles.DEFAULT;

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border transition-colors',
        style,
        className
      )}
    >
      {children || variant}
    </span>
  );
}

export default Badge;
