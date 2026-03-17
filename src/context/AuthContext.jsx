import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser  = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await authService.register(name, email, password, role);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  // ✅ New — for Google OAuth2
  const loginWithToken = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userData.token);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAdmin   = () => user?.role === 'ADMIN';
  const isManager = () => user?.role === 'MANAGER' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      loginWithToken,  // ✅ expose
      isAdmin, isManager,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;