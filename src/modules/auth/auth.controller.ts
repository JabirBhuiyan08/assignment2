import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);
    if (result === null) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (result === false) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signinUser,
};