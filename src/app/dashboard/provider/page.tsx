'use client';

import React, { useEffect, useState } from 'react';
import {
  Store,
  PackageCheck,
  Plus,
  Loader2,
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
    apiClient.get<ApiResponse<Gear[]>>('/gear')
      .then((res) => {
        if (res.data?.data) {
          const myGear = res.data.data.filter(
            (g) => g.providerId === user?.id || g.provider?.email === user?.email
          );
          setProviderGear(myGear.length > 0 ? myGear : res.data.data);
        }
      })
      .catch(() => setProviderGear([]))
      .finally(() => setIsLoadingGear(false));
  };

  const fetchIncomingOrders = () => {
    setIsLoadingOrders(true);
    apiClient.get<ApiResponse<RentalOrder[]>>('/orders/my-orders')
      .then((res) => { if (res.data?.data) setIncomingOrders(res.data.data); })
      .catch(() => setIncomingOrders([]))
      .finally(() => setIsLoadingOrders(false));
  };

  useEffect(() => {
    fetchProviderInventory();
    fetchIncomingOrders();
  }, [user]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await apiClient.patch<ApiResponse<RentalOrder>>(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchIncomingOrders();
    } catch {
      // Handled by axios interceptor
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Provider Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Provider'}</h1>
              <Badge variant="PROVIDER">Gear Provider</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold">
            Listings: <strong className="text-indigo-700">{providerGear.length}</strong>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center space-x-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>List New Equipment</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'inventory' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4 text-emerald-600" />
          <span>My Equipment Inventory ({providerGear.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fulfillment')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'fulfillment' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <PackageCheck className="w-4 h-4 text-emerald-600" />
          <span>Order Fulfillment ({incomingOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: Inventory Grid */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Manage your active rental gear inventory.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Listing</span>
            </button>
          </div>

          {isLoadingGear ? (
            <GearGridSkeleton count={6} />
          ) : providerGear.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providerGear.map((gear) => <GearCard key={gear.id} gear={gear} />)}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <Store className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Gear Listed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Start listing your sports equipment to begin receiving rental orders from customers.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Order Reference</th>
                      <th className="px-6 py-4">Rental Duration</th>
                      <th className="px-6 py-4">Revenue</th>
                      <th className="px-6 py-4">Current Status</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {incomingOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{ord.id.slice(0, 12)}...</td>
                        <td className="px-6 py-4">
                          <p className="text-slate-700">{ord.startDate} → {ord.endDate}</p>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">({ord.totalDays} day{ord.totalDays > 1 ? 's' : ''})</p>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-emerald-700">${ord.totalPrice}</td>
                        <td className="px-6 py-4"><Badge variant={ord.orderStatus} /></td>
                        <td className="px-6 py-4"><Badge variant={ord.paymentStatus} /></td>
                        <td className="px-6 py-4 text-right">
                          <select
                            disabled={updatingOrderId === ord.id}
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer disabled:opacity-50"
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
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <PackageCheck className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Rental Orders Received</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Customer reservations for your gear will appear here for status management.</p>
            </div>
          )}
        </div>
      )}

      <AddGearModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProviderInventory}
      />
    </div>
  );
}
