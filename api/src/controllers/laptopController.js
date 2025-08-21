import Laptop from "../models/Laptop.js";
import Maintenance from "../models/Maintenance.js";

class LaptopController {
  // for creating a laptop
  static async createLaptop(req, res) {
    try {
      let { brand, model, serialNumber, status, purchaseDate } = req.body;
      
      // Basic validation
      if (!brand || !model || !serialNumber || !purchaseDate) {
        return res.status(400).json({ 
          message: "All fields (brand, model, serialNumber, purchaseDate) are required" 
        });
      }

      // Clean and normalize the data
      brand = brand.trim();
      model = model.trim();
      serialNumber = serialNumber.trim();

      // Log all laptops in the database for debugging
      console.log('Checking for duplicate serial number:', serialNumber);
      const allLaptops = await Laptop.find({}, 'serialNumber brand model');
      console.log('Existing laptops:', allLaptops);
      
      // Convert status to lowercase and set default if not provided
      const normalizedStatus = (status ? status.trim().toLowerCase() : 'available');
      
      // Validate status value
      if (!['available', 'assigned', 'under maintenance'].includes(normalizedStatus)) {
        return res.status(400).json({ 
          message: "Status must be one of: available, assigned, under maintenance" 
        });
      }

      // Validate serial number
      if (serialNumber.length === 0) {
        return res.status(400).json({
          message: "Serial number cannot be empty"
        });
      }

      // Check if serial number already exists (case-insensitive)
      const existingLaptop = await Laptop.findOne({ 
        serialNumber: new RegExp('^' + serialNumber + '$', 'i') 
      });
      
      if (existingLaptop) {
        return res.status(400).json({ 
          message: "A laptop with this serial number already exists (serial numbers must be unique regardless of case)" 
        });
      }

      // Create and save the laptop
      const laptop = new Laptop({
        brand: brand.trim(),
        model: model.trim(),
        serialNumber,
        status: normalizedStatus,
        purchaseDate: new Date(purchaseDate)
      });

      const savedLaptop = await laptop.save();
      
      res.status(201).json({
        success: true,
        message: "Laptop created successfully",
        laptop: savedLaptop
      });
    } catch (error) {
      console.error('Error creating laptop:', error);
      
      // Handle different types of errors
      if (error.code === 11000) {
        return res.status(400).json({
          message: "Duplicate serial number found"
        });
      }
      
      res.status(400).json({ 
        message: error.message || "Error creating laptop",
        details: error.errors
      });
    }
  }
  // for all laptops fetching
  static async getLaptops(req, res) {
    try {
      const { status } = req.query;
      let query = {};
      
      // If status is specified, filter by status
      if (status) {
        query.status = status.toLowerCase();
      }
      
      const laptops = await Laptop.find(query);
      res.json(laptops);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get only available laptops
  static async getAvailableLaptops(req, res) {
    try {
      const laptops = await Laptop.find({ status: "available" });
      res.json(laptops);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update laptop status
  static async updateLaptopStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['available', 'assigned', 'under maintenance'].includes(status.toLowerCase())) {
        return res.status(400).json({
          message: "Invalid status. Must be one of: available, assigned, under maintenance"
        });
      }

      const laptop = await Laptop.findByIdAndUpdate(
        id,
        { status: status.toLowerCase() },
        { new: true }
      );

      if (!laptop) {
        return res.status(404).json({ message: "Laptop not found" });
      }

      res.json(laptop);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // get a specific laptop by ID
  static async getLaptopByID(req, res) {
    const { id } = req.params;
    try {
      const laptop = await Laptop.findById(id);
      if (!laptop) {
        return res.status(404).json({ message: "Laptop not found" });
      }
      res.json(laptop);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // Update a laptop's information
  static async updateLaptop(req, res) {
    const { id } = req.params;
    const { brand, model, serialNumber, status, purchaseDate } = req.body;
    try {
      const laptop = await Laptop.findByIdAndUpdate(
        id,
        {
          brand,
          model,
          serialNumber,
          status,
          purchaseDate,
        },
        { new: true }
      );
      if (!laptop) {
        return res.status(404).json({ message: "Laptop not found" });
      }
      res.json(laptop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // for deleting laptop
  static async deleteLaptop(req, res) {
    const { id } = req.params;
    try {
      const laptop = await Laptop.findByIdAndDelete(id);
      if (!laptop) {
        return res.status(404).json({ message: "Laptop not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async addMaintenanceLog(req, res) {
    const { laptopId, maintenanceType, description } = req.body;
    try {
      const maintenance = new Maintenance({
        laptop: laptopId,
        maintenanceType,
        description,
      });
      await maintenance.save();

      await Laptop.findByIdAndUpdate(laptopId, { status: "under maintenance" });

      res
        .status(201)
        .json({ message: "Maintenance logged successfully.", maintenance });
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` });
    }
  }
}
export default LaptopController;
