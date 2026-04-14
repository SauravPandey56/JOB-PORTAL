import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api, setAuthToken } from "../utils/api.js";

const AuthContext = createContext(null);

const LS_KEY = "jp_auth_v1";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          setToken(parsed.token);
          setAuthToken(parsed.token);
          setUser(parsed.user || null);
        }
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem(LS_KEY, JSON.stringify({ token, user }));
    else localStorage.removeItem(LS_KEY);
  }, [token, user]);

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setAuthToken(res.data.token);
    setUser(res.data.user);
    toast.success("Welcome back");
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    setToken(res.data.token);
    setAuthToken(res.data.token);
    setUser(res.data.user);
    toast.success("Account created");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    toast("Logged out");
  };

  const refreshMe = async () => {
    const res = await api.get("/auth/me");
    setUser(res.data.user);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, refreshMe, updateUser, isAuthed: !!token }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

