import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('ace_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      const raw = res.data?.data;
      const userData = raw?.user ? { ...raw.user, profile: raw.profile } : raw;
      setUser(userData);
    } catch {
      localStorage.removeItem('ace_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, data } = res.data;
    localStorage.setItem('ace_token', token);
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    // User must log in after registration
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('ace_token');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

