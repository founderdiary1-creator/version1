import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true is automatically handled by the browser for same-origin requests,
  // which is perfect for our Next.js API routes that rely on cookies for Supabase auth.
});

// Interceptor for standardized error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If the server responded with our custom error format
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(new Error(error.response.data.error));
    }
    // Network or other Axios errors
    return Promise.reject(error);
  }
);
