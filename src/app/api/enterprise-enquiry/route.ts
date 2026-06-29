import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, company, message } = await request.json();

    if (!name || !email || !company) {
      return NextResponse.json(
        { error: "Name, email, and company are required" },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      // Send email via Resend
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "enterprise@socialpulse.ai",
          to: "sales@socialpulse.ai",
          subject: `Enterprise enquiry from ${name} at ${company}`,
          html: `
            <h2>New Enterprise Enquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Message:</strong> ${message || "N/A"}</p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enterprise enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to send enquiry" },
      { status: 500 }
    );
  }
}