import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: String, default: null }, // if user applied while logged in
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  resumeUrl: { type: String, default: "" }, // path or cloud URL
  message: { type: String, default: "" },
  status: { type: String, enum: ["Applied", "Under review", "Rejected", "Accepted"], default: "Applied" },
  date: { type: Number, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: "MAYILÉ" },
  description: { type: String, default: "" },
  location: { type: String, default: "" },
  salary: { type: String, default: "" },
  deadline: { type: Number, default: null },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  createdAt: { type: Number, default: Date.now },
  applications: { type: [applicationSchema], default: [] }
});

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
export default Job;
