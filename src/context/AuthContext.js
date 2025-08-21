import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Assuming the API responds with user data and a token on successful authentication
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user); // Save user data if needed
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Rethrow error to handle in LoginPage
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
