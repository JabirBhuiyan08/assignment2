// higher order function return korbe function k

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: string;
                name?: string;
                email?: string;
                role?: string;
            } & JwtPayload;
        }
    }
}

// roles = ["admin", "user"]
const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fix: Extract token from Bearer header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: "No token provided or invalid format"
                });
            }

            const token = authHeader!.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ message: "You are not allowed!!" });
            }

            // Use ! to tell TypeScript it's not undefined
            const decoded = jwt.verify(
                token,
                config.jwtSecret as string
            ) as any;
            console.log({ decoded });
            req.user = decoded as {
                id?: string;
                name?: string;
                email?: string;
                role?: string;
            } & JwtPayload;

            // Check roles if specified
            if (roles.length && !roles.includes(decoded.role as string)) {
                return res.status(403).json({  // Changed to 403 Forbidden
                    success: false,
                    error: "Unauthorized! Insufficient permissions",
                });
            }

            next();
        } catch (err: any) {
            // Handle specific JWT errors
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token",
                });
            }
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token expired",
                });
            }

            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };
};

export default auth;