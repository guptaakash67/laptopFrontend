import express from "express";
import LaptopController from "../controllers/laptopController.js";

const router = express.Router();

router.post("/", LaptopController.createLaptop);

router.get("/", LaptopController.getLaptops);

// Get only available laptops
router.get("/available", LaptopController.getAvailableLaptops);

router.get("/:id", LaptopController.getLaptopByID);

// Update laptop status
router.patch("/:id/status", LaptopController.updateLaptopStatus);

router.put("/:id", LaptopController.updateLaptop);

router.delete("/:id", LaptopController.deleteLaptop);

export default router;
