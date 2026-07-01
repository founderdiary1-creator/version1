'use client';

import React, { createContext, useContext, useState } from 'react';
import type { Profile } from '@/types';
import type { User } from '@supabase/supabase-js';
import { useAuthSession, useLoginMutation, useSignupMutation, useLogoutMutation } from '@/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null; // Dedicated user-friendly error state
  isAdmin: boolean;
  isSubscriber: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  isAdmin: false,
  isSubscriber: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  
  const { data, isLoading } = useAuthSession();
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const logoutMutation = useLogoutMutation();

  const user = data?.user || null;
  const profile = data?.profile || null;

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password. Please try again.');
      throw err;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setError(null);
    try {
      await signupMutation.mutateAsync({ email, password, fullName });
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.');
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await logoutMutation.mutateAsync();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading: isLoading,
        error,
        isAdmin: profile?.role === 'admin',
        isSubscriber: profile?.role === 'subscriber' || profile?.role === 'admin',
        signIn,
        signUp,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);