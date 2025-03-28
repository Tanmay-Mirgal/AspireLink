import { Router } from "express";

import { mentorRole, protectedRoute } from "../middlewares/auth.middleware.js";
import { createProject, getAllProject, getProjectById } from "../controllers/project.controller.js";

const router = Router();

router.use(protectedRoute);

router.post("/create-project", mentorRole, createProject);
router.get("/get-all-projects", getAllProject);
router.get("/:projectId",getProjectById);

export default router;
