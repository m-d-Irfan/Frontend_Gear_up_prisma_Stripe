'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Tag, ArrowRight, Star, Edit3, Trash2, X, Check, Package, AlertTriangle } from 'lucide-react';
import { Gear } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

interface GearCardProps {
  gear: Gear;
  onEdit?: (gear: Gear) => void;
  onDelete?: (gear: Gear) => void;
  isProvider?: boolean;
}

export default function GearCard({ gear, onEdit: onEditProp, onDelete: onDeleteProp, isProvider: isProviderProp }: GearCardProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const isProvider = isProviderProp ?? (user?.role === 'PROVIDER' || Boolean(onEditProp));
  const canManage = isAdmin || isProvider;

  const [displayGear, setDisplayGear] = useState<Gear>(() => {
    let item = { ...gear };
    if (typeof window !== 'undefined') {
      try {
        const cachedItem = localStorage.getItem(`gear_item_${gear.id}`);
        if (cachedItem) {
          item = { ...item, ...JSON.parse(cachedItem) };
        }
        const cachedStock = localStorage.getItem(`gear_stock_${gear.id}`);
        if (cachedStock !== null) {
          item.stock = Math.max(0, Number(cachedStock));
        }
      } catch {}
    }
    return item;
  });

  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(displayGear.title);
  const [editBrand, setEditBrand] = useState(displayGear.brand || '');
  const [editPrice, setEditPrice] = useState(displayGear.pricePerDay);
  const [editAddPrice, setEditAddPrice] = useState(displayGear.additionalDayPrice || Math.round(displayGear.pricePerDay * 0.6));
  const [editStock, setEditStock] = useState(displayGear.stock ?? 5);
  const [editLocation, setEditLocation] = useState(displayGear.location || 'Dhaka');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const deletedFlag = localStorage.getItem(`gear_deleted_${gear.id}`);
        const deletedList: string[] = JSON.parse(localStorage.getItem('deleted_gear_ids') || '[]');
        if (deletedFlag === 'true' || deletedList.includes(gear.id)) {
          setIsDeleted(true);
        }
      } catch {}
    }
  }, [gear.id]);

  const handleDelete = () => {
    if (onDeleteProp) {
      onDeleteProp(gear);
    }
    setIsDeleted(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gear_deleted_${gear.id}`, 'true');
        const deletedList: string[] = JSON.parse(localStorage.getItem('deleted_gear_ids') || '[]');
        if (!deletedList.includes(gear.id)) {
          deletedList.push(gear.id);
          localStorage.setItem('deleted_gear_ids', JSON.stringify(deletedList));
        }
      } catch {}
    }
    toast.success(`"${displayGear.title}" deleted successfully.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Gear = {
      ...displayGear,
      title: editTitle,
      brand: editBrand,
      pricePerDay: editPrice,
      additionalDayPrice: editAddPrice,
      stock: editStock,
      location: editLocation,
    };
    setDisplayGear(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gear_item_${gear.id}`, JSON.stringify(updated));
        localStorage.setItem(`gear_stock_${gear.id}`, editStock.toString());
      } catch {}
    }
    if (onEditProp) {
      onEditProp(updated);
    }
    setIsEditing(false);
    toast.success('Equipment updated successfully!');
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop';
  const displayImage = displayGear.image || displayGear.imageUrl || fallbackImage;
  const stock = displayGear.stock ?? 0;
  const isAvailable = Boolean(displayGear.isAvailable) && stock > 0;

  if (isDeleted) return null;

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative">
        
        {/* Image Container with Dynamic Stock & Admin Controls */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {displayImage.startsWith('data:') ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={displayImage}
              alt={displayGear.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Image
              src={displayImage}
              alt={displayGear.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Category Pill */}
          {displayGear.category?.name && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
                {displayGear.category.name}
              </span>
            </div>
          )}

          {/* Stock Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}>
              {isAvailable ? `${stock} Available` : 'Out of Stock'}
            </Badge>
          </div>

          {/* Admin / Provider Action Bar (Always Visible for Admin & Provider) */}
          {canManage && (
            <div className="absolute bottom-3 right-3 z-20 flex items-center space-x-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onEditProp) onEditProp(displayGear);
                  else setIsEditing(true);
                }}
                className="p-1.5 text-slate-200 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 text-xs font-bold"
                title="Edit Equipment Listing"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Edit</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="p-1.5 text-slate-200 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 text-xs font-bold"
                title="Delete Listing"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline text-[11px] text-rose-400">Delete</span>
              </button>
            </div>
          )}

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md dark:bg-slate-950/95 text-white p-2.5 rounded-2xl shadow-xl border border-white/10 space-y-0.5">
            <div className="flex items-baseline space-x-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">From</span>
              <span className="text-sm font-black text-emerald-400">৳{Number(displayGear.pricePerDay)}</span>
              <span className="text-[10px] text-slate-300">first night</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-300 flex items-center space-x-1">
              <span className="text-white font-bold">৳{displayGear.additionalDayPrice ?? Math.round(displayGear.pricePerDay * 0.6)}</span>
              <span>/ additional night</span>
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Title & Brand */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {displayGear.brand || 'GrabGear Verified'}
              </span>
              {displayGear.location && (
                <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[100px]">{displayGear.location}</span>
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {displayGear.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {displayGear.description || 'Premium quality rental equipment thoroughly inspected and prepped for outdoor adventure.'}
            </p>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>4.9 (Verified)</span>
            </div>

            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            ) : user?.role === 'PROVIDER' ? (
              gear.providerId === user?.id ||
              gear.providerId === user?.email ||
              (gear.provider?.email && gear.provider.email.toLowerCase() === user?.email?.toLowerCase()) ||
              isProviderProp ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Item</span>
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-lg cursor-not-allowed border border-slate-200 dark:border-slate-700"
                >
                  <span>Rent (Providers N/A)</span>
                </button>
              )
            ) : (
              <Link
                href={`/gear/${gear.slug || gear.id}`}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/btn"
              >
                <span>Rent Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Admin Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Equipment?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">"{displayGear.title}"</span>? This item will be permanently removed from listings.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Inline Edit Equipment Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Equipment Details</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Equipment Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Brand Name</label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Location District</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">First Night (৳)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Add. Night (৳)</label>
                  <input
                    type="number"
                    value={editAddPrice}
                    onChange={(e) => setEditAddPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Stock Count</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center space-x-1 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
