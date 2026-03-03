import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/contact/[id]/read - Mark an enquiry as read
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json(submission);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
