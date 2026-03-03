import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

// DELETE /api/gallery/[id] - Delete a gallery image
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete the file from disk
    if (image.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", image.url);
      await unlink(filePath).catch(() => {}); // ignore if already gone
    }

    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
