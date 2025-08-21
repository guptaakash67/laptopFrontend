import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import LaptopList from "./Components/LaptopList";
import EmployeeList from "./Components/EmployeeList";
import { AuthProvider, useAuth } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/laptops"
            element={<PrivateRoute component={LaptopList} />}
          />
          <Route
            path="/employees"
            element={<PrivateRoute component={EmployeeList} />}
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Private Route Component to Protect Routes
const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default App;
