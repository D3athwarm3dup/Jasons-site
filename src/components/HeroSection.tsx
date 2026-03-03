import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#2C2C2C]">
      {/* Background photo */}
      <Image
        src="/homeBG.jpg"
        alt="Norris Decking background"
        fill
        className="object-cover object-center"
        priority
        aria-hidden="true"
      />
      {/* Dark overlay — keeps text readable over the photo */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#2C2C2C]/90 via-[#2C2C2C]/60 to-[#2C2C2C]/30 z-10"
        aria-hidden="true"
      />
      {/* Subtle timber-grain line texture on top */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.05) 3px,
            rgba(255,255,255,0.05) 4px
          )`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          <p className="text-[#C4936A] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Adelaide & Surrounds
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-[var(--font-heading)]">
            Custom Decks
            <br />
            <span className="text-[#C4936A]">&amp; Sheds</span>
            <br />
            Built Right.
          </h1>
          <p className="text-lg text-[#E8DDD0] leading-relaxed mb-10 max-w-lg">
            Premium craftsmanship, honest pricing, and lasting results. Jason
            Norris builds decks and sheds you&apos;ll be proud of for years to come.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-bold px-8 py-4 rounded text-base transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/projects"
              className="border-2 border-white/40 hover:border-[#C4936A] text-white hover:text-[#C4936A] font-semibold px-8 py-4 rounded text-base transition-all"
            >
              View Our Work
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/20">
            {[
              { value: "200+", label: "Projects Completed" },
              { value: "10+", label: "Years Experience" },
              { value: "5★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[#C4936A] font-[var(--font-heading)]">
                  {stat.value}
                </div>
                <div className="text-sm text-[#8C8277] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
