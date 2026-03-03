import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/feedback/[token] - Client submits feedback via unique link
// DELETE /api/feedback/[id] - Admin deletes a feedback entry

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await req.json();
  const { rating, comment, clientName } = body;

  try {
    // Find the feedback request by token
    const feedbackRequest = await prisma.feedbackRequest.findUnique({
      where: { token },
      include: { project: true },
    });

    if (!feedbackRequest) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    if (feedbackRequest.used) {
      return NextResponse.json({ error: "Feedback already submitted" }, { status: 409 });
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        projectId: feedbackRequest.projectId,
        feedbackRequestId: feedbackRequest.id,
        clientName: clientName || feedbackRequest.clientName,
        rating: Number(rating),
        comment,
        approved: false,
      },
    });

    // Mark request as used
    await prisma.feedbackRequest.update({
      where: { id: feedbackRequest.id },
      data: { used: true },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token: id } = await params;
  try {
    await prisma.feedback.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
