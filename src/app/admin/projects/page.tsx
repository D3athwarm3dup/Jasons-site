import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategoryLabel, formatDate } from "@/lib/utils";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import PublishToggle from "@/components/admin/PublishToggle";

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        feedback: { where: { approved: true }, select: { rating: true } },
        feedbackRequests: { select: { id: true, clientName: true, used: true, token: true } },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">Projects</h1>
          <p className="text-[#8C8277] mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-16 text-center">
          <svg className="w-12 h-12 text-[#E8DDD0] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-[#8C8277] mb-4">No projects yet. Add your first completed project!</p>
          <Link href="/admin/projects/new" className="inline-flex items-center gap-2 bg-[#8B5E3C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold">
            Add New Project
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAF5EE] text-xs text-[#8C8277] uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Project</th>
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-left px-6 py-3">Location</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Reviews</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {projects.map((project) => {
                  const avgRating =
                    project.feedback.length > 0
                      ? (project.feedback.reduce((s, f) => s + f.rating, 0) / project.feedback.length).toFixed(1)
                      : null;

                  return (
                    <tr key={project.id} className="hover:bg-[#FAF5EE] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#E8DDD0] shrink-0 overflow-hidden">
                            {project.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={project.images[0].url} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#8C8277]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#2C2C2C]">{project.title}</p>
                            <p className="text-xs text-[#8C8277]">/projects/{project.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#8C8277]">{getCategoryLabel(project.category)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#8C8277]">{project.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#8C8277]">{formatDate(project.completedAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <PublishToggle id={project.id} published={project.published} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#8C8277]">
                          {avgRating ? `${project.feedback.length} (${avgRating}★)` : "None"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="text-sm text-[#8B5E3C] hover:text-[#6B4226] font-medium"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            className="text-sm text-[#8C8277] hover:text-[#2C2C2C]"
                          >
                            View
                          </Link>
                          <DeleteProjectButton id={project.id} title={project.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
