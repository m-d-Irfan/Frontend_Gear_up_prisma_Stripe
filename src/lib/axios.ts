import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://backend-gear-up-prisma-stripe.vercel.app/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Access Token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('accessToken') ||
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          ?.split('=')[1];

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unified Error Handling & Toasts
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined') {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.';

      // Display user friendly toast notification for API errors
      if (error.response?.status !== 401) {
        toast.error(errorMessage);
      } else {
        toast.error('Session expired. Please log in again.');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
