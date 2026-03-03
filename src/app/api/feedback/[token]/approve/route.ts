import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/feedback/[id]/approve - Admin approves a feedback entry
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token: id } = await params;
  try {
    const feedback = await prisma.feedback.update({
      where: { id },
      data: { approved: true },
    });
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
