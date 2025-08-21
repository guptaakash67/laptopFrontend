import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    set: function(v) {
      // Remove any spaces and convert to lowercase
      return v ? v.replace(/\s+/g, '').toLowerCase() : v;
    },
    validate: {
      validator: async function(v) {
        if (!v) return false;
        
        // Check format
        if (!/^[a-z0-9]+$/i.test(v)) {
          throw new Error('Serial number must contain only letters and numbers');
        }
        
        // Check for duplicates
        const normalizedSerial = v.toLowerCase().trim();
        const existingLaptop = await mongoose.model('Laptop').findOne({ 
          serialNumber: normalizedSerial,
          _id: { $ne: this._id } // exclude current document when updating
        });
        
        if (existingLaptop) {
          throw new Error(`Serial number ${normalizedSerial} is already in use by ${existingLaptop.brand} ${existingLaptop.model}`);
        }
        
        return true;
      },
      message: props => props.reason.message
    }
  },
  status: {
    type: String,
    enum: ["available", "assigned", "under maintenance"],
    default: "available",
    trim: true,
    lowercase: true
  },
  purchaseDate: { type: Date, required: true },
});

const Laptop = mongoose.model("Laptop", laptopSchema);
export default Laptop;
