import Job from "../models/JobModel.js";
import path from "path";
import { unlink } from "fs/promises";

// Add job (admin)
const addJob = async (req, res) => {
  try {
    const { title, company, description, location, salary, deadline, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const job = new Job({
      title,
      company: company || "MAYILÉ",
      description,
      location,
      salary,
      deadline: deadline ? new Date(deadline).getTime() : null,
      tags: tags ? (Array.isArray(tags) ? tags : String(tags).split(",").map(t => t.trim())) : []
    });

    await job.save();
    res.json({ success: true, job, message: "Job created" });
  } catch (error) {
    console.error("addJob:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: list all jobs
const allJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("allJobsAdmin:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: list open jobs
const publicJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("publicJobs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply to a job (expects multipart/form-data with optional resume file)
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `resume-${Date.now()}${ext}`);
  }
});
const uploadResumeMiddleware = multer({ storage });

// Apply controller
const applyJob = async (req, res) => {
  try {
    const { jobId, name, email, phone, message } = req.body;
    if (!jobId || !name || !email) {
      return res.status(400).json({ success: false, message: "jobId, name and email are required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    // prevent duplicate application by same user
const alreadyApplied = job.applications.some(
  (a) => String(a.userId) === String(req.user.id)
);

if (alreadyApplied) {
  return res.json({
    success: false,
    message: "You have already applied for this job",
  });
}

    // build application object
    const appObj = {
      userId: req.user ? req.user.id : null,
      name,
      email,
      phone: phone || "",
      message: message || "",
      resumeUrl: ""
    };

    // file if uploaded
    if (req.file && req.file.path) {
      appObj.resumeUrl = req.file.path;
    }

    job.applications.push(appObj);
    await job.save();

    res.json({ success: true, message: "Application submitted" });
  } catch (error) {
    console.error("applyJob:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: list applications for a job
const listApplications = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: "jobId required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, applications: job.applications });
  } catch (error) {
    console.error("listApplications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, applicationId, status } = req.body;
    if (!jobId || !applicationId || !status) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const application = job.applications.id(applicationId);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    application.status = status;
    await job.save();

    res.json({ success: true, message: "Application status updated" });
  } catch (error) {
    console.error("updateApplicationStatus:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update job status (Open/Closed)
const updateJobStatus = async (req, res) => {
  try {
    const { jobId, status } = req.body;
    if (!jobId || !status) return res.status(400).json({ success: false, message: "Missing fields" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    job.status = status;
    await job.save();

    res.json({ success: true, message: "Job status updated" });
  } catch (error) {
    console.error("updateJobStatus:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: get my applications across all jobs
const myApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find jobs where this user has applied
    const jobs = await Job.find({
      "applications.userId": userId
    }).select("title company applications");

    const applications = [];

    jobs.forEach(job => {
      job.applications.forEach(app => {
        if (String(app.userId) === String(userId)) {
          applications.push({
            _id: app._id,
            status: app.status,
            date: app.date || app.createdAt,
            resumeUrl: app.resumeUrl || "",
            message: app.message || "",
            job: {
              id: job._id,
              title: job.title,
              company: job.company
            }
          });
        }
      });
    });

    // newest first
    applications.reverse();

    res.json({ success: true, applications });

  } catch (error) {
    console.error("myApplications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export {
  addJob,
  allJobsAdmin,
  publicJobs,
  applyJob,
  uploadResumeMiddleware,
  listApplications,
  updateApplicationStatus,
  updateJobStatus,
  myApplications,
};
