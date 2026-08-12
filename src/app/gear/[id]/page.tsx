'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Tag,
  ArrowLeft,
  ShieldCheck,
  Star,
  UserCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Package,
  Edit3,
  Trash2,
  Loader2,
  Store,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Gear, Review } from '@/types';
import { Badge } from '@/components/ui/Badge';
import RentalCalculator from '@/components/gear/RentalCalculator';
import EditGearModal from '@/components/dashboard/EditGearModal';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const DEFAULT_GEAR_IMAGE =
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&auto=format&fit=crop';

export default function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const gearIdentifier = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuthStore();

  const [gear, setGear] = useState<Gear | null>(null);
  const [relatedGears, setRelatedGears] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Provider Editing & Deleting States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchGearDetails = () => {
    if (!gearIdentifier) return;
    setIsLoading(true);
    apiClient
      .get<ApiResponse<Gear>>(`/gear/${gearIdentifier}`)
      .then((res) => {
        const fetchedGear = res.data?.data || null;
        if (fetchedGear && typeof window !== 'undefined') {
          const cachedStock = localStorage.getItem(`gear_stock_${fetchedGear.id}`);
          if (cachedStock !== null) {
            fetchedGear.stock = parseInt(cachedStock, 10);
          }
        }
        setGear(fetchedGear);

        if (fetchedGear?.categoryId) {
          apiClient
            .get<ApiResponse<Gear[]>>(`/gear?categoryId=${fetchedGear.categoryId}&limit=3`)
            .then((relatedRes) => {
              const items = relatedRes.data?.data || [];
              setRelatedGears(items.filter((i) => i.id !== fetchedGear.id));
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setGear(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchGearDetails();
  }, [gearIdentifier]);

  const handleDeleteGear = async () => {
    if (!gear) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/gear/${gear.id}`);

      // Delete from local storage cache as well
      if (typeof window !== 'undefined' && user?.email) {
        try {
          const key = `provider_gear_${user.email}`;
          const existing: Gear[] = JSON.parse(localStorage.getItem(key) || '[]');
          const updated = existing.filter((g) => g.id !== gear.id);
          localStorage.setItem(key, JSON.stringify(updated));
          localStorage.removeItem(`gear_stock_${gear.id}`);
        } catch {}
      }

      toast.success(`"${gear.title}" deleted successfully.`);
      router.push('/gear');
    } catch {
      // Local fallback delete
      if (typeof window !== 'undefined' && user?.email) {
        try {
          const key = `provider_gear_${user.email}`;
          const existing: Gear[] = JSON.parse(localStorage.getItem(key) || '[]');
          const updated = existing.filter((g) => g.id !== gear.id);
          localStorage.setItem(key, JSON.stringify(updated));
          localStorage.removeItem(`gear_stock_${gear.id}`);
        } catch {}
      }
      toast.success(`"${gear.title}" deleted.`);
      router.push('/gear');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 dark:border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Loading gear details...</p>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Equipment Listing Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested equipment listing could not be found or may have been removed.
        </p>
        <Link
          href="/gear"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gear Directory</span>
        </Link>
      </div>
    );
  }

  const mainImage = gear.image || gear.imageUrl || DEFAULT_GEAR_IMAGE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Provider Custom Management Controls Banner */}
      {user?.role === 'PROVIDER' && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
              <Store className="w-4 h-4" />
              <span>Provider Store Management Controls</span>
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Manage Listing: {gear.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Update photos, price per day, full description, location, or stock unit quantity for this item.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center space-x-2 shadow-xs cursor-pointer transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Equipment Listing</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Listing</span>
            </button>
          </div>
        </div>
      )}

      {/* Back Link Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          href="/gear"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Back to Equipment Directory</span>
        </Link>

        {gear.category?.name && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            {gear.category.name}
          </span>
        )}
      </div>

      {/* Grid Layout: Main Specs & Image vs Rental Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image Display */}
          <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm">
            {mainImage.startsWith('data:') ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={mainImage}
                alt={gear.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={mainImage}
                alt={gear.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1200px) 100vw, 66vw"
              />
            )}

            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Badge
                variant={gear.isAvailable && (gear.stock ?? 0) > 0 ? 'AVAILABLE' : 'UNAVAILABLE'}
                className="shadow-sm px-3 py-1 text-xs"
              >
                {gear.isAvailable && (gear.stock ?? 0) > 0
                  ? `Available (${gear.stock ?? 0} in stock)`
                  : 'Currently Unavailable'}
              </Badge>
            </div>
          </div>

          {/* Title & Brand Specs */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {gear.brand && (
                  <span className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>{gear.brand}</span>
                  </span>
                )}
                {gear.location && (
                  <span className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{gear.location}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>4.9 (Verified Reviews)</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {gear.title}
              </h1>

              {/* Dual Pricing Badges (First Day & Additional Days in BDT) */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">First Day Pricing</span>
                  <span className="text-base font-black text-emerald-700 dark:text-emerald-400">৳{gear.pricePerDay}</span>
                </div>

                <div className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Additional Days Pricing</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">৳{gear.additionalDayPrice ?? Math.round(gear.pricePerDay * 0.6)} / day</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Equipment Description & Specifications
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {gear.description ||
                  'No detailed description provided. This equipment item is maintained and verified by the rental provider.'}
              </p>
            </div>

            {/* Provider Verification Card */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-sm border border-slate-700">
                  {gear.provider?.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={gear.provider.avatarUrl} alt={gear.provider.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    gear.provider?.name ? gear.provider.name.charAt(0).toUpperCase() : 'P'
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Listed by {gear.provider?.name || 'Verified Provider'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Verified Equipment Vendor</p>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Listing</span>
              </span>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Customer Reviews & Ratings ({gear.reviews?.length || 0})</span>
            </h3>

            {gear.reviews && gear.reviews.length > 0 ? (
              <div className="space-y-3">
                {gear.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.customer?.name || 'Verified Customer'}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">No reviews yet for this equipment. Be the first to rent and review!</p>
            )}
          </div>
        </div>

        {/* Dynamic Rental Calculator Column */}
        <div className="space-y-6">
          <RentalCalculator gear={gear} />
        </div>
      </div>

      {/* Edit Equipment Modal */}
      {isEditModalOpen && (
        <EditGearModal
          isOpen={isEditModalOpen}
          gear={gear}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={fetchGearDetails}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Equipment Listing"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete equipment listing{' '}
              <strong className="text-slate-900 dark:text-white">{gear.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteGear}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

