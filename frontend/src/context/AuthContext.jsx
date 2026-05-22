"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount and synchronize with the cookie session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get("/me");
        if (res.data && res.data.success) {
          setUser(res.data.user);
          localStorage.setItem("currUser", JSON.stringify(res.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("currUser");
        }
      } catch (err) {
        console.error("Auth status verification failed:", err);
        setUser(null);
        localStorage.removeItem("currUser");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      
      const res = await api.post("/login", params);
      if (res.data && res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("currUser", JSON.stringify(res.data.user));
        // Redirect to protected route or listings
        return { success: true, redirectUrl: res.data.redirectUrl || "/listings" };
      } else {
        return { success: false, error: "Invalid username or password" };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Login failed" };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await api.post("/signup", { username, email, password });
      if (res.data && res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("currUser", JSON.stringify(res.data.user));
        return { success: true, redirectUrl: res.data.redirectUrl || "/listings" };
      } else {
        return { success: false, error: "Signup failed" };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Signup failed" };
    }
  };

  const logout = async () => {
    try {
      await api.get("/logout");
      setUser(null);
      localStorage.removeItem("currUser");
      router.push("/listings");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
