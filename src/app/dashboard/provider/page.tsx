'use client';

import React, { useEffect, useState } from 'react';
import {
  Store,
  Plus,
  Loader2,
  Package,
  ShoppingBag,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, Gear, RentalOrder, OrderStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton, GearGridSkeleton } from '@/components/ui/LoadingSkeleton';
import AddGearModal from '@/components/dashboard/AddGearModal';
import GearCard from '@/components/gear/GearCard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

type ProviderTab = 'overview' | 'listings' | 'inventory' | 'orders' | 'fulfillment' | 'analytics';

export default function ProviderDashboardPage() {
  const [activeTab, setActiveTab] = useState<ProviderTab>('overview');
  const [providerGear, setProviderGear] = useState<Gear[]>([]);
  const [incomingOrders, setIncomingOrders] = useState<RentalOrder[]>([]);
  const [isLoadingGear, setIsLoadingGear] = useState<boolean>(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Filters & Pagination
  const [gearSearchTerm, setGearSearchTerm] = useState<string>('');
  const [gearPage, setGearPage] = useState<number>(1);

  const [orderSearchTerm, setOrderSearchTerm] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderPage, setOrderPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const { user } = useAuthStore();

  const fetchProviderInventory = () => {
    setIsLoadingGear(true);
    apiClient
      .get<ApiResponse<Gear[]>>('/gear')
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
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order #${orderId.slice(-6)} updated to ${newStatus}`);
      setIncomingOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch {
      setIncomingOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      toast.success(`Order status updated to ${newStatus}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const totalEarned = incomingOrders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  // Filtered Gear
  const filteredGear = providerGear.filter((g) =>
    g.title.toLowerCase().includes(gearSearchTerm.toLowerCase()) ||
    (g.brand && g.brand.toLowerCase().includes(gearSearchTerm.toLowerCase()))
  );
  const totalGearPages = Math.ceil(filteredGear.length / ITEMS_PER_PAGE) || 1;
  const paginatedGear = filteredGear.slice(
    (gearPage - 1) * ITEMS_PER_PAGE,
    gearPage * ITEMS_PER_PAGE
  );

  // Filtered Orders
  const filteredOrders = incomingOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (o.gear?.title && o.gear.title.toLowerCase().includes(orderSearchTerm.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalOrderPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ITEMS_PER_PAGE,
    orderPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(tabKey) => setActiveTab(tabKey as ProviderTab)}>
      <div className="space-y-8">
        {/* Profile Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {user?.name || 'Equipment Provider'}
                </h1>
                <Badge variant="PROVIDER">Store Owner</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage your equipment inventory, update rental availability, and process customer fulfillment.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold hover:bg-slate-800 flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Equipment</span>
          </button>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Listed Equipment
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{providerGear.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-300">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Incoming Orders
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{incomingOrders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Earned Revenue
              </p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ${totalEarned.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Listings Rate
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {providerGear.filter((g) => g.isAvailable && (g.stock ?? 0) > 0).length} / {providerGear.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1 & Overview: Listings View */}
        {(activeTab === 'listings' || activeTab === 'inventory' || activeTab === 'overview') && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  My Store Equipment Catalog
                </h3>
                
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search my equipment listings..."
                    value={gearSearchTerm}
                    onChange={(e) => {
                      setGearSearchTerm(e.target.value);
                      setGearPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {isLoadingGear ? (
                <GearGridSkeleton count={3} />
              ) : paginatedGear.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedGear.map((gearItem) => (
                    <GearCard key={gearItem.id} gear={gearItem} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">
                  No equipment listings matching search criteria.
                </p>
              )}

              {/* Pagination Controls */}
              {totalGearPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <p className="text-slate-500 font-semibold">
                    Showing {(gearPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                    {Math.min(gearPage * ITEMS_PER_PAGE, filteredGear.length)} of {filteredGear.length} listings
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={gearPage === 1}
                      onClick={() => setGearPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Page {gearPage} of {totalGearPages}
                    </span>
                    <button
                      disabled={gearPage === totalGearPages}
                      onClick={() => setGearPage((p) => Math.min(totalGearPages, p + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Fulfillment */}
        {(activeTab === 'orders' || activeTab === 'fulfillment') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Customer Rental Orders & Fulfillment
              </h3>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-grow sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search order ID or equipment..."
                    value={orderSearchTerm}
                    onChange={(e) => {
                      setOrderSearchTerm(e.target.value);
                      setOrderPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => {
                    setOrderStatusFilter(e.target.value);
                    setOrderPage(1);
                  }}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PICKED_UP">PICKED_UP</option>
                  <option value="RETURNED">RETURNED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {isLoadingOrders ? (
              <TableSkeleton rows={4} columns={6} />
            ) : paginatedOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Equipment</th>
                      <th className="px-6 py-4">Rental Duration</th>
                      <th className="px-6 py-4">Payout Amount</th>
                      <th className="px-6 py-4">Order Status</th>
                      <th className="px-6 py-4 text-right">Update Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{ord.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{ord.gear?.title || 'Rental Gear'}</td>
                        <td className="px-6 py-4">{ord.startDate} → {ord.endDate}</td>
                        <td className="px-6 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">${ord.totalPrice}</td>
                        <td className="px-6 py-4"><Badge variant={ord.orderStatus} /></td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={ord.orderStatus}
                            disabled={updatingOrderId === ord.id}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PICKED_UP">PICKED UP</option>
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
              <p className="text-xs text-slate-500 text-center py-6">No orders found.</p>
            )}

            {/* Pagination Controls */}
            {totalOrderPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <p className="text-slate-500 font-semibold">
                  Showing {(orderPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(orderPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={orderPage === 1}
                    onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Page {orderPage} of {totalOrderPages}
                  </span>
                  <button
                    disabled={orderPage === totalOrderPages}
                    onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Analytics */}
        {(activeTab === 'analytics' || activeTab === 'overview') && (
          <AnalyticsCharts
            totalRevenue={totalEarned}
            totalOrders={incomingOrders.length}
            totalUsers={providerGear.length}
          />
        )}
      </div>

      {/* Add Equipment Listing Modal */}
      <AddGearModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGearAdded={fetchProviderInventory}
      />
    </DashboardLayout>
  );
}
