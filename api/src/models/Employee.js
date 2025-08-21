import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  laptopAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: false,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
