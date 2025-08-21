import express from "express";
import EmployeeController from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", EmployeeController.createEmployee);
router.get("/", EmployeeController.getEmployees);
router.get("/:id", EmployeeController.getEmployeeByID);
router.put("/:id", EmployeeController.updateEmployee);
router.delete("/:id", EmployeeController.deleteEmployee);

export default router;
