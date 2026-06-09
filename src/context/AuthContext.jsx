import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return null;
  });

  const login = useCallback((userData) => {
  setUser(userData);
  window.__authToken = userData.token; 
  axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
}, []);

  const logout = useCallback(() => {
  setUser(null);
  window.__authToken = null; 
  delete axios.defaults.headers.common.Authorization;
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
