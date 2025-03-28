import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplications,
  getMentorJobs,
  getStudentApplications
} from "../controllers/job.controller.js";
import { mentorRole, protectedRoute, studentRole } from "../middlewares/auth.middleware.js";


const router = Router();

// Public routes
router.get("/all-jobs", getAllJobs);
router.get("/get-job-by-id/:jobId", getJobById);

// Protected routes - require authentication
router.use(protectedRoute);

// Mentor routes
router.post("/create-job",mentorRole, createJob);
router.put("/jobs/:jobId",mentorRole, updateJob);
router.delete("/jobs/:jobId",mentorRole, deleteJob);
router.get("/jobs/:jobId/applications",mentorRole, getJobApplications);
router.get("/mentor-job",mentorRole, getMentorJobs);

// Student routes
router.post("/apply/:jobId", studentRole, applyForJob);
router.get("/student/applications", studentRole, getStudentApplications);

export default router;