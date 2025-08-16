import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    const storedUser = Cookies.get("user");
    if (cookieToken && storedUser) {
      setToken(cookieToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (type, credentials) => {
    try {
      let res;
      console.log(credentials);
      if (type === "signup") {
        res = await axios.post(
          "http://localhost:5000/auth/signup",
          credentials
        );
      } else {
        res = await axios.post("http://localhost:5000/auth/login", credentials);
      }

      const { user, token } = res.data;
      setUser(user);
      setToken(token);

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user", JSON.stringify(user), { expires: 1 });

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
    Cookies.remove("token");
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
