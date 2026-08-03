'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Dumbbell, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Compass, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const getDashboardHref = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    if (user.role === 'PROVIDER') return '/dashboard/provider';
    return '/dashboard/customer';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-emerald-400 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
              Gear<span className="text-emerald-600">Up</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 inline" />
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold -mt-1">
              Outdoor Rentals
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link
            href="/gear"
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/gear'
                ? 'text-slate-900 bg-slate-100 font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Explore Gear</span>
          </Link>

          {isAuthenticated && (
            <Link
              href={getDashboardHref()}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname.startsWith('/dashboard')
                  ? 'text-slate-900 bg-slate-100 font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Desktop Auth Controls & Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-1.5 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name}
                  </p>
                  <Badge variant={user.role} className="text-[9px] py-0 px-1.5 uppercase tracking-wider">
                    {user.role}
                  </Badge>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="mt-2">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                        Active Role: {user.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={getDashboardHref()}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                    <span>My Dashboard Panel</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-semibold transition-colors border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Burger Menu Button (Visible on all screen sizes) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200 transition-all focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-rose-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Drawer Menu (Toggled by Burger Button) */}
      {isMobileMenuOpen && (
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/gear"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              pathname === '/gear'
                ? 'bg-slate-100 text-slate-900 border border-slate-200'
                : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Explore Equipment</span>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </Link>

          {isAuthenticated && user ? (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500">{user.email}</p>
                </div>
                <Badge variant={user.role} className="text-[9px]">
                  {user.role}
                </Badge>
              </div>

              <Link
                href={getDashboardHref()}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  pathname.startsWith('/dashboard')
                    ? 'bg-slate-100 text-slate-900 border border-slate-200'
                    : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                <span>Dashboard ({user.role})</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all"
              >
                <LogOut className="w-5 h-5 text-rose-600" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2.5">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-slate-800 bg-slate-100 border border-slate-200 hover:bg-slate-200"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
