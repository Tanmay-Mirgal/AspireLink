import {Router} from "express"
import { createPost, deletePost, getPost, getPostById } from "../controllers/post.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protectedRoute);

router.post('/create',createPost);
router.get('/get',getPost);
router.get('/get/:id',getPostById);
router.delete('/delete/:id',deletePost);





export default router;