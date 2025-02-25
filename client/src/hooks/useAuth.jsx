import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser(decoded);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      enqueueSnackbar('Login successful!', { variant: 'success' });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      enqueueSnackbar(message, { variant: 'error' });
      return { success: false, error: message };
    }
  }, [enqueueSnackbar]);

  const register = useCallback(async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      enqueueSnackbar('Registration successful!', { variant: 'success' });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      enqueueSnackbar(message, { variant: 'error' });
      return { success: false, error: message };
    }
  }, [enqueueSnackbar]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
  }, [enqueueSnackbar]);

  const isAuthenticated = Boolean(token);
  const isAdmin = user?.role === 'ADMIN';

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated,
    isAdmin
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
