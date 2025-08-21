import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import mongoose from "mongoose"; // Make sure mongoose is imported

class EmployeeController {
  // Create a new employee
  static async createEmployee(req, res) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      department,
      role,
      laptopAssigned, // Add laptopAssigned here if needed
    } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const employee = new Employee({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        department,
        role,
        laptopAssigned, // Make sure this is included when creating an employee
      });
      await employee.save();
      res.status(201).json({
        success: true,
        data: employee,
        message: "Employee created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Error creating employee: ${error.message}`,
      });
    }
  }

  // Get all employees
  static async getEmployees(req, res) {
    try {
      const employees = await Employee.find().populate("laptopAssigned"); // Populate laptopAssigned
      res.status(200).json({
        success: true,
        data: employees,
        message: "Employees retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching employees: ${error.message}`,
      });
    }
  }

  // Get employee by ID
  static async getEmployeeByID(req, res) {
    const { id } = req.params;
    try {
      const employee = await Employee.findById(id).populate("laptopAssigned");
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      res.status(200).json({
        success: true,
        data: employee,
        message: "Employee retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error retrieving employee: ${error.message}`,
      });
    }
  }

  // Update employee by ID
  static async updateEmployee(req, res) {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      department,
      role,
      laptopAssigned,
    } = req.body;

    try {
      let updateData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        department,
        role,
        laptopAssigned, // Ensure this field is set correctly
      };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      // Ensure that laptopAssigned is either a valid ObjectId or null
      if (laptopAssigned && !mongoose.Types.ObjectId.isValid(laptopAssigned)) {
        return res.status(400).json({
          success: false,
          message: "Invalid laptop ID",
        });
      }

      const employee = await Employee.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.status(200).json({
        success: true,
        data: employee,
        message: "Employee updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Error updating employee: ${error.message}`,
      });
    }
  }

  // Delete employee by ID
  static async deleteEmployee(req, res) {
    const { id } = req.params;
    try {
      // First find the employee to get their laptop info
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // If employee has an assigned laptop, update its status to available
      if (employee.laptopAssigned) {
        try {
          await mongoose.model('Laptop').findByIdAndUpdate(
            employee.laptopAssigned,
            { status: 'available' }
          );
        } catch (error) {
          console.error('Error updating laptop status:', error);
        }
      }

      // Now delete the employee
      await Employee.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error deleting employee: ${error.message}`,
      });
    }
  }
}

export default EmployeeController;
