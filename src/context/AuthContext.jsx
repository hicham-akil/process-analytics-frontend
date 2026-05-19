import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return null;
  });

  const login = useCallback((userData) => {
  setUser(userData);
  window.__authToken = userData.token; 
}, []);

  const logout = useCallback(() => {
  setUser(null);
  window.__authToken = null; 
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