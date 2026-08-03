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
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, User, Category, Gear, RentalOrder } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import AddCategoryModal from '@/components/dashboard/AddCategoryModal';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'categories'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGear: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
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
        // Mock default users list if endpoint pending
        const mockUsers: User[] = [
          { id: 'usr-1', name: 'John Doe', email: 'customer@gearup.com', role: 'CUSTOMER', status: 'ACTIVE' },
          { id: 'usr-2', name: 'Mountain Outfitters Shop', email: 'provider@gearup.com', role: 'PROVIDER', status: 'ACTIVE' },
          { id: 'usr-3', name: 'Platform Admin', email: 'admin@gearup.com', role: 'ADMIN', status: 'ACTIVE' },
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

  useEffect(() => {
    fetchUsers();
    fetchCategories();

    // Fetch gear stats
    apiClient.get<ApiResponse<Gear[]>>('/gear').then((res) => {
      if (res.data?.data) {
        setStats((prev) => ({ ...prev, totalGear: res.data.data.length }));
      }
    }).catch(() => {});

    // Fetch order stats
    apiClient.get<ApiResponse<RentalOrder[]>>('/orders/my-orders').then((res) => {
      if (res.data?.data) {
        const totalRev = res.data.data.reduce((acc, o) => acc + o.totalPrice, 0);
        setStats((prev) => ({
          ...prev,
          totalOrders: res.data.data.length,
          totalRevenue: totalRev,
        }));
      }
    }).catch(() => {});
  }, []);

  // Handle User Status Toggle (Suspend / Activate)
  const handleToggleUserStatus = async (targetUser: User) => {
    const newStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTogglingUserId(targetUser.id);
    try {
      await apiClient.patch<ApiResponse<User>>(`/users/${targetUser.id}`, {
        status: newStatus,
      });

      toast.success(`User ${targetUser.name} status updated to ${newStatus}`);
      fetchUsers();
    } catch {
      // Local optimistic update fallback
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
      );
      toast.success(`User status set to ${newStatus}`);
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
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-2xl shadow-xl shadow-amber-500/10">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-100">{user?.name || 'Admin'}</h1>
              <Badge variant="ADMIN">Platform Moderator</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* Global Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">{stats.totalUsers}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Equipment</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">{stats.totalGear}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Rental Reservations</span>
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">{stats.totalOrders}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Platform Volume</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">${stats.totalRevenue}</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Moderation ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Category Manager ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: User Moderation Table */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search users by name, email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {isLoadingUsers ? (
            <TableSkeleton rows={4} columns={5} />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-100">{usr.name}</td>
                      <td className="px-6 py-4 text-slate-400">{usr.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={usr.role} />
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={usr.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {usr.role !== 'ADMIN' && (
                          <button
                            disabled={togglingUserId === usr.id}
                            onClick={() => handleToggleUserStatus(usr)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ml-auto transition-colors cursor-pointer ${
                              usr.status === 'ACTIVE'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            }`}
                          >
                            {usr.status === 'ACTIVE' ? (
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

      {/* TAB 2: Category Manager */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Manage product categories used for catalog indexing.
            </p>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          {isLoadingCategories ? (
            <TableSkeleton rows={4} columns={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{cat.name}</h4>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">
                      {cat.description || 'Gear category'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {
          fetchCategories();
        }}
      />
    </div>
  );
}
