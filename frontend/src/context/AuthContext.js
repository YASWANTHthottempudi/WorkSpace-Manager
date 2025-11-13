'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/lib/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load user from localStorage
  const loadUserFromStorage = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        return JSON.parse(userData);
      }
    } catch (err) {
      console.error('Error loading auth data:', err);
    }
    
    return null;
  };

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    // Load user on mount
    const loadedUser = loadUserFromStorage();
    if (loadedUser) {
      setUser(loadedUser);
    }
    setLoading(false);
  }, []);

  // Function to refresh auth state from localStorage
  const refreshAuth = () => {
    const loadedUser = loadUserFromStorage();
    setUser(loadedUser);
    return loadedUser !== null;
  };

  // Listen for storage changes (when login sets localStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        refreshAuth();
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (for same-tab changes)
    const interval = setInterval(() => {
      const currentUser = loadUserFromStorage();
      if (currentUser && (!user || currentUser.email !== user.email)) {
        setUser(currentUser);
      } else if (!currentUser && user) {
        setUser(null);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/register', { name, email, password });
      const { token, user: userData } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};