import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "ocp-auth-user";

function saveStoredUser(userData) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  } catch {
    // Keep the in-memory session working if browser storage is unavailable.
  }
}

function clearStoredUser() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Nothing to clear if browser storage is unavailable.
  }
}

function applyAuthToken(token) {
  window.__authToken = token;

  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawUser) return null;

    const storedUser = JSON.parse(rawUser);
    if (!storedUser?.token) {
      clearStoredUser();
      return null;
    }

    return storedUser;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = getStoredUser();
    applyAuthToken(storedUser?.token ?? null);
    return storedUser;
  });

  const login = useCallback((userData) => {
    setUser(userData);
    saveStoredUser(userData);
    applyAuthToken(userData.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStoredUser();
    applyAuthToken(null);
  }, []);

  const isLabo   = user?.role === "LABO";
  const isViewer = user?.role === "VIEWER";
  const token    = user?.token ?? null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLabo, isViewer, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
