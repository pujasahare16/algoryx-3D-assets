'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AuthState, Creator, ApplicationStatus } from '@/lib/types';
import { mockCreator } from '@/lib/mock/data';

interface AuthContextType extends AuthState {
  signIn: () => void;
  signOut: () => void;
  setCreatorAccess: (status: ApplicationStatus) => void;
  updateProfile: (data: Partial<Creator>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);

  const isCreator = creator?.applicationStatus === 'approved';

  const signIn = useCallback(() => {
    setIsAuthenticated(true);
    setCreator({ ...mockCreator });
  }, []);

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    setCreator(null);
  }, []);

  const setCreatorAccess = useCallback((status: ApplicationStatus) => {
    setCreator((prev) => (prev ? { ...prev, applicationStatus: status } : null));
  }, []);

  const updateProfile = useCallback((data: Partial<Creator>) => {
    setCreator((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isCreator, creator, signIn, signOut, setCreatorAccess, updateProfile }}
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
