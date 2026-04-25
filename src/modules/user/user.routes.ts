import express from "express"
import { userControllers } from "./user.controller"
import auth from "../../middleware/auth"

const router = express.Router()

// Admin-only: view all users
router.get('/', auth("admin"), userControllers.getUser)

// Admin or Own: update user details
router.put('/:userId', auth("admin", "user"), userControllers.updateUser)

// Admin-only: delete users
router.delete('/:userId', auth("admin"), userControllers.deleteUser)

export const userRoutes = router