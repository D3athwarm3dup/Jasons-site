import { unstable_noStore } from "next/cache";
import Navbar from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ProjectCard from "@/components/ProjectCard";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/prisma";

const PP_DEFAULTS = {
  pp_hero_bg_image: "",
  pp_hero_label: "Our Work",
  pp_hero_heading: "Completed Projects",
  pp_hero_subtext: "Every project is a source of pride. Browse our completed work across Adelaide and surrounds.",
};

export const metadata = {
  title: "Projects | Norris Decking & Sheds",
  description:
    "Browse completed decking and shed projects across Adelaide. Real photos, real results.",
};

async function getProjects(category?: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        feedback: {
          where: { approved: true },
          select: { rating: true },
        },
      },
      orderBy: [{ featured: "desc" }, { completedAt: "desc" }],
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      location: p.location,
      category: p.category,
      completedAt: p.completedAt,
      primaryImage: p.images[0]?.url,
      feedbackCount: p.feedback.length,
      avgRating:
        p.feedback.length > 0
          ? p.feedback.reduce((sum, f) => sum + f.rating, 0) / p.feedback.length
          : undefined,
    }));
  } catch {
    return [];
  }
}

const categories = [
  { value: "", label: "All Projects" },
  { value: "deck", label: "Decks" },
  { value: "shed", label: "Sheds" },
  { value: "other", label: "Other" },
];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  unstable_noStore();
  const params = await searchParams;
  const category = params.category ?? "";
  const [projects, rows] = await Promise.all([
    getProjects(category || undefined),
    prisma.siteSettings.findMany(),
  ]);
  const raw = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  const s = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== "")) as Partial<typeof PP_DEFAULTS>;
  const t = { ...PP_DEFAULTS, ...s };

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          bgImage={t.pp_hero_bg_image}
          label={t.pp_hero_label}
          heading={t.pp_hero_heading}
          subtext={t.pp_hero_subtext}
        />

        {/* Filter tabs */}
        <section className="bg-white border-b border-[#E8DDD0] sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 py-3">
              {categories.map((cat) => (
                <a
                  key={cat.value}
                  href={cat.value ? `?category=${cat.value}` : "/projects"}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    category === cat.value
                      ? "bg-[#8B5E3C] text-white"
                      : "text-[#8C8277] hover:text-[#8B5E3C] hover:bg-[#FAF5EE]"
                  }`}
                >
                  {cat.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Projects grid */}
        <section className="py-16 bg-[#FAF5EE] min-h-[50vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {projects.length === 0 ? (
              <div className="text-center py-20">
                <svg
                  className="w-16 h-16 text-[#E8DDD0] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-[#8C8277] text-lg">
                  Projects coming soon - check back shortly!
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
