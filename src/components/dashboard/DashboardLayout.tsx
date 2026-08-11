'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Tag,
  BarChart3,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Plus,
  Compass,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  activeTabKey?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
}

export default function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Authentication required to access dashboard');
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Authentication Required. Redirecting...</p>
      </div>
    );
  }

  // Customer Menu Items (4 items)
  const customerNavItems: SidebarNavItem[] = [
    { title: 'Overview & Orders', href: '/dashboard/customer', icon: <LayoutDashboard className="w-4 h-4" />, activeTabKey: 'orders' },
    { title: 'My Reviews', href: '/dashboard/customer', icon: <ShoppingBag className="w-4 h-4" />, activeTabKey: 'reviews' },
    { title: 'Browse Gear', href: '/gear', icon: <Compass className="w-4 h-4" /> },
    { title: 'Edit Profile & Avatar', href: '/dashboard/profile', icon: <User className="w-4 h-4" /> },
  ];

  // Provider Menu Items (6 items)
  const providerNavItems: SidebarNavItem[] = [
    { title: 'Dashboard Overview', href: '/dashboard/provider', icon: <LayoutDashboard className="w-4 h-4" />, activeTabKey: 'overview' },
    { title: 'My Equipment Listings', href: '/dashboard/provider', icon: <Package className="w-4 h-4" />, activeTabKey: 'listings' },
    { title: 'Customer Orders', href: '/dashboard/provider', icon: <ShoppingBag className="w-4 h-4" />, activeTabKey: 'orders' },
    { title: 'Earnings & Analytics', href: '/dashboard/provider', icon: <BarChart3 className="w-4 h-4" />, activeTabKey: 'analytics' },
    { title: 'Browse Directory', href: '/gear', icon: <Compass className="w-4 h-4" /> },
    { title: 'Edit Profile & Avatar', href: '/dashboard/profile', icon: <User className="w-4 h-4" /> },
  ];

  // Admin Menu Items (7 items)
  const adminNavItems: SidebarNavItem[] = [
    { title: 'Dashboard Overview', href: '/dashboard/admin', icon: <LayoutDashboard className="w-4 h-4" />, activeTabKey: 'users' },
    { title: 'User Moderation', href: '/dashboard/admin', icon: <Users className="w-4 h-4" />, activeTabKey: 'users' },
    { title: 'Platform Equipment', href: '/dashboard/admin', icon: <Package className="w-4 h-4" />, activeTabKey: 'gear' },
    { title: 'Platform Orders', href: '/dashboard/admin', icon: <ShoppingBag className="w-4 h-4" />, activeTabKey: 'orders' },
    { title: 'Category Index', href: '/dashboard/admin', icon: <Tag className="w-4 h-4" />, activeTabKey: 'categories' },
    { title: 'Platform Analytics', href: '/dashboard/admin', icon: <BarChart3 className="w-4 h-4" />, activeTabKey: 'analytics' },
    { title: 'Edit Profile & Avatar', href: '/dashboard/profile', icon: <User className="w-4 h-4" /> },
  ];

  const getNavItems = () => {
    if (user?.role === 'ADMIN') return adminNavItems;
    if (user?.role === 'PROVIDER') return providerNavItems;
    return customerNavItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-16 z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {user?.role} Dashboard Menu
          </span>
        </div>
        <Badge variant={user?.role || 'CUSTOMER'}>{user?.role}</Badge>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 sm:p-6 sticky top-16 h-[calc(100vh-4rem)] z-30 transition-all ${
          isSidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-700 text-white overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
              <Badge variant={user?.role || 'CUSTOMER'} className="text-[8px] px-1.5 py-0">
                {user?.role}
              </Badge>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-3 mb-2">
              Dashboard Navigation
            </p>
            {navItems.map((item, idx) => {
              const isCurrentRoute = pathname === item.href;
              const isCurrentTab = activeTab && item.activeTabKey === activeTab;
              const isActive = isCurrentRoute || isCurrentTab;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.activeTabKey && onTabChange) {
                      onTabChange(item.activeTabKey);
                    }
                    if (pathname !== item.href) {
                      router.push(item.href);
                    }
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Control */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
