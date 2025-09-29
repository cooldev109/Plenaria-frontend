const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'customer';
  planId?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const authService = {
  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Register user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    planId?: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Get current user profile
  getCurrentUser: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (userData: {
    name?: string;
    email?: string;
  }): Promise<{ success: boolean; data: { user: User } }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Change password
  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(passwords),
    });
    return handleResponse(response);
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Clear all auth data and force fresh login
  clearAuth: () => {
    localStorage.clear();
    // Reload the page to reset all state
    window.location.reload();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get stored user data
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Store user data
  storeUser: (user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },

  // Refresh token (placeholder - would need backend implementation)
  refreshToken: async (): Promise<AuthResponse> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token available');
    }
    
    // For now, just return the current user data
    // In a real app, you'd call a refresh endpoint
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const userData = await handleResponse(response);
    return {
      success: true,
      message: 'Token refreshed',
      data: {
        user: userData.data.user,
        token: token
      }
    };
  },
};

