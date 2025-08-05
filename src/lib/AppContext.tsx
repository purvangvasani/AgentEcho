"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { User } from "./types";
import { getCurrentUser, login as authLogin, logout as authLogout } from "./auth";

interface AppContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Add more app state/actions here as needed
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const currentUser = await getCurrentUser();
    console.log("currentUser", currentUser);
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const result = await authLogin(email, password);
    if (result.success) {
      await refreshUser();
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await authLogout();
    setUser(null);
    setLoading(false);
  };

  return (
    <AppContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}