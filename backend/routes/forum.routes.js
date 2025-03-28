import {Router} from "express" 
import { addMessageToForum, allForums, createForum, getForumById, joinForum } from "../controllers/forum.controller.js"; 
import { mentorRole, protectedRoute, studentRole } from "../middlewares/auth.middleware.js";

const router = Router() 
router.use(protectedRoute)

router.post("/create-forum", mentorRole, createForum);
router.put("/join-forum/:id", studentRole, joinForum);
router.post("/send-message/:id", addMessageToForum);
router.get("/all-forums", allForums);
router.get("/get-forum/:id", getForumById);

export default router;