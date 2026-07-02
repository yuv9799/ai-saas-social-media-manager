import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    claims: any;
  };
}

/**
 * Clerk JWT authorization middleware
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    const isProduction = process.env.NODE_ENV === "production";
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Dev fallback if keys are default or dummy
      if (!isProduction && (!process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY === "dummy_clerk_secret")) {
        console.log("Auth Middleware: Dev Mode Bypass (No auth header)");
        req.auth = { userId: "user_test_default", claims: {} };
        return next();
      }
      return res.status(401).json({ error: "Unauthorized: Missing auth header" });
    }

    const token = authHeader.split(" ")[1];

    if (!isProduction && (token === "dummy_token" || !process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY === "dummy_clerk_secret")) {
      console.log("Auth Middleware: Dev Mode Bypass (Dummy token)");
      req.auth = { userId: "user_test_default", claims: {} };
      return next();
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    req.auth = {
      userId: payload.sub,
      claims: payload,
    };

    next();
  } catch (error: any) {
    console.error("Auth Verification Failed:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid session token" });
  }
}
