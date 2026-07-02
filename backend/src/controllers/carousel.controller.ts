import { Request, Response } from "express";
import { generateAICarousel } from "../services/ai.service.js";

/**
 * Handle AI Carousel generation request
 */
export async function generateCarousel(req: Request, res: Response) {
  try {
    const { topic, numSlides } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "Topic is required" });
    }

    const count = parseInt(numSlides) || 5;
    console.log(`Carousel Controller: Requesting ${count} slides for topic "${topic}"`);

    const slides = await generateAICarousel(topic, count);
    return res.json({ slides });
  } catch (error: any) {
    console.error("Generate Carousel Controller Error:", error.message);
    return res.status(500).json({ error: "Failed to generate carousel slides", details: error.message });
  }
}
