import {Router} from "express"
import { acceptRequest, getRequests, studentAssigned } from "../controllers/mentor.controller.js"
import { mentorRole, protectedRoute } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(protectedRoute,mentorRole)

router.post("/accept-request",acceptRequest)
router.get("/get-requests",getRequests)
router.get("/get-student-assigned",studentAssigned)
export default router