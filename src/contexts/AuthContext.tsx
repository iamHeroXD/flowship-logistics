'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const PRESET_USERS: Record<UserRole, User> = {
  CUSTOMER: {
    id: 'usr_cust_1',
    name: 'Elena Rostova',
    email: 'customer@flowship.com',
    phone: '+1 (555) 234-8901',
    role: 'CUSTOMER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    organizationId: 'biz_01',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
    isVerified: true,
  },
  DISPATCHER: {
    id: 'usr_disp_1',
    name: 'Marcus Vance',
    email: 'dispatcher@flowship.com',
    phone: '+1 (555) 345-6789',
    role: 'DISPATCHER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-03-25T14:30:00Z',
    isVerified: true,
  },
  DRIVER: {
    id: 'usr_drv_1',
    name: 'Carlos Mendoza',
    email: 'driver@flowship.com',
    phone: '+1 (555) 456-7890',
    role: 'DRIVER',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-03-28T09:00:00Z',
    isVerified: true,
  },
  ADMIN: {
    id: 'usr_adm_1',
    name: 'Sarah Jenkins',
    email: 'admin@flowship.com',
    phone: '+1 (555) 789-0123',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    isVerified: true,
  },
  SUPER_ADMIN: {
    id: 'usr_sadm_1',
    name: 'Alexander Wright',
    email: 'superadmin@flowship.com',
    phone: '+1 (555) 901-2345',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    isVerified: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(PRESET_USERS.CUSTOMER);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('flowship_current_role') as UserRole;
      if (storedRole && PRESET_USERS[storedRole]) {
        setUser(PRESET_USERS[storedRole]);
      }
    } catch {
      // Ignore localStorage read errors in SSR/strict modes
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    const newUser = PRESET_USERS[newRole];
    setUser(newUser);
    try {
      localStorage.setItem('flowship_current_role', newRole);
    } catch {}
  };

  const login = (role: UserRole = 'CUSTOMER') => {
    switchRole(role);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('flowship_current_role');
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
