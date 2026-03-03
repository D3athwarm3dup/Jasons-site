import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// GET /api/projects - List all projects
export async function GET() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      feedback: { where: { approved: true }, select: { rating: true } },
    },
    orderBy: [{ featured: "desc" }, { completedAt: "desc" }],
  });
  return NextResponse.json(projects);
}

// POST /api/projects - Create a project
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, location, category, completedAt, published, featured, images, metaTitle, metaDescription, metaKeywords } = body;

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
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

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
