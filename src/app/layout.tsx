import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/providers/AuthProvider';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GearUp | Rent Sports & Outdoor Equipment Instantly',
  description:
    'GearUp is a premier peer-to-peer equipment rental marketplace. Rent bikes, camping gear, skis, and outdoor gear securely with instant Stripe payment.',
  keywords: [
    'sports rental',
    'outdoor gear',
    'camping equipment',
    'bike rental',
    'GearUp',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-700 transition-colors duration-300`}
      >
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
