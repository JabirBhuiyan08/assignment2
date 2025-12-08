import express from "express"
import { userControllers } from "./user.controller"

const router = express.Router()


// create new user
router.post("/signup", userControllers.createUser)

//get all users
router.get('/users', userControllers.getUser)

//delete single user
router.delete('/users/:id', userControllers.deleteUser)

export const userRoutes = router