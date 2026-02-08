"use client";
import React, { createContext, useState, useEffect, useCallback } from "react";

// In production, this should be set via NEXT_PUBLIC_API_URL environment variable
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://api.betterbankings.com/api"
    : "http://localhost:8080/api");

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  position: string | null;
  organization: string | null;
  role: string;
  emailVerified: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  position?: string;
  organization?: string;
}

export interface SignUpResult {
  success: boolean;
  error?: string;
  emailSent?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    error?: string;
    emailVerified?: boolean;
    email?: string;
  }>;
  signUp: (data: SignUpData) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    token: string,
    password: string,
    confirmPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });
      const data = await response.json();
      setUser(data.user || null);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Sign in failed",
          emailVerified: data.emailVerified,
          email: data.email,
        };
      }
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signUp = async (signUpData: SignUpData): Promise<SignUpResult> => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signUpData),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || "Sign up failed" };
      }
      // Don't set user - they need to verify email first
      return { success: true, emailSent: data.emailSent };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || "Request failed" };
      }
      return { success: true };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const resetPassword = async (
    token: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || "Password reset failed" };
      }
      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || "Request failed" };
      }
      return { success: true };
    } catch (error) {
      console.error("Resend verification error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        forgotPassword,
        resetPassword,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
