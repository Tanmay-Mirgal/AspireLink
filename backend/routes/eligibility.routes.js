import express from "express";
import { checkJobEligibility, getAllJobsWithEligibility, getEligibilityStatistics } from "../controllers/eligibility.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(protectedRoute)
router.get("/check/:jobId", checkJobEligibility);
router.get("/jobs", getAllJobsWithEligibility);
router.get("/statistics", getEligibilityStatistics);

export default router;