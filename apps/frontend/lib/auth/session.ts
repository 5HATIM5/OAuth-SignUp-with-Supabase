import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime.js";

import { AuthResponse } from "@lib/api/auth-api.js";

export const TOKEN_KEY = "auth_token";
export const USER_KEY = "user_data";

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
}

export const sessionManager = {
  // Save authentication data
  setAuth: (authData: AuthResponse, userData?: Partial<User>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, authData.accessToken);
      if (userData) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    }
  },

  // Get stored token
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  // Get stored user data
  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!sessionManager.getToken();
  },

  // Clear authentication data
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // Logout
  logout: (router?: AppRouterInstance) => {
    if (router) {
      // Use Next.js router for client-side navigation
      router.push("/");
    } else {
      // Fallback to window.location for non-component usage
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    sessionManager.clearAuth();
  },
};
