'use client';

import React, { useEffect, useState } from 'react';
import {
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
  Trash2,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, User, Category, Gear, RentalOrder, UserRole } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import AddCategoryModal from '@/components/dashboard/AddCategoryModal';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'gear' | 'orders' | 'categories' | 'analytics'>('users');
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
  
  // User Moderation States
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
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
        setUsers([]);
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

  // Admin User Status Toggle
  const handleToggleUserStatus = async (targetUser: User) => {
    if (user?.id === targetUser.id) {
      toast.error('You cannot suspend your own admin account');
      return;
    }

    const newStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTogglingUserId(targetUser.id);
    try {
      await apiClient.patch<ApiResponse<User>>(`/users/${targetUser.id}/status`, {
        status: newStatus,
      });
      toast.success(`User ${targetUser.name} status updated to ${newStatus}`);
      fetchUsers();
    } catch {
      // Handled by interceptor
    } finally {
      setTogglingUserId(null);
    }
  };

  // Admin User Role Update
  const handleUpdateUserRole = async (targetUser: User, newRole: UserRole) => {
    if (user?.id === targetUser.id && newRole !== 'ADMIN') {
      toast.error('You cannot revoke your own admin role');
      return;
    }

    setUpdatingRoleId(targetUser.id);
    try {
      await apiClient.patch<ApiResponse<User>>(`/users/${targetUser.id}/role`, {
        role: newRole,
      });
      toast.success(`User ${targetUser.name} role changed to ${newRole}`);
      fetchUsers();
    } catch {
      // Handled by interceptor
    } finally {
      setUpdatingRoleId(null);
    }
  };

  // Admin User Delete Action
  const handleDeleteUserConfirm = async () => {
    if (!deletingUser) return;
    if (user?.id === deletingUser.id) {
      toast.error('You cannot delete your own admin account');
      setDeletingUser(null);
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.delete(`/users/${deletingUser.id}`);
      toast.success(`User ${deletingUser.name} deleted successfully`);
      setDeletingUser(null);
      fetchUsers();
    } catch {
      // Handled by interceptor
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(tabKey) => setActiveTab(tabKey as any)}>
      <div className="space-y-8">
        {/* Admin Header Banner */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              {user?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'A'
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name || 'Platform Admin'}</h1>
                <Badge variant="ADMIN">Platform Moderator</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user?.email || 'admin@gearup.com'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400 dark:text-white" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Overview Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalUsers}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-300">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gear Listings</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalGear}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rental Orders</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalOrders}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Platform Revenue</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1: User Moderation Table */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">User Moderation & Access Control</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name or role..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                />
              </div>
            </div>

            {isLoadingUsers ? (
              <TableSkeleton rows={4} columns={6} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider border-y border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3">User Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                            {u.avatarUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-bold m-auto">{u.name.charAt(0)}</span>
                            )}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="px-4 py-3.5">
                          {/* Role Selection Dropdown */}
                          <select
                            value={u.role}
                            disabled={updatingRoleId === u.id || u.id === user?.id}
                            onChange={(e) => handleUpdateUserRole(u, e.target.value as UserRole)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold px-2 py-1 text-slate-900 dark:text-white cursor-pointer focus:outline-none"
                          >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="PROVIDER">PROVIDER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={u.status}>{u.status}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          {u.id === user?.id ? (
                            <span className="text-[10px] text-slate-400 italic">Current Admin</span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                disabled={togglingUserId === u.id}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1 ${
                                  u.status === 'ACTIVE'
                                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100'
                                }`}
                              >
                                {togglingUserId === u.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : u.status === 'ACTIVE' ? (
                                  <>
                                    <UserX className="w-3 h-3" />
                                    <span>Suspend</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3 h-3" />
                                    <span>Activate</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => setDeletingUser(u)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer inline-flex items-center"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
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

        {/* Tab 2: Analytics & Charts */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Platform Performance Analytics</h3>
            <AnalyticsCharts
              totalRevenue={stats.totalRevenue}
              totalOrders={stats.totalOrders}
              totalGear={stats.totalGear}
              totalUsers={stats.totalUsers}
            />
          </div>
        )}

        {/* Tab 3: Equipment Listings */}
        {activeTab === 'gear' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Platform Equipment Listings</h3>
            {isLoadingGear ? (
              <TableSkeleton rows={4} columns={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider border-y border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3">Equipment Title</th>
                      <th className="px-4 py-3">Brand</th>
                      <th className="px-4 py-3">Daily Rate</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allGear.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{item.title}</td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{item.brand || 'GearUp Verified'}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">${item.pricePerDay}</td>
                        <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-bold">{item.stock}</td>
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

        {/* Tab 4: Platform Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Platform Rental Orders History</h3>
            {isLoadingOrders ? (
              <TableSkeleton rows={4} columns={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider border-y border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Equipment</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Total Cost</th>
                      <th className="px-4 py-3">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">{ord.id.slice(0, 8)}...</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{ord.gear?.title || 'Rental Item'}</td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{ord.totalDays} day(s)</td>
                        <td className="px-4 py-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">${ord.totalPrice}</td>
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

        {/* Tab 5: Categories List */}
        {activeTab === 'categories' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Category Index Manager</h3>
            {isLoadingCategories ? (
              <TableSkeleton rows={3} columns={3} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{cat.name}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{cat.description || 'Category description'}</p>
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

        {/* Delete User Confirmation Modal */}
        <Modal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          title="Confirm User Deletion"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete user <span className="font-bold text-slate-900 dark:text-white">{deletingUser?.name}</span> ({deletingUser?.email})? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUserConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete User</span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

