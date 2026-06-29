import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { topic, platform } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // TODO: Add Clerk auth check and rate limiting
    // For now, check if user has a valid session
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    // Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a compelling social media caption (max 75 words) for: "${topic}".${
                    platform && platform !== "general"
                      ? ` Tailor it for ${platform}.`
                      : ""
                  } Make it punchy, specific, and scroll-stopping. Add 3 highly relevant hashtags on a new line. Output only the caption and hashtags, nothing else.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const caption =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not generate caption.";

    // Save caption to DB (without auth, we use a placeholder user_id)
    // In production, this would be the authenticated user's profile ID
    if (supabase) {
      try {
        await supabase.from("captions").insert({
          topic,
          generated_text: caption,
          platform: platform || "general",
        });
      } catch (dbErr) {
        console.error("Failed to save caption to DB:", dbErr);
        // Don't block the response if DB save fails
      }
    }

    return NextResponse.json({ caption });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}