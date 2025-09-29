import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    planId?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: { name?: string; email?: string }) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLawyer: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Always verify the token with the backend to ensure user data is current
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
            authService.storeUser(response.data.user, localStorage.getItem('token') || '');
          } else {
            // Token is invalid, clear storage
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        authService.storeUser(response.data.user, response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    planId?: string;
  }) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        authService.storeUser(response.data.user, response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (userData: { name?: string; email?: string }) => {
    try {
      const response = await authService.updateProfile(userData);
      if (response.success) {
        setUser(response.data.user);
        authService.storeUser(response.data.user, localStorage.getItem('token') || '');
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();
      if (response.success) {
        authService.storeUser(response.data.user, response.data.token);
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isLawyer = user?.role === 'lawyer';
  const isCustomer = user?.role === 'customer';

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    isAuthenticated,
    isAdmin,
    isLawyer,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
