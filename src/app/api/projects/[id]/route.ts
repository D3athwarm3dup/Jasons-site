import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: true, feedback: { where: { approved: true } } },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

// PUT /api/projects/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { title, description, location, category, completedAt, published, featured, images, metaTitle, metaDescription, metaKeywords } = body;

    // Delete old images and recreate
    await prisma.projectImage.deleteMany({ where: { projectId: id } });

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        location: location ?? "",
        category: category ?? "deck",
        completedAt: new Date(completedAt),
        published: published ?? false,
        featured: featured ?? false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        images: {
          create: (images ?? []).map((img: { url: string; alt: string; isPrimary: boolean; role: string; order: number }, i: number) => ({
            url: img.url,
            alt: img.alt ?? "",
            isPrimary: img.isPrimary ?? i === 0,
            role: img.role ?? "gallery",
            order: img.order ?? i,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/projects/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
