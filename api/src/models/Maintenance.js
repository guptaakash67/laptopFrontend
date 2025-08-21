import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: true,
  },
  maintenanceDate: { type: Date, default: Date.now },
  maintenanceType: {
    type: String,
    enum: ["repair", "service", "upgrade"],
    required: true,
  },
  description: { type: String, required: true },
  status: { type: String, enum: ["completed", "pending"], default: "pending" },
});

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;
