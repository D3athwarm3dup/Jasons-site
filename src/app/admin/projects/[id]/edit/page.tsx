import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";

async function getProject(id: string) {
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] } },
    });
  } catch {
    return null;
  }
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  const initialData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    location: project.location,
    category: project.category,
    completedAt: project.completedAt.toISOString().split("T")[0],
    published: project.published,
    featured: project.featured,
    images: project.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      order: img.order,
      role: img.role ?? "gallery",
    })),
    metaTitle: project.metaTitle ?? "",
    metaDescription: project.metaDescription ?? "",
    metaKeywords: project.metaKeywords ?? "",
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/projects" className="text-[#8C8277] hover:text-[#2C2C2C] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">Edit Project</h1>
          <p className="text-sm text-[#8C8277]">{project.title}</p>
        </div>
        <Link
          href={`/projects/${project.slug}`}
          target="_blank"
          className="ml-auto text-sm text-[#8B5E3C] hover:text-[#6B4226] font-medium flex items-center gap-1"
        >
          View Live
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>
      <ProjectForm initialData={initialData} />
    </div>
  );
}
