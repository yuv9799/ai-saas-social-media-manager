import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Express middleware for validating request body with Zod schemas
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      console.warn("Input Validation Failed:", error.errors);
      return res.status(400).json({
        error: "Validation Failed",
        details: error.errors.map((e: any) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
  };
}
