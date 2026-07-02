import { prisma } from "../config/db.js";

// Platform specific prompt tuning templates
function getSystemPrompt(platform: string): string {
  const base = "You are a professional social media manager. Write a scroll-stopping, highly engaging caption. Add 3 highly relevant hashtags at the end.";
  switch (platform.toLowerCase()) {
    case "linkedin":
      return `${base} Tone: Professional, insight-driven, and structured. Use bullet points if helpful for readability.`;
    case "x":
    case "twitter":
      return `${base} Tone: Witty, short, and punchy. Maximum 240 characters. Avoid fluff.`;
    case "instagram":
      return `${base} Tone: Creative, aesthetic, and friendly. Add emojis.`;
    case "tiktok":
      return `${base} Tone: Trend-oriented, high energy, and hook-heavy.`;
    default:
      return `${base} Keep it clean and readable.`;
  }
}

/**
 * Main AI Caption Generator with Model Fallback Router
 */
export async function generateAICaption(topic: string, platform: string): Promise<string> {
  let systemInstruction = getSystemPrompt(platform);

  // Load active brand voice guidelines from database if present
  try {
    const voice = await prisma.brandVoice.findFirst();
    if (voice) {
      systemInstruction += `\n\nApply the following brand voice guidelines:\n${voice.guidelines}`;
      if (voice.referenceTexts.length > 0) {
        systemInstruction += `\nReference samples:\n${voice.referenceTexts.join("\n")}`;
      }
    }
  } catch (err: any) {
    console.error("AI Service: Error reading brand voice from DB:", err.message);
  }

  const prompt = `Write a caption about: "${topic}". Platforms context: ${platform}.`;

  // 1. Try Gemini 2.0 Flash (Primary)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey !== "dummy_gemini_key") {
    try {
      console.log("AI Service: Trying Gemini 2.0 Flash...");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(4000),
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemInstruction}\n\nUser topic: ${prompt}` }
                ]
              }
            ]
          })
        }
      );

      if (res.ok) {
        const data: any = await res.json();
        const captionText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (captionText) {
          console.log("AI Service: Success with Gemini 2.0");
          return captionText.trim();
        }
      }
      console.warn("AI Service: Gemini response not ok, attempting fallback.");
    } catch (err: any) {
      console.error("AI Service: Gemini generation failed:", err.message);
    }
  }

  // 2. Try OpenAI Fallback (Secondary)
  const openAIKey = process.env.OPENAI_API_KEY;
  if (openAIKey && openAIKey !== "dummy_openai_key") {
    try {
      console.log("AI Service: Trying OpenAI GPT-4o-mini...");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIKey}`
        },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ]
        })
      });

      if (res.ok) {
        const data: any = await res.json();
        const captionText = data?.choices?.[0]?.message?.content;
        if (captionText) {
          console.log("AI Service: Success with OpenAI");
          return captionText.trim();
        }
      }
    } catch (err: any) {
      console.error("AI Service: OpenAI fallback failed:", err.message);
    }
  }

  // 3. Last Resort Rule-Based Generator (Safety fallback if offline/no keys configured)
  console.log("AI Service: Using rule-based offline fallback generator.");
  return getRuleBasedCaptionFallback(topic, platform);
}

function getRuleBasedCaptionFallback(topic: string, platform: string): string {
  const hashtags = `#${platform.toLowerCase()} #${topic.toLowerCase().replace(/[^a-z0-9]/g, "")} #socialpulse`;
  
  switch (platform.toLowerCase()) {
    case "linkedin":
      return `Excited to share some thoughts on ${topic}!\n\nBuilding sustainable systems requires planning, execution, and iteration. What are your key takeaways when dealing with ${topic}?\n\nLet's discuss in the comments below.\n\n${hashtags}`;
    case "x":
    case "twitter":
      return `Quick take on ${topic}: consistency beats talent. Focus on execution and keep pushing. ⚡\n\n${hashtags}`;
    case "instagram":
      return `Sunkissed & thinking about ${topic} today! ✨ Living in the details and loving the journey.\n\nDrop a comment if you agree! 👇\n\n${hashtags}`;
    default:
      return `Here is our take on ${topic}: Success is a series of small, daily wins. Keep executing and the results will follow.\n\n${hashtags}`;
  }
}

export interface CarouselSlide {
  title: string;
  body: string;
  cta?: string;
}

/**
 * Generate Multi-Slide Carousel Content using AI
 */
export async function generateAICarousel(topic: string, numSlides: number = 5): Promise<CarouselSlide[]> {
  const systemPrompt = `You are a social media carousel designer. Generate a sequence of exactly ${numSlides} slides on the topic: "${topic}". 
Return ONLY a valid JSON array of objects, where each object has "title", "body", and "cta" (call to action, optional). No markdown, no triple backticks, no other text.
Example format:
[
  {"title": "Slide 1 Title", "body": "Slide 1 bullet points/body text", "cta": "Swipe next"},
  {"title": "Slide 2 Title", "body": "Slide 2 content"}
]`;

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey !== "dummy_gemini_key") {
    try {
      console.log("AI Service: Generating carousel using Gemini...");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(6000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        }
      );

      if (res.ok) {
        const data: any = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const slides = JSON.parse(cleanText);
        if (Array.isArray(slides)) {
          console.log("AI Service: Success generating carousel");
          return slides;
        }
      }
    } catch (err: any) {
      console.error("AI Service: Gemini carousel generation failed:", err.message);
    }
  }

  // Fallback rule-based slide generation
  console.log("AI Service: Using rule-based offline carousel generator.");
  return getRuleBasedCarouselFallback(topic, numSlides);
}

function getRuleBasedCarouselFallback(topic: string, numSlides: number): CarouselSlide[] {
  const slides: CarouselSlide[] = [
    { title: `Introduction to ${topic}`, body: `Understanding the fundamentals of ${topic} is key to mastering it. Here's what you need to know.`, cta: "Swipe to learn" }
  ];

  for (let i = 2; i < numSlides; i++) {
    slides.push({
      title: `Key Takeaway #${i - 1}`,
      body: `Analyzing specific strategies and details for ${topic}. Consistency and structured planning will accelerate your results.`,
      cta: "Swipe next"
    });
  }

  slides.push({
    title: "Conclusion & Action",
    body: `Ready to start with ${topic}? Implement these steps today and watch your engagement grow!`,
    cta: "Follow for more!"
  });

  return slides;
}
