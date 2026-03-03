import { prisma } from "@/lib/prisma";
import GalleryManager from "@/components/admin/GalleryManager";

async function getGalleryImages() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  } catch {
    return [];
  }
}

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">Gallery</h1>
        <p className="text-[#8C8277] mt-1">Manage images used throughout the website.</p>
      </div>
      <GalleryManager images={images} />
    </div>
  );
}
