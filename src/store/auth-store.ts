// Zustand store for authentication state management
// Handles mock user authentication state

import { create } from 'zustand';
import { User } from '@/lib/mock-data';
import { MockAuthService, RegisterData, LoginData } from '@/lib/mock-auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  register: (data: RegisterData) => Promise<boolean>;
  login: (data: LoginData) => Promise<boolean>;
  registerWithGoogle: (email?: string) => Promise<boolean>;
  registerWithApple: (email?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await MockAuthService.register(data);

      if (result.success && result.user) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({
          error: result.message || 'Error en el registro',
          isLoading: false
        });
        return false;
      }
    } catch {
      set({
        error: 'Error inesperado durante el registro',
        isLoading: false
      });
      return false;
    }
  },

  login: async (data: LoginData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await MockAuthService.login(data);

      if (result.success && result.user) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({
          error: result.message || 'Error en el login',
          isLoading: false
        });
        return false;
      }
    } catch {
      set({
        error: 'Error inesperado durante el login',
        isLoading: false
      });
      return false;
    }
  },

  registerWithGoogle: async (email?: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate OAuth redirect delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = await MockAuthService.registerWithGoogle(email);

      if (result.success && result.user) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({
          error: result.message || 'Error en el registro con Google',
          isLoading: false
        });
        return false;
      }
    } catch {
      set({
        error: 'Error inesperado durante el registro con Google',
        isLoading: false
      });
      return false;
    }
  },

  registerWithApple: async (email?: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate OAuth redirect delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = await MockAuthService.registerWithApple(email);

      if (result.success && result.user) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({
          error: result.message || 'Error en el registro con Apple',
          isLoading: false
        });
        return false;
      }
    } catch {
      set({
        error: 'Error inesperado durante el registro con Apple',
        isLoading: false
      });
      return false;
    }
  },

  logout: () => {
    MockAuthService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    // Initialize storage on app start
    MockAuthService.initializeStorage();

    // Check if user is already logged in
    const currentUser = MockAuthService.getCurrentUser();
    if (currentUser) {
      set({
        user: currentUser,
        isAuthenticated: true
      });
    }
  }
}));