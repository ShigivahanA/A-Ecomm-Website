import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import {
  addJob,
  allJobsAdmin,
  publicJobs,
  applyJob,
  uploadResumeMiddleware,
  listApplications,
  updateApplicationStatus,
  updateJobStatus,myApplications
} from "../controllers/jobController.js";

const router = express.Router();

// Admin
router.post("/add", adminAuth, addJob);
router.post("/list", adminAuth, allJobsAdmin);
router.post("/applications", adminAuth, listApplications);
router.post("/application/status", adminAuth, updateApplicationStatus);
router.post("/status", adminAuth, updateJobStatus);

// Public/User
router.get("/public", publicJobs); // list open jobs
// User
router.post("/my-applications", authUser, myApplications);
router.post("/apply", authUser, uploadResumeMiddleware.single("resume"), applyJob);

export default router;
