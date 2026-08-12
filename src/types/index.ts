export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    gear?: number;
  };
}

export interface LocationItem {
  id: string;
  name: string;
  district?: string;
  createdAt?: string;
}

export interface Gear {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  pricePerDay: number; // First Day Price
  additionalDayPrice?: number; // Additional Days Price
  location?: string;
  district?: string;
  brand?: string;
  stock?: number;
  isAvailable?: boolean;
  categoryId?: string;
  providerId?: string;
  category?: Category;
  provider?: User;
  image?: string;
  images?: string[];
  imageUrl?: string;
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalOrder {
  id: string;
  customerId: string;
  gearId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  gear?: Gear;
  customer?: User;
  payment?: Payment;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  orderId?: string;
  userId?: string;
  amount: number;
  transactionId?: string;
  status: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  customerId: string;
  gearId: string;
  rating: number;
  comment: string;
  customer?: User;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
}
