import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: true,
  },
  assignDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  status: { type: String, enum: ["assigned", "returned"], default: "assigned" },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
