import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Khi load app, check localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (type, credentials) => {
    try {
      let res;
      if (type === "signup") {
        res = await axios.post(
          "http://localhost:5000/auth/signup",
          credentials
        );
        // Sau signup tự login luôn
        res = await axios.post("http://localhost:5000/auth/login", {
          email: credentials.email,
          password: credentials.password,
        });
      } else {
        res = await axios.post("http://localhost:5000/auth/login", credentials);
      }

      const { user, token } = res.data;
      setUser(user);
      setToken(token);

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return { success: true };
    } catch (err) {
      console.error(err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Error",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
