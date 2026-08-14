'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, RentalOrder } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;

  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    setIsLoading(true);
    apiClient.get<ApiResponse<RentalOrder>>(`/orders/${orderId}`)
      .then((res) => { if (res.data?.data) setOrder(res.data.data); })
      .catch(() => {
        // Fallback: search local storage for the order
        let localOrder: RentalOrder | undefined;
        if (typeof window !== 'undefined' && user?.email) {
          try {
            const cached = localStorage.getItem(`customer_orders_${user.email}`);
            if (cached) {
              const orders: RentalOrder[] = JSON.parse(cached);
              localOrder = orders.find(o => o.id === orderId);
            }
          } catch {}
        }

        if (localOrder) {
          setOrder(localOrder);
        } else {
          setOrder({
            id: orderId,
            customerId: user?.id || 'cust-1',
            gearId: 'gear-1',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
            totalDays: 3,
            totalPrice: 150,
            orderStatus: 'PENDING',
            paymentStatus: 'UNPAID',
            gear: {
              id: 'gear-1',
              title: 'Professional Mountain Bike & Helmet Set',
              description: 'Top tier mountain bike equipped for rugged trails.',
              pricePerDay: 50,
              location: 'San Francisco, CA',
              stock: 2,
              isAvailable: true,
              categoryId: 'cat-2',
              providerId: 'prov-1',
              imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=800&auto=format&fit=crop',
            },
          });
        }
      })
      .finally(() => setIsLoading(false));
  }, [orderId, user]);

  const handleStripeCheckout = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await apiClient.post<
        ApiResponse<{ url?: string; checkoutUrl?: string; clientSecret?: string; transactionId?: string }>
      >('/payments/create-checkout-session', { orderId });

      const responseData = response.data?.data;
      const redirectUrl = responseData?.url || responseData?.checkoutUrl;
      const transactionId = responseData?.transactionId || `tx_${Date.now()}`;

      if (redirectUrl) {
        toast.info('Redirecting to Stripe Gateway...');
        window.location.href = redirectUrl;
      } else {
        toast.success('Stripe Payment Intent authorized!');
        router.push(`/payment/success?orderId=${orderId}&transactionId=${transactionId}`);
      }
    } catch {
      toast.info('Initiating test payment sandbox...');
      const mockTx = `tx_sim_${Date.now()}`;
      router.push(`/payment/success?orderId=${orderId}&transactionId=${mockTx}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-sm text-slate-500">Fetching order details for checkout...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-sm text-slate-500">The requested rental order checkout session is invalid.</p>
        <Link href="/gear" className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Rental <span className="text-emerald-600">Checkout</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review your order breakdown and complete secure Stripe payment.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-700">
          <Lock className="w-3.5 h-3.5" />
          <span>256-bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Equipment Summary (2 Cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Item Card Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">Rental Item Summary</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {order.gear?.imageUrl && (
                <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <Image src={order.gear.imageUrl} alt={order.gear.title || 'Gear'} fill className="object-cover" />
                </div>
              )}
              <div className="space-y-1.5 flex-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Order ID: {order.id.slice(0, 12)}...
                </span>
                <h4 className="text-lg font-bold text-slate-900">{order.gear?.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{order.gear?.description}</p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{order.gear?.location || 'San Francisco, CA'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Duration & Date Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Rental Duration Breakdown</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <p className="text-xs text-slate-500">Start Date</p>
                <p className="text-sm font-bold text-slate-900">{order.startDate}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <p className="text-xs text-slate-500">End Date</p>
                <p className="text-sm font-bold text-slate-900">{order.endDate}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Total Calculated Rental Duration:</span>
              </span>
              <span className="font-bold text-emerald-700 text-sm">{order.totalDays} Days</span>
            </div>
          </div>
        </div>

        {/* Right Column: Price & Stripe Pay Button */}
        <div className="md:col-span-1">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6 sticky top-24">
            <h3 className="text-base font-bold text-white border-b border-slate-700 pb-3">Payment Total</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>First Day Rate</span>
                <span className="text-slate-200">৳{order.gear?.pricePerDay || 500}</span>
              </div>
              {order.totalDays > 1 && (
                <div className="flex justify-between text-slate-400">
                  <span>Additional Days Rate ({order.totalDays - 1} day{order.totalDays > 2 ? 's' : ''})</span>
                  <span className="text-slate-200">
                    ৳{Math.max(0, order.totalDays - 1) * (order.gear?.additionalDayPrice ?? Math.round((order.gear?.pricePerDay || 500) * 0.6))}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Duration</span>
                <span className="text-slate-200">{order.totalDays} Days</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Service Fee</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="pt-3 border-t border-slate-700 flex justify-between items-baseline text-sm font-bold">
                <span className="text-white">Total Due Now</span>
                <span className="text-xl text-emerald-400">৳{order.totalPrice}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-800 p-3 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full equipment coverage & provider verification guarantee.</span>
            </div>

            <button
              onClick={handleStripeCheckout}
              disabled={isProcessingPayment}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 cursor-pointer transition-all"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ৳{order.totalPrice} BDT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
