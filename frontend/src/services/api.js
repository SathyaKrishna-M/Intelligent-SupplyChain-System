import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      config.headers['X-User-Id'] = parsedUser.id || parsedUser.userId;
      config.headers['X-User-Role'] = parsedUser.role;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
