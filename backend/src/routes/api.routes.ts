import { Router } from "express";
import { createPost, getPosts, deletePost, updatePost } from "../controllers/post.controller.js";
import { generateCaption } from "../controllers/ai.controller.js";
import { createCheckoutSession, stripeWebhook } from "../controllers/billing.controller.js";
import { createBrandVoice, getBrandVoices, updateBrandVoice, deleteBrandVoice } from "../controllers/brandvoice.controller.js";
import { generateCarousel } from "../controllers/carousel.controller.js";
import { createWorkspace, getWorkspaces, inviteMember } from "../controllers/workspace.controller.js";
import { getAuditLogs } from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { aiRateLimiter } from "../middlewares/ratelimit.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import {
  createPostSchema,
  createWorkspaceSchema,
  createBrandVoiceSchema,
  createCarouselSchema,
} from "../config/schemas.js";

const apiRouter = Router();

// Post management
apiRouter.post("/posts", requireAuth, validateBody(createPostSchema), createPost);
apiRouter.get("/posts", requireAuth, getPosts);
apiRouter.delete("/posts/:id", requireAuth, deletePost);
apiRouter.put("/posts/:id", requireAuth, updatePost);

// AI creative actions
apiRouter.post("/generate", requireAuth, aiRateLimiter, generateCaption);
apiRouter.post("/carousel", requireAuth, aiRateLimiter, validateBody(createCarouselSchema), generateCarousel);

// Billing & subscriptions
apiRouter.post("/billing/checkout", requireAuth, createCheckoutSession);
apiRouter.post("/billing/webhook", stripeWebhook);

// Brand voice training
apiRouter.post("/brandvoice", requireAuth, validateBody(createBrandVoiceSchema), createBrandVoice);
apiRouter.get("/brandvoice", requireAuth, getBrandVoices);
apiRouter.put("/brandvoice/:id", requireAuth, updateBrandVoice);
apiRouter.delete("/brandvoice/:id", requireAuth, deleteBrandVoice);

// Workspaces management
apiRouter.post("/workspaces", requireAuth, validateBody(createWorkspaceSchema), createWorkspace);
apiRouter.get("/workspaces", requireAuth, getWorkspaces);
apiRouter.post("/workspaces/:id/members", requireAuth, inviteMember);

// Administration & Audit Logs
apiRouter.get("/admin/audit-logs", requireAuth, getAuditLogs);

export default apiRouter;
