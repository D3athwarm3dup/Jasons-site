import Link from "next/link";

const services = [
  {
    slug: "decks",
    title: "Decking",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    description:
      "Custom timber and composite decks designed and built to suit your home and lifestyle. From simple entertaining areas to multi-level statements.",
    features: ["Timber & composite options", "Full design service", "Council approved", "Ongoing maintenance"],
  },
  {
    slug: "sheds",
    title: "Sheds",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    description:
      "Sturdy, weatherproof sheds built to your exact requirements. Whether it's for storage, a workshop, or a hobby space, we build it to last.",
    features: ["Custom sizing", "Various materials", "Concrete slab options", "Secure & weatherproof"],
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-[#FAF5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#8B5E3C] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            What We Do
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-4 font-[var(--font-heading)]">
            Built for Adelaide's Climate & Lifestyle
          </h2>
          <p className="text-[#8C8277] text-lg max-w-2xl mx-auto">
            Every project is designed around how you actually live — outdoor entertaining,
            extra storage, a workshop, or all of the above.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.slug}
              className="bg-white rounded-xl shadow-sm border border-[#E8DDD0] hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="h-2 bg-gradient-to-r from-[#8B5E3C] to-[#3D5A3E]" />
              <div className="p-8">
                <div className="text-[#8B5E3C] mb-5 group-hover:text-[#3D5A3E] transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#2C2C2C] mb-3 font-[var(--font-heading)]">
                  {service.title}
                </h3>
                <p className="text-[#8C8277] mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[#2C2C2C]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#6B4226] font-semibold text-sm transition-colors"
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#2C2C2C] hover:bg-[#3D5A3E] text-white font-semibold px-8 py-4 rounded transition-colors"
          >
            Discuss Your Project
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
