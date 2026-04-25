import { Router } from "express";
import { authController } from "./auth.controller";
import { userControllers } from "../user/user.controller";

const router = Router();

// Public: Register new user account
router.post("/signup", userControllers.createUser);

// Public: Login and receive JWT token
router.post("/signin", authController.signinUser);

export const authRoutes = router;