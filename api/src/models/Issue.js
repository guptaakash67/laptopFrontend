import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: true,
  },
  reportedDate: { type: Date, default: Date.now },
  issueType: {
    type: String,
    enum: ["hardware", "software", "network"],
    required: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: "open",
  },
});

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
