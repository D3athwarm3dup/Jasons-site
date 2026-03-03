import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { published } = await req.json();

  const project = await prisma.project.update({
    where: { id },
    data: { published: Boolean(published) },
    select: { id: true, published: true },
  });

  return NextResponse.json(project);
}
