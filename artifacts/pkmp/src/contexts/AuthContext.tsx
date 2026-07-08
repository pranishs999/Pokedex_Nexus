import React, { createContext, useContext } from 'react';
import { useGetMe, useLogin, useRegister, useLogout } from '@workspace/api-client-react';
import type { User, LoginInput, RegisterInput } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useGetMe({
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
    request: {
      credentials: "include",
    } as any,
  });

  const loginMutation = useLogin({
    request: {
      credentials: "include",
    } as any,
  });

  const registerMutation = useRegister({
    request: {
      credentials: "include",
    } as any,
  });

  const logoutMutation = useLogout({
    request: {
      credentials: "include",
    } as any,
  });

  const login = async (input: LoginInput) => {
    await loginMutation.mutateAsync({ data: input });
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
  };

  const register = async (input: RegisterInput) => {
    await registerMutation.mutateAsync({ data: input });
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.setQueryData(['/api/auth/me'], null);
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
