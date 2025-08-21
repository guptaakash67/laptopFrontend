import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

class AuthController {
  // for new employee registeration
  static async register(req, res) {
    const {
      firstName,
      lastName,
      email,
      password,
      department,
      role,
      phoneNumber,
    } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const employee = new Employee({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        department,
        role,
        phoneNumber,
      });
      await employee.save();
      res.status(201).json({ message: "Registration successful", employee });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // Login an employee
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const employee = await Employee.findOne({ email });
      if (!employee) {
        return res
          .status(404)
          .json({ message: "Employee not found", employee });
      }
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password is not valid" });
      }
      // Create JWT payload with essential user information
      const payload = {
        id: employee._id,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
        department: employee.department
      };

      // Generate JWT token with payload and longer expiration
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: "24h", // Token expires in 24 hours
          algorithm: "HS256" // Specify the algorithm explicitly
        }
      );

      // Send response with token and user info
      res.json({ 
        message: "Login Successful",
        token,
        user: {
          id: employee._id,
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          role: employee.role,
          department: employee.department
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default AuthController;
