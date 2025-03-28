import express from "express"
import { completeProfile, followUser, getProfile, login, logout, register, setRole, unfollowUser } from "../controllers/auth.controller.js"
import { protectedRoute } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register",register)
router.post("/set-role",protectedRoute,setRole)
router.post("/login",login)
router.post("/logout",logout)
router.post("/complete-profile",protectedRoute,completeProfile)
router.get("/get-profile",protectedRoute,getProfile)

router.post('/user/:id',followUser);
router.post('/unfollow/:id',unfollowUser);


export default router;