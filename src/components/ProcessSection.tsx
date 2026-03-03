import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

const DEFAULTS = {
  process_label: "How It Works",
  process_heading: "Simple. Straightforward. Stress-Free.",
  process_description:
    "We\u2019ve refined our process to make your experience as smooth as possible from your first call to final handover.",
  process_step1_enabled: "true",
  process_step1_title: "Free Consultation",
  process_step1_description:
    "Get in touch and we\u2019ll arrange a free in-person or phone consultation to discuss your ideas, site, budget, and timeline.",
  process_step2_enabled: "true",
  process_step2_title: "Design & Quote",
  process_step2_description:
    "We\u2019ll prepare a detailed quote with a full breakdown of materials, labour, and timelines. No surprises.",
  process_step3_enabled: "true",
  process_step3_title: "Council & Permits",
  process_step3_description:
    "We handle any required council approvals and permits, taking that hassle completely off your hands.",
  process_step4_enabled: "true",
  process_step4_title: "We Build It",
  process_step4_description:
    "Our team arrives on schedule and builds to the highest standard. You\u2019ll be kept in the loop throughout.",
  process_step5_enabled: "true",
  process_step5_title: "Handover & Enjoy",
  process_step5_description:
    "We do a full walkthrough, answer any questions, and hand over a project you\u2019ll be proud of for years to come.",
};

export default async function ProcessSection() {
  unstable_noStore();
  const rows = await prisma.siteSettings.findMany();
  const s = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value])) as Partial<typeof DEFAULTS>;
  const t = { ...DEFAULTS, ...s };

  const allSteps = [
    { enabled: t.process_step1_enabled !== "false", title: t.process_step1_title, description: t.process_step1_description },
    { enabled: t.process_step2_enabled !== "false", title: t.process_step2_title, description: t.process_step2_description },
    { enabled: t.process_step3_enabled !== "false", title: t.process_step3_title, description: t.process_step3_description },
    { enabled: t.process_step4_enabled !== "false", title: t.process_step4_title, description: t.process_step4_description },
    { enabled: t.process_step5_enabled !== "false", title: t.process_step5_title, description: t.process_step5_description },
  ];
  const steps = allSteps
    .filter((s) => s.enabled)
    .map((s, i) => ({ ...s, number: String(i + 1).padStart(2, "0") }));
  const colsClass: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 md:grid-cols-3",
    4: "sm:grid-cols-2 md:grid-cols-4",
    5: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  };

  return (
    <section className="py-16 sm:py-24 bg-[#3D5A3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-[#C4936A] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            {t.process_label}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-[var(--font-heading)]">
            {t.process_heading}
          </h2>
          <p className="text-[#6A8F6B] text-lg max-w-2xl mx-auto">
            {t.process_description}
          </p>
        </div>

        <div className={`grid ${colsClass[steps.length] ?? "md:grid-cols-5"} gap-6 relative`}>
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-[#6A8F6B]/30" />

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
