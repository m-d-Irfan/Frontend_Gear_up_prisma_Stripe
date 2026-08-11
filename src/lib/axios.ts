import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://backend-gear-up-prisma-stripe.vercel.app/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Real Backend JWT Access Token Only
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('accessToken') ||
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          ?.split('=')[1];

      // Only attach token if it is a real JWT (not a client mock/social token)
      if (
        token &&
        config.headers &&
        !token.includes('verified_google_auth') &&
        !token.includes('mock_') &&
        !token.includes('oauth')
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unified Error Handling & Toast Filtering
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined') {
      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        '';

      const isTokenOrAuthError =
        status === 401 ||
        status === 403 ||
        status === 404 ||
        errorMessage.toLowerCase().includes('not found') ||
        errorMessage.toLowerCase().includes('jwt') ||
        errorMessage.toLowerCase().includes('token') ||
        errorMessage.toLowerCase().includes('malformed') ||
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('invalid');

      // Only show toasts for genuine application errors, suppressing JWT/Auth token mismatch warnings
      if (!isTokenOrAuthError && errorMessage) {
        toast.error(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
