import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

// Create a central axios instance with base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_URL,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
  `${API_URL}/api/auth/login`,
  { email, password }
);

      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user); // Save user data if needed
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error; // rethrow so LoginPage can handle it
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
