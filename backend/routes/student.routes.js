import {Router} from "express"
import { protectedRoute, studentRole } from "../middlewares/auth.middleware.js";
import { fetchUnassignedMentor, getSkillsAnalytics, mentorsAssigned, sendMentorRequest } from "../controllers/student.controller.js";

const router = Router()

router.use(protectedRoute,studentRole)


router.post("/add-mentor",sendMentorRequest)
router.get("/mentor-assigned",mentorsAssigned)
router.get("/get-skills-analytics",getSkillsAnalytics)
router.get("/get-unassigned-mentor",fetchUnassignedMentor)

export default router;