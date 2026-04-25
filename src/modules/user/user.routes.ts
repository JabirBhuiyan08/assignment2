import express from "express"
import { userControllers } from "./user.controller"
import auth from "../../middleware/auth"

const router = express.Router()

// Public registration (creates 'user' role by default)
router.post("/signup", userControllers.createUser)

// Admin-only: view all users
router.get('/users', auth("admin"), userControllers.getUser)

// Admin-only: delete users
router.delete('/users/:userId', auth("admin"), userControllers.deleteUser)

export const userRoutes = router