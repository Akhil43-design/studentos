import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartslate_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartslate_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smartslate_token', token);
    } else {
      localStorage.removeItem('smartslate_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartslate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartslate_user');
    }
  }, [user]);

  // Session timeout auto check (30 min idle warning / logout)
  useEffect(() => {
    if (!token) return;
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('[Auth] Session timeout reached');
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [token]);

  const login = async ({ username, password, pin }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password, pin });
      setToken(res.data.token);
      setUser(res.data.user);
      setLoading(false);
      return { success: true, user: res.data.user };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      setToken(res.data.token);
      setUser(res.data.user);
      setLoading(false);
      return { success: true, user: res.data.user };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const resetPin = async ({ username, email, newPin }) => {
    try {
      const res = await api.post('/auth/forgot-pin', { username, email, newPin });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'PIN reset failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smartslate_token');
    localStorage.removeItem('smartslate_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, resetPin, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
