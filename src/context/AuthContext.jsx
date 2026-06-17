import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { logoutApi } from "../services/authService";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "ocp-auth-user";

axios.defaults.withCredentials = true;

function sanitizeUser(userData) {
  if (!userData?.username || !userData?.role) return null;
  return {
    username: userData.username,
    role: userData.role,
  };
}

function saveStoredUser(userData) {
  try {
    const safeUser = sanitizeUser(userData);
    if (safeUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
    }
  } catch {
    // Ignore storage errors if localStorage is unavailable.
  }
}

function clearStoredUser() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Nothing to clear if browser storage is unavailable.
  }
}

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawUser) return null;

    const storedUser = JSON.parse(rawUser);
    const safeUser = sanitizeUser(storedUser);
    if (!safeUser) {
      clearStoredUser();
      return null;
    }

    if ("token" in storedUser) {
      saveStoredUser(safeUser);
    }

    return safeUser;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return getStoredUser();
  });

  const login = useCallback((userData) => {
    const safeUser = sanitizeUser(userData);
    setUser(safeUser);
    saveStoredUser(safeUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Clear client state even if the server session is already gone.
    }
    setUser(null);
    clearStoredUser();
  }, []);

  const isLabo   = user?.role === "LABO";
  const isViewer = user?.role === "VIEWER";

  return (
    <AuthContext.Provider value={{ user, login, logout, isLabo, isViewer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
