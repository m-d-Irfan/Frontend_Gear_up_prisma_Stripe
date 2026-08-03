'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Store,
  PackageCheck,
  Plus,
  Loader2,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Gear, RentalOrder, OrderStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton, GearGridSkeleton } from '@/components/ui/LoadingSkeleton';
import AddGearModal from '@/components/dashboard/AddGearModal';
import GearCard from '@/components/gear/GearCard';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function ProviderDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'fulfillment'>('inventory');
  const [providerGear, setProviderGear] = useState<Gear[]>([]);
  const [incomingOrders, setIncomingOrders] = useState<RentalOrder[]>([]);
  const [isLoadingGear, setIsLoadingGear] = useState<boolean>(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const { user } = useAuthStore();

  const fetchProviderInventory = () => {
    setIsLoadingGear(true);
    apiClient
      .get<ApiResponse<Gear[]>>('/gear')
      .then((res) => {
        if (res.data?.data) {
          // Filter provider's gear
          const myGear = res.data.data.filter(
            (g) => g.providerId === user?.id || g.provider?.email === user?.email
          );
          setProviderGear(myGear.length > 0 ? myGear : res.data.data);
        }
      })
      .catch(() => {
        setProviderGear([]);
      })
      .finally(() => {
        setIsLoadingGear(false);
      });
  };

  const fetchIncomingOrders = () => {
    setIsLoadingOrders(true);
    apiClient
      .get<ApiResponse<RentalOrder[]>>('/orders/my-orders')
      .then((res) => {
        if (res.data?.data) {
          setIncomingOrders(res.data.data);
        }
      })
      .catch(() => {
        setIncomingOrders([]);
      })
      .finally(() => {
        setIsLoadingOrders(false);
      });
  };

  useEffect(() => {
    fetchProviderInventory();
    fetchIncomingOrders();
  }, [user]);

  // Handle Status Update (PATCH /orders/:id/status)
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await apiClient.patch<ApiResponse<RentalOrder>>(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      toast.success(`Order status updated to ${newStatus}`);
      fetchIncomingOrders();
    } catch {
      // Error handled by axios interceptor
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Provider Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-black text-2xl shadow-xl shadow-indigo-500/10">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-100">{user?.name || 'Provider'}</h1>
              <Badge variant="PROVIDER">Gear Provider</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300">
            Listings: <strong className="text-indigo-400">{providerGear.length}</strong>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-semibold text-white gradient-btn flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Equipment</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>My Equipment Inventory ({providerGear.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fulfillment')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'fulfillment'
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Order Fulfillment ({incomingOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: Provider Equipment Inventory */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Manage your active rental gear inventory.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white gradient-btn flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Listing</span>
            </button>
          </div>

          {isLoadingGear ? (
            <GearGridSkeleton count={6} />
          ) : providerGear.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providerGear.map((gear) => (
                <GearCard key={gear.id} gear={gear} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
              <Store className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-200">No Gear Listed Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Start listing your sports equipment to begin receiving rental orders from customers.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-btn"
              >
                List Your First Item
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Order Fulfillment Table */}
      {activeTab === 'fulfillment' && (
        <div className="space-y-6">
          {isLoadingOrders ? (
            <TableSkeleton rows={4} columns={6} />
          ) : incomingOrders.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Order Reference</th>
                    <th className="px-6 py-4">Rental Duration</th>
                    <th className="px-6 py-4">Revenue</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4 text-right">Update Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {incomingOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-200">
                        {ord.id}
                      </td>
                      <td className="px-6 py-4">
                        <p>{ord.startDate} to {ord.endDate}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          ({ord.totalDays} day{ord.totalDays > 1 ? 's' : ''})
                        </p>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">
                        ${ord.totalPrice}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ord.orderStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ord.paymentStatus} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          disabled={updatingOrderId === ord.id}
                          value={ord.orderStatus}
                          onChange={(e) =>
                            handleUpdateStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PICKED_UP">PICKED_UP</option>
                          <option value="RETURNED">RETURNED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
              <PackageCheck className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-200">No Rental Orders Received</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Customer reservations for your gear will appear here for status management.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Gear Modal */}
      <AddGearModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchProviderInventory();
        }}
      />
    </div>
  );
}
