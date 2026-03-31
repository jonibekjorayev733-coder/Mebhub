import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/authService";
import type { User } from "@/utils/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthState = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    let cancelled = false;

    const restoreAuth = async () => {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (!storedToken || !storedUser) {
        if (!cancelled) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        // Try to validate token, but if it fails, still restore from localStorage
        try {
          const currentUser = await getCurrentUser(storedToken);
          if (!cancelled) {
            localStorage.setItem("auth_user", JSON.stringify(currentUser));
            setToken(storedToken);
            setUser(currentUser);
          }
        } catch (validationError) {
          // Token validation failed, but restore from cached user data
          if (!cancelled) {
            setToken(storedToken);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        if (!cancelled) {
          clearAuthState();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    restoreAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    clearAuthState();
  };

  const handleSetUser = (newUser: User) => {
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        setUser: handleSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
