const steps = [
  {
    number: "01",
    title: "Free Consultation",
    description:
      "Get in touch and we'll arrange a free in-person or phone consultation to discuss your ideas, site, budget, and timeline.",
  },
  {
    number: "02",
    title: "Design & Quote",
    description:
      "We'll prepare a detailed quote with a full breakdown of materials, labour, and timelines. No surprises.",
  },
  {
    number: "03",
    title: "Council & Permits",
    description:
      "We handle any required council approvals and permits, taking that hassle completely off your hands.",
  },
  {
    number: "04",
    title: "We Build It",
    description:
      "Our team arrives on schedule and builds to the highest standard. You'll be kept in the loop throughout.",
  },
  {
    number: "05",
    title: "Handover & Enjoy",
    description:
      "We do a full walkthrough, answer any questions, and hand over a project you'll be proud of for years to come.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-[#3D5A3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#C4936A] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-[var(--font-heading)]">
            Simple. Straightforward. Stress-Free.
          </h2>
          <p className="text-[#6A8F6B] text-lg max-w-2xl mx-auto">
            We&apos;ve refined our process to make your experience as smooth as possible
            from your first call to final handover.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-[#6A8F6B]/30" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="relative z-10 w-20 h-20 mx-auto rounded-full bg-[#2A3F2B] border-2 border-[#6A8F6B]/40 flex items-center justify-center mb-5">
                <span className="text-[#C4936A] font-bold text-xl font-[var(--font-heading)]">
                  {step.number}
                </span>
              </div>
              <h3 className="text-white font-bold text-base mb-2 font-[var(--font-heading)]">
                {step.title}
              </h3>
              <p className="text-[#6A8F6B] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
