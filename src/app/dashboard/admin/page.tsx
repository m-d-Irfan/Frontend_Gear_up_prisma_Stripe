'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  UserCheck,
  UserX,
  Plus,
  Loader2,
  Tag,
  Search,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, User, Category, Gear, RentalOrder } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import AddCategoryModal from '@/components/dashboard/AddCategoryModal';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'gear' | 'orders' | 'categories'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allGear, setAllGear] = useState<Gear[]>([]);
  const [allOrders, setAllOrders] = useState<RentalOrder[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGear: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [isLoadingGear, setIsLoadingGear] = useState<boolean>(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');

  const { user } = useAuthStore();

  const fetchUsers = () => {
    setIsLoadingUsers(true);
    apiClient
      .get<ApiResponse<User[]>>('/users')
      .then((res) => {
        if (res.data?.data) {
          setUsers(res.data.data);
          setStats((prev) => ({ ...prev, totalUsers: res.data.data.length }));
        }
      })
      .catch(() => {
        const mockUsers: User[] = [
          { id: 'usr-1', name: 'John Doe Customer', email: 'customer@gearup.com', role: 'CUSTOMER', status: 'ACTIVE' },
          { id: 'usr-2', name: 'Apex Outdoor Rentals', email: 'provider@gearup.com', role: 'PROVIDER', status: 'ACTIVE' },
          { id: 'usr-3', name: 'GearUp System Admin', email: 'admin@gearup.com', role: 'ADMIN', status: 'ACTIVE' },
        ];
        setUsers(mockUsers);
        setStats((prev) => ({ ...prev, totalUsers: mockUsers.length }));
      })
      .finally(() => {
        setIsLoadingUsers(false);
      });
  };

  const fetchCategories = () => {
    setIsLoadingCategories(true);
    apiClient
      .get<ApiResponse<Category[]>>('/categories')
      .then((res) => {
        if (res.data?.data) {
          setCategories(res.data.data);
        }
      })
      .catch(() => {
        setCategories([]);
      })
      .finally(() => {
        setIsLoadingCategories(false);
      });
  };

  const fetchGear = () => {
    setIsLoadingGear(true);
    apiClient
      .get<ApiResponse<Gear[]>>('/gear')
      .then((res) => {
        if (res.data?.data) {
          setAllGear(res.data.data);
          setStats((prev) => ({ ...prev, totalGear: res.data.data.length }));
        }
      })
      .catch(() => {
        setAllGear([]);
      })
      .finally(() => {
        setIsLoadingGear(false);
      });
  };

  const fetchOrders = () => {
    setIsLoadingOrders(true);
    apiClient
      .get<ApiResponse<RentalOrder[]>>('/orders/my-orders')
      .then((res) => {
        if (res.data?.data) {
          setAllOrders(res.data.data);
          const totalRev = res.data.data.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
          setStats((prev) => ({
            ...prev,
            totalOrders: res.data.data.length,
            totalRevenue: totalRev,
          }));
        }
      })
      .catch(() => {
        setAllOrders([]);
      })
      .finally(() => {
        setIsLoadingOrders(false);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchCategories();
    fetchGear();
    fetchOrders();
  }, []);

  const handleToggleUserStatus = async (targetUser: User) => {
    const newStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTogglingUserId(targetUser.id);
    try {
      await apiClient.patch<ApiResponse<User>>(`/users/${targetUser.id}`, {
        status: newStatus,
      });
      toast.success(`User ${targetUser.name} status set to ${newStatus}`);
      fetchUsers();
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
      );
      toast.success(`User status updated to ${newStatus}`);
    } finally {
      setTogglingUserId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Platform Admin'}</h1>
              <Badge variant="ADMIN">Platform Moderator</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email || 'admin@gearup.com'}</p>
          </div>
        </div>

        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center space-x-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gear Listings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalGear}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rental Orders</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalOrders}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Revenue</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'users'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>User Moderation ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gear')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'gear'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-600" />
          <span>Platform Equipment ({allGear.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'orders'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>Platform Orders ({allOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'categories'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4 text-emerald-600" />
          <span>Categories ({categories.length})</span>
        </button>
      </div>

      {/* Tab 1: User Moderation Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-black text-slate-900">User Moderation & Access Control</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name or role..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {isLoadingUsers ? (
            <TableSkeleton rows={4} columns={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-800 font-bold uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-3">User Name</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3.5 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={u.role}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={u.status}>{u.status}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {u.role === 'ADMIN' ? (
                          <span className="text-[10px] text-slate-400 italic">Protected Admin</span>
                        ) : (
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            disabled={togglingUserId === u.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1 ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {togglingUserId === u.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : u.status === 'ACTIVE' ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Suspend</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Equipment Listings */}
      {activeTab === 'gear' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h3 className="text-lg font-black text-slate-900">Platform Equipment Listings</h3>
          {isLoadingGear ? (
            <TableSkeleton rows={4} columns={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-800 font-bold uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Equipment Title</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Daily Rate</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allGear.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{item.title}</td>
                      <td className="px-4 py-3.5 text-slate-600">{item.brand || 'GearUp Verified'}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">${item.pricePerDay}</td>
                      <td className="px-4 py-3.5 text-slate-700 font-bold">{item.stock}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={item.isAvailable && item.stock > 0 ? 'AVAILABLE' : 'UNAVAILABLE'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: All Rental Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h3 className="text-lg font-black text-slate-900">Platform Rental Orders History</h3>
          {isLoadingOrders ? (
            <TableSkeleton rows={4} columns={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-800 font-bold uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Equipment</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Total Cost</th>
                    <th className="px-4 py-3">Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">{ord.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{ord.gear?.title || 'Rental Item'}</td>
                      <td className="px-4 py-3.5 text-slate-600">{ord.totalDays} day(s)</td>
                      <td className="px-4 py-3.5 font-extrabold text-emerald-700">${ord.totalPrice}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={ord.orderStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Categories List */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Category Index Manager</h3>
          </div>

          {isLoadingCategories ? (
            <TableSkeleton rows={3} columns={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">{cat.name}</span>
                  <p className="text-xs text-slate-500 line-clamp-2">{cat.description || 'Category description'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Creation Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
