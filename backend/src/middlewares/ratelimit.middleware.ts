import { rateLimit } from "express-rate-limit";

/**
 * Rate limiting middleware for protecting high-cost AI generators
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: {
    error: "Too many requests to AI endpoints. Please wait a minute before trying again."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
