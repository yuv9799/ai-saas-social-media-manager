import { NextResponse } from "next/server";

/**
 * Proxy route forwarding public caption requests to the centralized Express backend
 */
export async function POST(request: Request) {
  try {
    const { topic, platform } = await request.json();

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/api/v1/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer dummy_token" // Dev mock token to bypass auth middleware check
      },
      body: JSON.stringify({ topic, platform })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "AI Generation failed on backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy Generate API Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}