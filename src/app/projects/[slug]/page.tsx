import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProjectGallery from "@/components/ProjectGallery";
import { prisma } from "@/lib/prisma";
import { getCategoryLabel, formatDate } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://norrisdeckingandheds.com.au";

async function getProject(slug: string) {
  try {
    return await prisma.project.findUnique({
      where: { slug, published: true },
      include: {
        images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
        feedback: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch {
    return null;
  }
}

// --- generateMetadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const title = project.metaTitle || project.title;
  const description =
    project.metaDescription || project.description.substring(0, 160);
  const ogImage = project.images.find(
    (img: { role: string; isPrimary: boolean }) =>
      img.role === "after" || img.isPrimary
  )?.url;

  return {
    title,
    description,
    keywords: project.metaKeywords
      ? project.metaKeywords.split(",").map((k: string) => k.trim())
      : undefined,
    alternates: { canonical: `${BASE_URL}/projects/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/projects/${slug}`,
      type: "article",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? "text-[#C4936A]" : "text-[#E8DDD0]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const beforeImage = project.images.find((img: { role: string }) => img.role === "before");
  const afterImage = project.images.find((img: { role: string }) => img.role === "after");
  const hasSlider = !!(beforeImage && afterImage);

  const primaryImage = hasSlider
    ? afterImage
    : project.images.find((img: { isPrimary: boolean }) => img.isPrimary) ?? project.images[0];

  const galleryImages = project.images.filter(
    (img: { role: string; isPrimary: boolean }) => img.role === "gallery" || (!hasSlider && !img.isPrimary)
  );

  const avgRating =
    project.feedback.length > 0
      ? project.feedback.reduce((sum: number, f: { rating: number }) => sum + f.rating, 0) / project.feedback.length
      : null;

  const ogImage = (hasSlider ? afterImage : primaryImage)?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.metaTitle || project.title,
    description: project.metaDescription || project.description.substring(0, 200),
    image: ogImage,
    datePublished: project.completedAt?.toISOString(),
    author: {
      "@type": "LocalBusiness",
      name: "Norris Decking and Sheds",
      url: BASE_URL,
    },
    url: `${BASE_URL}/projects/${project.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* Hero — Before/After slider or static image */}
        <section className="relative h-[70vh] bg-[#2C2C2C] overflow-hidden">
          {hasSlider ? (
            <>
              <BeforeAfterSlider
                beforeUrl={beforeImage!.url}
                afterUrl={afterImage!.url}
                beforeAlt={beforeImage!.alt || `${project.title} - Before`}
                afterAlt={afterImage!.alt || `${project.title} - After`}
                className="w-full h-full"
              />
            </>
          ) : primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || project.title}
              fill
              className="object-cover opacity-80"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#3D5A3E] to-[#8B5E3C]" />
          )}
          {/* Bottom gradient + title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
            <span className="inline-block bg-[#8B5E3C] text-white text-xs font-semibold px-3 py-1 rounded mb-3">
              {getCategoryLabel(project.category)}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-[var(--font-heading)]">
              {project.title}
            </h1>
            <p className="text-[#E8DDD0] mt-2">
              {project.location} · Completed {formatDate(project.completedAt)}
            </p>
            {hasSlider && (
              <p className="text-white/60 text-sm mt-1 animate-pulse">← Drag the slider to reveal the transformation →</p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-[#FFFDF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main content */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4 font-[var(--font-heading)]">
                  About This Project
                </h2>
                <p className="text-[#8C8277] leading-relaxed text-lg mb-10">
                  {project.description}
                </p>

                {/* Photo Gallery */}
                {galleryImages.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-[#2C2C2C] mb-5 font-[var(--font-heading)]">
                      Project Gallery
                    </h3>
                    <ProjectGallery
                      images={galleryImages.map((img) => ({
                        id: img.id,
                        url: img.url,
                        alt: img.alt || project.title,
                      }))}
                    />
                  </div>
                )}

                {/* Client reviews */}
                {project.feedback.length > 0 && (
                  <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">
                        Client Feedback
                      </h3>
                      {avgRating !== null && (
                        <div className="flex items-center gap-2">
                          <StarRating rating={Math.round(avgRating)} />
                          <span className="text-sm text-[#8C8277]">
                            {avgRating.toFixed(1)} / 5
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {project.feedback.map((review) => (
                        <div
                          key={review.id}
                          className="bg-white border border-[#E8DDD0] rounded-xl p-6"
                        >
                          <StarRating rating={review.rating} />
                          <blockquote className="mt-3 text-[#2C2C2C] leading-relaxed">
                            &ldquo;{review.comment}&rdquo;
                          </blockquote>
                          <p className="mt-3 text-sm font-semibold text-[#8C8277]">
                            {review.clientName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                <div className="bg-[#FAF5EE] rounded-xl p-6 border border-[#E8DDD0]">
                  <h3 className="text-lg font-bold text-[#2C2C2C] mb-4 font-[var(--font-heading)]">
                    Project Details
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-xs text-[#8C8277] uppercase tracking-wider">Type</dt>
                      <dd className="text-sm font-semibold text-[#2C2C2C] mt-0.5">
                        {getCategoryLabel(project.category)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#8C8277] uppercase tracking-wider">Location</dt>
                      <dd className="text-sm font-semibold text-[#2C2C2C] mt-0.5">
                        {project.location}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#8C8277] uppercase tracking-wider">Completed</dt>
                      <dd className="text-sm font-semibold text-[#2C2C2C] mt-0.5">
                        {formatDate(project.completedAt)}
                      </dd>
                    </div>
                    {hasSlider && (
                      <div className="pt-2 border-t border-[#E8DDD0]">
                        <dt className="text-xs text-[#8C8277] uppercase tracking-wider">Transformation</dt>
                        <dd className="text-sm font-semibold text-[#3D5A3E] mt-0.5">
                          Before &amp; After slider ↑
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="bg-[#8B5E3C] rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2 font-[var(--font-heading)]">
                    Love what you see?
                  </h3>
                  <p className="text-[#E8DDD0] text-sm mb-4">
                    Get a free, no-obligation quote for your own project.
                  </p>
                  <a
                    href="/contact"
                    className="block text-center bg-white text-[#8B5E3C] font-bold py-2.5 rounded text-sm hover:bg-[#FAF5EE] transition-colors"
                  >
                    Get a Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
