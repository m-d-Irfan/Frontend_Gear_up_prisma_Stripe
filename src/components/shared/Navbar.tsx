'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Dumbbell, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Compass, 
  Search,
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
    <header className="sticky top-0 z-50 w-full glass-nav border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-all">
            <Dumbbell className="w-5 h-5 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
              Gear<span className="gradient-text">Up</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 inline" />
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
              Outdoor Rentals
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link
            href="/gear"
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/gear'
                ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Explore Gear</span>
          </Link>

          {isAuthenticated && (
            <Link
              href={getDashboardHref()}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith('/dashboard')
                  ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
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
                className="flex items-center space-x-3 p-1.5 pr-3 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer shadow-md"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-sm shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-100 leading-tight">
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
                <div className="absolute right-0 mt-2 w-60 rounded-2xl glass-card bg-slate-950/95 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-2xl">
                  <div className="px-4 py-3 border-b border-slate-800/80">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2">
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active Role: {user.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={getDashboardHref()}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>My Dashboard Panel</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-800/80 mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-btn shadow-lg shadow-emerald-500/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Burger / Hamburger Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:text-white hover:border-emerald-500/40 transition-all focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-rose-400" />
            ) : (
              <Menu className="w-6 h-6 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-card bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/gear"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/gear'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-200 bg-slate-900/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Explore Equipment</span>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </Link>

          {isAuthenticated && user ? (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="px-4 py-2 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-400">{user.email}</p>
                </div>
                <Badge variant={user.role} className="text-[9px]">
                  {user.role}
                </Badge>
              </div>

              <Link
                href={getDashboardHref()}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  pathname.startsWith('/dashboard')
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-200 bg-slate-900/60 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                <span>Dashboard ({user.role})</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
              >
                <LogOut className="w-5 h-5 text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800/80 flex flex-col space-y-2.5">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-white gradient-btn shadow-lg shadow-emerald-500/25"
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
