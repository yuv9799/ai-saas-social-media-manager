import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1, "Post content is required"),
  platforms: z.array(z.string()).min(1, "At least one platform must be selected"),
  scheduledAt: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  imagePrompt: z.string().nullable().optional(),
});

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  logo: z.string().url().nullable().optional(),
});

export const createBrandVoiceSchema = z.object({
  name: z.string().min(1, "Brand voice name is required"),
  guidelines: z.string().min(10, "Guidelines must be at least 10 characters long"),
  referenceTexts: z.array(z.string()).optional(),
});

export const createCarouselSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  numSlides: z.number().min(3).max(10).optional(),
});
