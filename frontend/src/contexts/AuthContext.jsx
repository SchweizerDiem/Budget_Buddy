import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

const defaultHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/check-auth", {
        method: "GET",
        credentials: "include",
        headers: defaultHeaders,
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        credentials: "include",
        headers: defaultHeaders,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data);
      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        credentials: "include",
        headers: defaultHeaders,
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setUser(data);
      toast.success("Registration successful!");
      window.location.href = "/";
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: defaultHeaders,
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      toast.success("Logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 