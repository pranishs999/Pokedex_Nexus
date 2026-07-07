import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetMe, useLogout, getGetMeQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '@workspace/api-client-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useGetMe({
    query: {
      retry: false,
      staleTime: Infinity,
      queryKey: [] as unknown[],
    } as any
  });

  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate(undefined as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.setQueryData(getGetMeQueryKey(), null);
      }
    });
  };

  const currentUser = isError ? null : (user || null);

  return (
    <AuthContext.Provider value={{
      user: currentUser as User | null,
      isLoading,
      isAuthenticated: !!currentUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
