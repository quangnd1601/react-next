'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { IUser, AuthContextType } from '@/interface/auth';
import { API_BASE_URL } from '@/config/env';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Lỗi không lấy được dữ liệu từ localStorage", error);
        }
      }
      setLoading(false);
    });
  }, []);

  const updateUserData = useCallback((updatedData: Partial<IUser>) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...updatedData } : updatedData as IUser;
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; role?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const userData: IUser = data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (data.access_token) localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
        return { success: true, role: userData.role };
      } else {
        alert(data.error || data.message || "Sai tài khoản hoặc mật khẩu!");
        return { success: false };
      }
    } catch (error) {
      console.error("Lỗi kết nối server Backend:", error);
      alert("Không thể kết nối đến máy chủ backend!");
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, updateUserData }),
    [user, loading, login, logout, updateUserData]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};