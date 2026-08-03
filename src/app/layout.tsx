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
    <html lang="en" className="light">
      <body
        className={`${inter.variable} font-sans bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-700`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            richColors
            theme="dark"
            closeButton
            toastOptions={{
              style: {
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
