import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/projects/[id]/verify-pin
// Verifies a client-supplied PIN against the project's reviewPin.
// The [id] segment is the project slug (same convention as the review route).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: slug } = await params;

  let body: { pin?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const { pin } = body;
  if (typeof pin !== "string" || pin.trim().length === 0) {
    return NextResponse.json({ valid: false });
  }

  const project = await prisma.project.findUnique({
    where: { slug, published: true },
    select: { reviewPin: true },
  });

  if (!project || !project.reviewPin) {
    return NextResponse.json({ valid: false });
  }

  const valid = project.reviewPin === pin.trim();
  return NextResponse.json({ valid });
}
