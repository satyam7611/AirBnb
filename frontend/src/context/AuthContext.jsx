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
          // Synchronize token cookie on frontend domain
          if (res.data.token) {
            document.cookie = `token=${res.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          }
        } else {
          setUser(null);
          localStorage.removeItem("currUser");
          // Clear token cookie if session is invalid
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
        }
      } catch (err) {
        console.error("Auth status verification failed:", err);
        setUser(null);
        localStorage.removeItem("currUser");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
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
        
        // Save the token in a cookie on the frontend domain so Vercel middleware can access it
        if (res.data.token) {
          document.cookie = `token=${res.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
        
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
        
        // Save the token in a cookie on the frontend domain so Vercel middleware can access it
        if (res.data.token) {
          document.cookie = `token=${res.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
        
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
      
      // Clear the frontend token cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      
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
