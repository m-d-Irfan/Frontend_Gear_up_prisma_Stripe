'use client';

import React, { useEffect, useState } from 'react';
import {
  Store,
  PackageCheck,
  Plus,
  Loader2,
  Package,
  ShoppingBag,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Gear, RentalOrder, OrderStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton, GearGridSkeleton } from '@/components/ui/LoadingSkeleton';
import AddGearModal from '@/components/dashboard/AddGearModal';
import GearCard from '@/components/gear/GearCard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function ProviderDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'fulfillment' | 'overview' | 'listings' | 'orders' | 'analytics'>('inventory');
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
      .catch(() => {
        setProviderGear([]);
      })
      .finally(() => {
        setIsLoadingGear(false);
      });
  };

  const fetchIncomingOrders = () => {
    setIsLoadingOrders(true);
    apiClient.get<ApiResponse<RentalOrder[]>>('/orders/my-orders')
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
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await apiClient.patch<ApiResponse<RentalOrder>>(`/orders/${orderId}/status`, {
        orderStatus: status,
      });
      toast.success(`Order #${orderId.slice(0, 8)} status updated to ${status}`);
      fetchIncomingOrders();
    } catch {
      // Handled by interceptor
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(t) => setActiveTab(t as any)}>
      <div className="space-y-8">
        {/* Provider Profile Header */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              {user?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'P'
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name || 'Equipment Provider Store'}</h1>
                <Badge variant="PROVIDER">Verified Vendor</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user?.email || 'provider@gearup.com'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400 dark:text-white" />
            <span>List New Equipment</span>
          </button>
        </div>

        {/* Equipment Inventory Grid */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Active Inventory Listings</h3>
          {isLoadingGear ? (
            <GearGridSkeleton count={3} />
          ) : providerGear.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providerGear.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">No equipment items listed in inventory yet.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600"
              >
                List Equipment Now
              </button>
            </div>
          )}
        </div>
        {/* Incoming Orders Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Incoming Rental Orders</h3>
          {isLoadingOrders ? (
            <TableSkeleton rows={4} columns={6} />
          ) : incomingOrders.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Rental Period</th>
                      <th className="px-6 py-4">Revenue</th>
                      <th className="px-6 py-4">Current Status</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {incomingOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{ord.id.slice(0, 12)}...</td>
                        <td className="px-6 py-4">
                          <p className="text-slate-700 dark:text-slate-300">{ord.startDate} → {ord.endDate}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">({ord.totalDays} day{ord.totalDays > 1 ? 's' : ''})</p>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">${ord.totalPrice}</td>
                        <td className="px-6 py-4"><Badge variant={ord.orderStatus} /></td>
                        <td className="px-6 py-4"><Badge variant={ord.paymentStatus} /></td>
                        <td className="px-6 py-4 text-right">
                          <select
                            disabled={updatingOrderId === ord.id}
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 cursor-pointer disabled:opacity-50"
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
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <PackageCheck className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Rental Orders Received</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Customer reservations for your gear will appear here for status management.</p>
            </div>
          )}
        </div>

      </div>

      <AddGearModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProviderInventory}
      />
    </DashboardLayout>
  );
}
