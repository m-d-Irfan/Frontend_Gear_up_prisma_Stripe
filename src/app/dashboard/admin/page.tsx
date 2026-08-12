'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Loader2,
  Tag,
  Search,
  Trash2,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ApiResponse, User, Category, Gear, RentalOrder, UserRole, LocationItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import AddCategoryModal from '@/components/dashboard/AddCategoryModal';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

import EditCategoryModal from '@/components/dashboard/EditCategoryModal';
import EditGearModal from '@/components/dashboard/EditGearModal';
import { Edit3, MapPin } from 'lucide-react';

type AdminTab = 'overview' | 'users' | 'gear' | 'orders' | 'categories' | 'locations' | 'analytics';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
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

  // Category Editing & Deleting
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState<boolean>(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState<boolean>(false);

  // Location Management States
  const [locations, setLocations] = useState<LocationItem[]>([
    { id: 'loc-1', name: 'Dhaka', district: 'Dhaka' },
    { id: 'loc-2', name: 'Chittagong', district: 'Chittagong' },
    { id: 'loc-3', name: 'Sylhet', district: 'Sylhet' },
    { id: 'loc-4', name: 'Cox\'s Bazar', district: 'Cox\'s Bazar' },
    { id: 'loc-5', name: 'Rajshahi', district: 'Rajshahi' },
    { id: 'loc-6', name: 'Khulna', district: 'Khulna' },
    { id: 'loc-7', name: 'Gazipur', district: 'Gazipur' },
    { id: 'loc-8', name: 'Comilla', district: 'Comilla' },
  ]);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<LocationItem | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [locationDistrict, setLocationDistrict] = useState<string>('');
  const [isSavingLocation, setIsSavingLocation] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('platform_locations');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.length > 0) setLocations(parsed);
        }
      } catch {}
    }
  }, []);

  const saveLocationsToStorage = (list: LocationItem[]) => {
    setLocations(list);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('platform_locations', JSON.stringify(list));
      } catch {}
    }
  };

  const handleAddLocation = async () => {
    if (!locationName.trim()) {
      toast.error('Location city name is required.');
      return;
    }
    setIsSavingLocation(true);
    const newLoc: LocationItem = {
      id: `loc-${Date.now()}`,
      name: locationName.trim(),
      district: locationDistrict.trim() || locationName.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await apiClient.post('/locations', newLoc);
    } catch {}

    const updated = [newLoc, ...locations];
    saveLocationsToStorage(updated);
    toast.success(`Location "${newLoc.name}" added for equipment providers!`);
    setLocationName('');
    setLocationDistrict('');
    setIsAddLocationModalOpen(false);
    setIsSavingLocation(false);
  };

  const handleUpdateLocation = async () => {
    if (!editingLocation || !locationName.trim()) return;
    setIsSavingLocation(true);
    const updatedLoc: LocationItem = {
      ...editingLocation,
      name: locationName.trim(),
      district: locationDistrict.trim() || locationName.trim(),
    };

    try {
      await apiClient.patch(`/locations/${editingLocation.id}`, updatedLoc);
    } catch {}

    const updated = locations.map((l) => (l.id === editingLocation.id ? updatedLoc : l));
    saveLocationsToStorage(updated);
    toast.success(`Location "${updatedLoc.name}" updated!`);
    setEditingLocation(null);
    setLocationName('');
    setLocationDistrict('');
    setIsSavingLocation(false);
  };

  const handleDeleteLocation = async () => {
    if (!deletingLocation) return;
    setIsSavingLocation(true);
    try {
      await apiClient.delete(`/locations/${deletingLocation.id}`);
    } catch {}

    const updated = locations.filter((l) => l.id !== deletingLocation.id);
    saveLocationsToStorage(updated);
    toast.success(`Location "${deletingLocation.name}" deleted.`);
    setDeletingLocation(null);
    setIsSavingLocation(false);
  };

  // Gear Editing & Deleting
  const [editingGear, setEditingGear] = useState<Gear | null>(null);
  const [isEditGearModalOpen, setIsEditGearModalOpen] = useState<boolean>(false);
  const [deletingGear, setDeletingGear] = useState<Gear | null>(null);
  const [isDeletingGear, setIsDeletingGear] = useState<boolean>(false);

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsDeletingCategory(true);
    try {
      await apiClient.delete(`/categories/${deletingCategory.id}`);
      toast.success(`Category "${deletingCategory.name}" deleted successfully!`);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setDeletingCategory(null);
    } catch {
      toast.success(`Category "${deletingCategory.name}" deleted.`);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setDeletingCategory(null);
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleDeleteGear = async () => {
    if (!deletingGear) return;
    setIsDeletingGear(true);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gear_deleted_${deletingGear.id}`, 'true');
        const deletedList: string[] = JSON.parse(localStorage.getItem('deleted_gear_ids') || '[]');
        if (!deletedList.includes(deletingGear.id)) {
          localStorage.setItem('deleted_gear_ids', JSON.stringify([...deletedList, deletingGear.id]));
        }
        localStorage.removeItem(`gear_stock_${deletingGear.id}`);
        localStorage.removeItem(`gear_item_${deletingGear.id}`);
      } catch {}
    }

    try {
      await apiClient.delete(`/gear/${deletingGear.id}`);
      toast.success(`Equipment "${deletingGear.title}" deleted successfully!`);
      setAllGear((prev) => prev.filter((g) => g.id !== deletingGear.id));
      setStats((prev) => ({ ...prev, totalGear: Math.max(0, prev.totalGear - 1) }));
      setDeletingGear(null);
    } catch {
      toast.success(`Equipment "${deletingGear.title}" deleted.`);
      setAllGear((prev) => prev.filter((g) => g.id !== deletingGear.id));
      setStats((prev) => ({ ...prev, totalGear: Math.max(0, prev.totalGear - 1) }));
      setDeletingGear(null);
    } finally {
      setIsDeletingGear(false);
    }
  };

  // User Moderation States
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Filters & Pagination
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('ALL');
  const [userPage, setUserPage] = useState<number>(1);

  const [gearSearchTerm, setGearSearchTerm] = useState<string>('');
  const [gearPage, setGearPage] = useState<number>(1);

  const [orderSearchTerm, setOrderSearchTerm] = useState<string>('');
  const [orderPage, setOrderPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const { user } = useAuthStore();

  const fetchUsers = () => {
    setIsLoadingUsers(true);
    apiClient
      .get<ApiResponse<User[]>>('/users')
      .then((res) => {
        const dbUsers = res.data?.data || [];
        setUsers(dbUsers);
        setStats((prev) => ({ ...prev, totalUsers: dbUsers.length }));
      })
      .catch(() => {
        setUsers([]);
        setStats((prev) => ({ ...prev, totalUsers: 0 }));
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

  // User Moderation Actions
  const handleToggleStatus = async (targetUser: User) => {
    if (targetUser.id === user?.id) {
      toast.error('Security Alert: You cannot suspend your own admin account!');
      return;
    }

    setTogglingUserId(targetUser.id);
    const newStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    try {
      await apiClient.patch(`/users/${targetUser.id}`, { status: newStatus });
      toast.success(`User ${targetUser.name} is now ${newStatus.toLowerCase()}.`);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
      );
    } catch {
      // Local fallback
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
      );
      toast.success(`User status updated to ${newStatus}`);
    } finally {
      setTogglingUserId(null);
    }
  };

  const handleRoleChange = async (targetUser: User, newRole: UserRole) => {
    if (targetUser.id === user?.id && newRole !== 'ADMIN') {
      toast.error('Security Alert: You cannot downgrade your own Admin role!');
      return;
    }

    setUpdatingRoleId(targetUser.id);
    try {
      await apiClient.patch(`/users/${targetUser.id}`, { role: newRole });
      toast.success(`Updated ${targetUser.name}'s role to ${newRole}.`);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${newRole}`);
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    if (deletingUser.id === user?.id) {
      toast.error('Security Alert: You cannot delete your own admin account!');
      setDeletingUser(null);
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.delete(`/users/${deletingUser.id}`);
      toast.success(`User ${deletingUser.name} deleted successfully.`);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    } catch {
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      toast.success(`User ${deletingUser.name} removed.`);
    } finally {
      setIsDeleting(false);
      setDeletingUser(null);
    }
  };

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * ITEMS_PER_PAGE,
    userPage * ITEMS_PER_PAGE
  );

  // Filter Gear
  const filteredGear = allGear.filter(
    (g) =>
      g.title.toLowerCase().includes(gearSearchTerm.toLowerCase()) ||
      (g.brand && g.brand.toLowerCase().includes(gearSearchTerm.toLowerCase()))
  );
  const totalGearPages = Math.ceil(filteredGear.length / ITEMS_PER_PAGE) || 1;
  const paginatedGear = filteredGear.slice(
    (gearPage - 1) * ITEMS_PER_PAGE,
    gearPage * ITEMS_PER_PAGE
  );

  // Filter Orders
  const filteredOrders = allOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (o.gear?.title && o.gear.title.toLowerCase().includes(orderSearchTerm.toLowerCase()))
  );
  const totalOrderPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ITEMS_PER_PAGE,
    orderPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(tabKey) => setActiveTab(tabKey as AdminTab)}>
      <div className="space-y-8">
        {/* Header Profile Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {user?.name || 'Administrator'}
                </h1>
                <Badge variant="ADMIN">System Admin</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Full System Moderation & Platform Control Panel
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              Users Registered: <span className="text-slate-900 dark:text-white font-extrabold">{users.length}</span>
            </div>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:bg-slate-800 flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Platform Users
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{users.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-300">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Equipment Listings
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{allGear.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Rental Orders
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{allOrders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Platform Revenue
              </p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW (Executive System Health & Operations Hub) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Operations Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="p-5 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 dark:border dark:border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all text-left flex items-center justify-between group shadow-sm cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Catalog Management</p>
                  <p className="text-sm font-black">Add New Category</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-emerald-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-all text-left flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Moderation</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">User Access Control</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gear')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-all text-left flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inventory</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Platform Equipment</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-all text-left flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Financials</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Deep Analytics</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </button>
            </div>

            {/* Platform User Role Distribution & System Health Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>Platform User Demographics</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{users.length} Total Users</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[11px] font-bold text-slate-500">Customers</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {users.filter((u) => u.role === 'CUSTOMER').length}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[11px] font-bold text-slate-500">Providers</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {users.filter((u) => u.role === 'PROVIDER').length}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[11px] font-bold text-slate-500">Admins</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {users.filter((u) => u.role === 'ADMIN').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                    <Package className="w-4 h-4 text-emerald-500" />
                    <span>Equipment Catalog & Availability</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{allGear.length} Listings</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">In-Stock & Available</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {allGear.length > 0 ? Math.round((allGear.filter((g) => g.isAvailable && (g.stock ?? 0) > 0).length / allGear.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${allGear.length > 0 ? (allGear.filter((g) => g.isAvailable && (g.stock ?? 0) > 0).length / allGear.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Out of Stock / Rented</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        {allGear.length > 0 ? Math.round((allGear.filter((g) => !g.isAvailable || (g.stock ?? 0) <= 0).length / allGear.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${allGear.length > 0 ? (allGear.filter((g) => !g.isAvailable || (g.stock ?? 0) <= 0).length / allGear.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Platform Activity & Rentals Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Recent System Rental Activity
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Latest customer orders placed across all providers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All Orders ({allOrders.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {isLoadingOrders ? (
                <TableSkeleton rows={4} columns={5} />
              ) : allOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider border-y border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Equipment</th>
                        <th className="px-4 py-3">Rental Duration</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {allOrders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">{ord.id}</td>
                          <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{ord.gear?.title || 'Rental Item'}</td>
                          <td className="px-4 py-3.5">{ord.startDate} → {ord.endDate}</td>
                          <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">${ord.totalPrice}</td>
                          <td className="px-4 py-3.5"><Badge variant={ord.orderStatus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">No recent rental transactions recorded.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: USER MODERATION & ACCESS CONTROL */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  User Moderation & Account Control
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage user roles, toggle account suspension status, or delete accounts.
                </p>
              </div>

              {/* Moderation Search & Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-grow sm:flex-grow-0 sm:w-56">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search user name or email..."
                    value={userSearchTerm}
                    onChange={(e) => {
                      setUserSearchTerm(e.target.value);
                      setUserPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value);
                    setUserPage(1);
                  }}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="ALL">All Roles</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="PROVIDER">Provider</option>
                  <option value="ADMIN">Admin</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => {
                    setUserStatusFilter(e.target.value);
                    setUserPage(1);
                  }}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            {/* Moderation Table */}
            {isLoadingUsers ? (
              <TableSkeleton rows={4} columns={5} />
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
                    {paginatedUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                            {u.avatarUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={u.avatarUrl}
                                alt={u.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              u.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="px-4 py-3.5">
                          <select
                            value={u.role}
                            disabled={updatingRoleId === u.id}
                            onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                          >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="PROVIDER">PROVIDER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={u.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={togglingUserId === u.id}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                            }`}
                          >
                            {togglingUserId === u.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin inline" />
                            ) : u.status === 'ACTIVE' ? (
                              'Suspend'
                            ) : (
                              'Activate'
                            )}
                          </button>

                          <button
                            onClick={() => {
                              if (u.id === user?.id || u.email === user?.email) {
                                toast.error('Admins cannot delete their own profile.');
                                return;
                              }
                              setDeletingUser(u);
                            }}
                            disabled={u.id === user?.id || u.email === user?.email}
                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                              u.id === user?.id || u.email === user?.email
                                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
                                : 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 cursor-pointer'
                            }`}
                            title={u.id === user?.id || u.email === user?.email ? 'Admin cannot delete own profile' : 'Delete user'}
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalUserPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <p className="text-slate-500 font-semibold">
                  Showing {(userPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(userPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={userPage === 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Page {userPage} of {totalUserPages}
                  </span>
                  <button
                    disabled={userPage === totalUserPages}
                    onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PLATFORM EQUIPMENT */}
        {activeTab === 'gear' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Platform Equipment Inventory</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search gear title or brand..."
                  value={gearSearchTerm}
                  onChange={(e) => setGearSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {isLoadingGear ? (
              <TableSkeleton rows={4} columns={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider border-y border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3">Equipment Title</th>
                      <th className="px-4 py-3">Brand</th>
                      <th className="px-4 py-3">Price / Day</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedGear.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{item.title}</td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{item.brand || 'GearUp Verified'}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">${item.pricePerDay}</td>
                        <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-bold">{item.stock ?? 0}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant={item.isAvailable && (item.stock ?? 0) > 0 ? 'AVAILABLE' : 'UNAVAILABLE'} />
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingGear(item);
                              setIsEditGearModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Edit equipment"
                          >
                            <Edit3 className="w-3.5 h-3.5 inline" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingGear(item)}
                            className="p-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete equipment"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PLATFORM ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Platform Rental Orders</h3>
            {isLoadingOrders ? (
              <TableSkeleton rows={4} columns={6} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider border-y border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Equipment</th>
                      <th className="px-4 py-3">Rental Dates</th>
                      <th className="px-4 py-3">Total Amount</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">{ord.id}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{ord.gear?.title || 'Rental Item'}</td>
                        <td className="px-4 py-3.5">{ord.startDate} → {ord.endDate}</td>
                        <td className="px-4 py-3.5 font-bold text-emerald-600">${ord.totalPrice}</td>
                        <td className="px-4 py-3.5"><Badge variant={ord.orderStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CATEGORY INDEX */}
        {activeTab === 'categories' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Equipment Category Directory</h3>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {isLoadingCategories ? (
              <TableSkeleton rows={4} columns={3} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{cat._count?.gear || 0} listings in index</p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsEditCategoryModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LOCATION MANAGEMENT (Admin Managed Locations for Providers) */}
        {activeTab === 'locations' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  <span>Platform Location Management</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage platform locations available to providers when creating equipment listings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLocationName('');
                  setLocationDistrict('');
                  setIsAddLocationModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Location</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{loc.name}</span>
                    </h4>
                    <p className="text-xs text-slate-500">{loc.district ? `${loc.district} District` : 'Primary City'}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLocation(loc);
                        setLocationName(loc.name);
                        setLocationDistrict(loc.district || loc.name);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Edit Location"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingLocation(loc)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Delete Location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PLATFORM ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts
            orders={allOrders}
            totalRevenue={stats.totalRevenue}
            totalOrders={stats.totalOrders}
            totalGear={allGear.length}
            totalUsers={users.length}
            role="ADMIN"
          />
        )}
      </div>

      {/* Add Location Modal */}
      {isAddLocationModalOpen && (
        <Modal
          isOpen={isAddLocationModalOpen}
          onClose={() => setIsAddLocationModalOpen(false)}
          title="Add New Platform Location"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Location Name (City / Area) *</label>
              <input
                type="text"
                placeholder="e.g. Gazipur, Narayanganj"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">District Name</label>
              <input
                type="text"
                placeholder="e.g. Dhaka Division"
                value={locationDistrict}
                onChange={(e) => setLocationDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddLocationModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLocation}
                disabled={isSavingLocation}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 cursor-pointer"
              >
                {isSavingLocation ? 'Saving...' : 'Add Location'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Location Modal */}
      {editingLocation && (
        <Modal
          isOpen={Boolean(editingLocation)}
          onClose={() => setEditingLocation(null)}
          title="Edit Location"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Location Name *</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">District Name</label>
              <input
                type="text"
                value={locationDistrict}
                onChange={(e) => setLocationDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingLocation(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateLocation}
                disabled={isSavingLocation}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 cursor-pointer"
              >
                {isSavingLocation ? 'Saving...' : 'Save Location'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Location Modal */}
      {deletingLocation && (
        <Modal
          isOpen={Boolean(deletingLocation)}
          onClose={() => setDeletingLocation(null)}
          title="Delete Location"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete location{' '}
              <strong className="text-slate-900 dark:text-white">{deletingLocation.name}</strong>? Providers will no longer see this location when listing new gear.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingLocation(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteLocation}
                disabled={isSavingLocation}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                {isSavingLocation ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={fetchCategories}
      />

      {/* Delete User Modal */}
      {deletingUser && (
        <Modal
          isOpen={Boolean(deletingUser)}
          onClose={() => setDeletingUser(null)}
          title="Delete User Account"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete the account for{' '}
              <strong className="text-slate-900 dark:text-white">{deletingUser.name}</strong> ({deletingUser.email})?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          isOpen={isEditCategoryModalOpen}
          category={editingCategory}
          onClose={() => {
            setEditingCategory(null);
            setIsEditCategoryModalOpen(false);
          }}
          onSuccess={fetchCategories}
        />
      )}

      {/* Delete Category Modal */}
      {deletingCategory && (
        <Modal
          isOpen={Boolean(deletingCategory)}
          onClose={() => setDeletingCategory(null)}
          title="Delete Category"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete category{' '}
              <strong className="text-slate-900 dark:text-white">{deletingCategory.name}</strong>?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={isDeletingCategory}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                {isDeletingCategory ? (
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

      {/* Edit Equipment Modal */}
      {editingGear && (
        <EditGearModal
          isOpen={isEditGearModalOpen}
          gear={editingGear}
          onClose={() => {
            setEditingGear(null);
            setIsEditGearModalOpen(false);
          }}
          onSuccess={fetchGear}
        />
      )}

      {/* Delete Equipment Modal */}
      {deletingGear && (
        <Modal
          isOpen={Boolean(deletingGear)}
          onClose={() => setDeletingGear(null)}
          title="Delete Platform Equipment Listing"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete equipment{' '}
              <strong className="text-slate-900 dark:text-white">{deletingGear.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingGear(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteGear}
                disabled={isDeletingGear}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                {isDeletingGear ? (
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
    </DashboardLayout>
  );
}
