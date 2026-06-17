import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.success !== undefined && parsed.data) {
          setUser(parsed.data);
          localStorage.setItem('user', JSON.stringify(parsed.data));
        } else if (parsed && parsed.role) {
          setUser(parsed);
        } else {
          localStorage.removeItem('user');
        }
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const userData = response.data;
      if (userData.success === false) {
        return { success: false, error: userData.error || 'Login failed' };
      }
      setUser(userData.data);
      localStorage.setItem('user', JSON.stringify(userData.data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (id, username, password, role) => {
    try {
      const response = await api.post('/auth/register', { id, username, password, role });
      if (response.data.success === false) {
          return { success: false, error: response.data.error || 'Registration failed' };
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


