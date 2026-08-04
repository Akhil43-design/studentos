import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartslate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Session Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      localStorage.removeItem('smartslate_token');
      localStorage.removeItem('smartslate_user');
    }
    return Promise.reject(error);
  }
);

export default api;
