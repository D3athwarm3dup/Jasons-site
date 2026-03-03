import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "Services | Norris Decking & Sheds",
  description:
    "Custom decks and sheds built across Adelaide and surrounds. Quality materials, expert craftsmanship, honest pricing.",
};

const services = [
  {
    slug: "decks",
    title: "Decking",
    tagline: "Create the outdoor entertaining space you've always wanted",
    description:
      "From simple ground-level decks to multi-level masterpieces, we design and build timber and composite decks to suit your home, block, and budget.",
    features: [
      "Hardwood & softwood timber options",
      "Composite & Trex decking",
      "Ground-level & elevated decks",
      "Wraparound & multi-level designs",
      "Built-in seating & planters",
      "Deck lighting integration",
      "Council approval managed",
      "10-year structural warranty",
    ],
    color: "#8B5E3C",
  },
  {
    slug: "sheds",
    title: "Sheds",
    tagline: "The extra space you need, built to last",
    description:
      "Whether you need a garden shed, workshop, man cave, or large rural storage shed — we build to your exact specifications using quality materials.",
    features: [
      "Custom sizing & layout",
      "Colorbond steel options",
      "Timber frame construction",
      "Concrete slab & footings",
      "Roller doors & personnel doors",
      "Windows & skylights",
      "Internal fit-out options",
      "Council approval managed",
    ],
    color: "#3D5A3E",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#2C2C2C] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#C4936A] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
              What We Build
            </p>
            <h1 className="text-5xl font-bold text-white font-[var(--font-heading)] max-w-2xl">
              Services That Transform Your Property
            </h1>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-[#FFFDF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {services.map((service, index) => (
              <div
                key={service.slug}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Image placeholder */}
                <div
                  className={`aspect-video rounded-xl flex items-center justify-center ${
                    index % 2 === 1 ? "lg:col-start-2" : ""
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${service.color}22, ${service.color}55)`,
                    border: `2px solid ${service.color}33`,
                  }}
                >
                  <div className="text-center text-[#8C8277]">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke={service.color} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Project photos coming soon</p>
                  </div>
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
                  <ul className="grid grid-cols-2 gap-2 mb-8">
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
