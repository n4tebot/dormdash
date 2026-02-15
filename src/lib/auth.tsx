'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from './types';
import { getUserById, getCurrentUserId, setCurrentUserId, clearCurrentUser } from './storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(() => {
    const userId = getCurrentUserId();
    if (userId) {
      const u = getUserById(userId);
      setUser(u || null);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    setLoading(false);
  }, [refreshUser]);

  const login = (userId: string) => {
    setCurrentUserId(userId);
    const u = getUserById(userId);
    setUser(u || null);
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
