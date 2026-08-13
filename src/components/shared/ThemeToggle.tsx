'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export default function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  const applyTheme = (t: 'light' | 'dark') => {
    setTheme(t);
    localStorage.setItem('gearup_theme', t);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(t);
    document.documentElement.setAttribute('data-theme', t);
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('gearup_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs flex items-center space-x-2 text-xs font-bold"
      aria-label="Toggle Theme Mode"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4 text-slate-700" />
          {showLabel && <span>Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          {showLabel && <span>Light Mode</span>}
        </>
      )}
    </button>
  );
}
