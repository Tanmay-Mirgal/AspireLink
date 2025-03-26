import {Router} from "express"
import { protectedRoute } from "../middlewares/auth.middleware";

const router = Router()

router.use(protectedRoute,)


export default router;