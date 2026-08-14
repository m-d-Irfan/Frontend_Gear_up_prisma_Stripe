import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/providers/AuthProvider';
import { AppDataProvider } from '@/context/AppDataContext';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ApiResponse, Category, Gear, LocationItem } from '@/types';
import { SEEDED_GEAR_CATALOG } from '@/data/gearCatalog';
import { fetchGlobalAppData } from '@/lib/appDataFetcher';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GrabGear | Rent Sports & Outdoor Equipment Instantly in Bangladesh',
  description:
    'GrabGear is Bangladesh’s premier peer-to-peer sports & outdoor equipment rental marketplace. Rent kayaks, mountain bikes, camping gear, and climbing equipment securely with instant Stripe payment.',
  keywords: [
    'GrabGear',
    'sports rental Bangladesh',
    'outdoor gear rental',
    'camping equipment Dhaka',
    'bike rental Sylhet',
    'kayak rental Coxs Bazar',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

// Next.js config to ensure the layout is dynamic so it fetches real-time data
export const dynamic = 'force-dynamic';

// Using shared fetchGlobalAppData instead of duplicated code

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await fetchGlobalAppData();

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('gearup_theme');
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-700 transition-colors duration-300`}
      >
        <AuthProvider>
          <AppDataProvider initialData={initialData}>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              richColors
              theme="light"
              closeButton
              toastOptions={{
                style: {
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                },
              }}
            />
          </AppDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
