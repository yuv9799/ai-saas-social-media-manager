import { Request, Response } from "express";
import { generateAICaption } from "../services/ai.service.js";

export async function generateCaption(req: Request, res: Response) {
  try {
    const { topic, platform } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "Topic is required" });
    }

    const caption = await generateAICaption(topic, platform || "general");
    return res.json({ caption });
  } catch (error: any) {
    console.error("Generate Caption API Error:", error);
    return res.status(500).json({ error: "Failed to generate caption", details: error.message });
  }
}
