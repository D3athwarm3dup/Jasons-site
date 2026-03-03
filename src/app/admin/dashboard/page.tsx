import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function getStats() {
  try {
    const [projects, pendingFeedback, enquiries, totalFeedback] = await Promise.all([
      prisma.project.count({ where: { published: true } }),
      prisma.feedback.count({ where: { approved: false } }),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.feedback.count({ where: { approved: true } }),
    ]);
    return { projects, pendingFeedback, enquiries, totalFeedback };
  } catch {
    return { projects: 0, pendingFeedback: 0, enquiries: 0, totalFeedback: 0 };
  }
}

async function getRecentProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const [stats, recentProjects] = await Promise.all([getStats(), getRecentProjects()]);

  const statCards = [
    {
      label: "Published Projects",
      value: stats.projects,
      href: "/admin/projects",
      color: "#8B5E3C",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      ),
    },
    {
      label: "Pending Reviews",
      value: stats.pendingFeedback,
      href: "/admin/feedback",
      color: "#C4936A",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      ),
    },
    {
      label: "New Enquiries",
      value: stats.enquiries,
      href: "/admin/enquiries",
      color: "#3D5A3E",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
    },
    {
      label: "Approved Reviews",
      value: stats.totalFeedback,
      href: "/admin/feedback",
      color: "#6A8F6B",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "Jason"} 👋
        </h1>
        <p className="text-[#8C8277] mt-1">
          Here&apos;s an overview of your website.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-5 border border-[#E8DDD0] hover:shadow-md transition-shadow"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${card.color}22` }}
            >
              <svg className="w-5 h-5" fill="none" stroke={card.color} viewBox="0 0 24 24">
                {card.icon}
              </svg>
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">
              {card.value}
            </div>
            <div className="text-sm text-[#8C8277] mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent projects */}
        <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] flex justify-between items-center">
            <h2 className="font-bold text-[#2C2C2C] font-[var(--font-heading)]">Recent Projects</h2>
            <Link href="/admin/projects" className="text-sm text-[#8B5E3C] hover:text-[#6B4226] font-medium">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-[#E8DDD0]">
            {recentProjects.length === 0 ? (
              <li className="px-6 py-8 text-center text-[#8C8277] text-sm">
                No projects yet.{" "}
                <Link href="/admin/projects/new" className="text-[#8B5E3C] hover:underline">
                  Add your first project
                </Link>
              </li>
            ) : (
              recentProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-[#FAF5EE] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#E8DDD0] shrink-0 overflow-hidden">
                      {project.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.images[0].url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#8C8277]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2C2C2C] truncate">{project.title}</p>
                      <p className="text-xs text-[#8C8277]">{formatDate(project.createdAt)}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        project.published
                          ? "bg-[#3D5A3E]/10 text-[#3D5A3E]"
                          : "bg-[#E8DDD0] text-[#8C8277]"
                      }`}
                    >
                      {project.published ? "Live" : "Draft"}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-6">
          <h2 className="font-bold text-[#2C2C2C] font-[var(--font-heading)] mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { href: "/admin/projects/new", label: "Add New Project", icon: "➕", desc: "Post a completed project" },
              { href: "/admin/feedback", label: "Review Feedback", icon: "⭐", desc: "Approve pending client reviews" },
              { href: "/admin/enquiries", label: "Check Enquiries", icon: "📩", desc: "View new contact form submissions" },
              { href: "/admin/gallery", label: "Manage Gallery", icon: "🖼️", desc: "Upload & organise images" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 p-4 rounded-lg bg-[#FAF5EE] hover:bg-[#F0E8DF] transition-colors"
              >
                <span className="text-xl">{action.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#2C2C2C]">{action.label}</p>
                  <p className="text-xs text-[#8C8277]">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
