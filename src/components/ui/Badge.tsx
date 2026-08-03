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
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PICKED_UP: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  RETURNED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CANCELLED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',

  // Payment Statuses
  PAID: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  UNPAID: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',

  // User Roles
  CUSTOMER: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  PROVIDER: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  ADMIN: 'bg-amber-500/10 text-amber-300 border-amber-500/20 font-bold',

  // User Statuses
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  SUSPENDED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',

  // Gear Availability
  AVAILABLE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  UNAVAILABLE: 'bg-slate-500/10 text-slate-400 border-slate-500/20',

  DEFAULT: 'bg-slate-800 text-slate-300 border-slate-700',
};

export function Badge({ variant, children, className }: BadgeProps) {
  const style = variantStyles[variant] || variantStyles.DEFAULT;

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        style,
        className
      )}
    >
      {children || variant}
    </span>
  );
}

export default Badge;
