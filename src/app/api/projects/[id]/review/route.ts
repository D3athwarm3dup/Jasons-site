import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // The dynamic segment is [id] but we receive a slug — both match any string in the URL
  const { id: slug } = await params;

  let body: { clientName?: unknown; rating?: unknown; comment?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { clientName, rating, comment } = body;

  // Validation
  if (typeof clientName !== "string" || clientName.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  }
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 });
  }

  // Look up the published project by slug
  const project = await prisma.project.findUnique({
    where: { slug, published: true },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Create the Feedback record — approved:false so it goes into the admin queue
  await prisma.feedback.create({
    data: {
      projectId: project.id,
      clientName: clientName.trim(),
      rating,
      comment: comment.trim(),
      approved: false,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
