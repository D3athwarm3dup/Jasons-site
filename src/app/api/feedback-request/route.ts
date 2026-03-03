import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// POST /api/feedback-request - Admin generates a feedback link for a client
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { projectId, clientName, clientEmail } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const token = uuidv4();

    const feedbackRequest = await prisma.feedbackRequest.create({
      data: {
        projectId,
        clientName: clientName || null,
        clientEmail: clientEmail || null,
        token,
        used: false,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const feedbackUrl = `${baseUrl}/feedback/${token}`;

    return NextResponse.json({ feedbackRequest, feedbackUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create feedback request" }, { status: 500 });
  }
}
