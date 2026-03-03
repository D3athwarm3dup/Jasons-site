import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-[#8B5E3C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#E8DDD0] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
          Ready to Get Started?
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-[var(--font-heading)]">
          Let&apos;s Build Something
          <br />
          You&apos;ll Love
        </h2>
        <p className="text-[#E8DDD0] text-lg mb-10 max-w-xl mx-auto">
          Get your free, no-obligation quote today. Jason will give you honest
          advice and a fair price, every time.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="bg-white hover:bg-[#FAF5EE] text-[#8B5E3C] font-bold px-8 py-4 rounded text-base transition-colors shadow-md"
          >
            Get a Free Quote
          </Link>
          <a
            href="tel:0400000000"
            className="border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-4 rounded text-base transition-colors"
          >
            Call Jason Now
          </a>
        </div>
      </div>
    </section>
  );
}
