import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://employee-payroll-system-uw6d.onrender.com/api',
});

// Attach JWT to API calls — never on login/register (stale token breaks auth)
API.interceptors.request.use((config) => {
  const url = config.url || '';
  const isAuthEndpoint =
    url.includes('/auth/login') || url.includes('/auth/register');
  const token = localStorage.getItem('token');
  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

