import { Router } from "express";
import { 
  adminRole, 
  protectedRoute 
} from "../middlewares/auth.middleware.js";
import { 
  assignMentor, 
  getAllMentors, 
  getAllStudents, 
  getRegistration, 
  updateRegistration,
  completeStudentRegistration
} from "../controllers/admin.controller.js";

const router = Router();

router.use(protectedRoute);
router.use(adminRole);

router.post("/update-registration/:id", updateRegistration);
router.get("/get-registration", getRegistration);
router.post("/complete-student-registration", completeStudentRegistration);
router.post("/assign-mentor", assignMentor);
router.get("/get-all-students", getAllStudents);
router.get("/get-all-mentors", getAllMentors);

export default router;