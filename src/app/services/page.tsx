import Link from "next/link";
import Image from "next/image";
import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "Services | Norris Decking & Sheds",
  description:
    "Custom decks and sheds built across Adelaide and surrounds. Quality materials, expert craftsmanship, honest pricing.",
};

const DEFAULTS = {
  sp_hero_bg_image: "",
  sp_hero_label: "What We Build",
  sp_hero_heading: "Services That Transform Your Property",
  sp_decking_title: "Decking",
  sp_decking_tagline: "Create the outdoor entertaining space you've always wanted",
  sp_decking_description:
    "From simple ground-level decks to multi-level masterpieces, we design and build timber and composite decks to suit your home, block, and budget.",
  sp_decking_features:
    "Hardwood & softwood timber options,Composite & Trex decking,Ground-level & elevated decks,Wraparound & multi-level designs,Built-in seating & planters,Deck lighting integration,Council approval managed,10-year structural warranty",
  sp_decking_image: "",
  sp_sheds_title: "Sheds",
  sp_sheds_tagline: "The extra space you need, built to last",
  sp_sheds_description:
    "Whether you need a garden shed, workshop, man cave, or large rural storage shed - we build to your exact specifications using quality materials.",
  sp_sheds_features:
    "Custom sizing & layout,Colorbond steel options,Timber frame construction,Concrete slab & footings,Roller doors & personnel doors,Windows & skylights,Internal fit-out options,Council approval managed",
  sp_sheds_image: "",
};

export default async function ServicesPage() {
  unstable_noStore();
  const rows = await prisma.siteSettings.findMany();
  const raw = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  // Only let DB values override defaults when they are non-empty strings
  const s = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== "")
  ) as Partial<typeof DEFAULTS>;
  const t = { ...DEFAULTS, ...s };

  const services = [
    {
      slug: "decks",
      title: t.sp_decking_title,
      tagline: t.sp_decking_tagline,
      description: t.sp_decking_description,
      features: t.sp_decking_features.split(",").map((f) => f.trim()).filter(Boolean),
      image: t.sp_decking_image,
      color: "#8B5E3C",
    },
    {
      slug: "sheds",
      title: t.sp_sheds_title,
      tagline: t.sp_sheds_tagline,
      description: t.sp_sheds_description,
      features: t.sp_sheds_features.split(",").map((f) => f.trim()).filter(Boolean),
      image: t.sp_sheds_image,
      color: "#3D5A3E",
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative py-14 sm:py-20 bg-[#2C2C2C] overflow-hidden">
          {t.sp_hero_bg_image && (
            <>
              <Image
                src={t.sp_hero_bg_image}
                alt="Services hero background"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-[#2C2C2C]/70" />
            </>
          )}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#C4936A] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
              {t.sp_hero_label}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[var(--font-heading)] max-w-2xl">
              {t.sp_hero_heading}
            </h1>
          </div>
        </section>

        {/* Services */}
        <section className="py-14 sm:py-20 bg-[#FFFDF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            {services.map((service, index) => (
              <div
                key={service.slug}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`aspect-video rounded-xl overflow-hidden flex items-center justify-center ${
                    index % 2 === 1 ? "lg:col-start-2" : ""
                  }`}
                  style={!service.image ? {
                    background: `linear-gradient(135deg, ${service.color}22, ${service.color}55)`,
                    border: `2px solid ${service.color}33`,
                  } : undefined}
                >
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-[#8C8277]">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke={service.color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Project photos coming soon</p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <p
                    className="text-sm font-semibold tracking-[0.3em] uppercase mb-3"
                    style={{ color: service.color }}
                  >
                    {service.title}
                  </p>
                  <h2 className="text-3xl font-bold text-[#2C2C2C] mb-3 font-[var(--font-heading)]">
                    {service.tagline}
                  </h2>
                  <p className="text-[#8C8277] mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-[#2C2C2C]">
                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke={service.color} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/contact"
                      className="font-semibold text-white px-6 py-3 rounded text-sm transition-colors"
                      style={{ backgroundColor: service.color }}
                    >
                      Get a Quote
                    </Link>
                    <Link
                      href="/projects"
                      className="border-2 border-[#E8DDD0] hover:border-[#C4936A] text-[#8C8277] hover:text-[#8B5E3C] font-semibold px-6 py-3 rounded text-sm transition-colors"
                    >
                      See Examples
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
