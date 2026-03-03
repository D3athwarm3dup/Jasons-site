import Image from "next/image";

interface PageHeroProps {
  label: string;
  heading: string;
  subtext?: string;
  bgImage?: string;
}

export default function PageHero({ label, heading, subtext, bgImage }: PageHeroProps) {
  return (
    <section className="relative py-14 sm:py-20 bg-[#2C2C2C] overflow-hidden">
      {bgImage && (
        <>
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[#2C2C2C]/70" />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[#C4936A] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
          {label}
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[var(--font-heading)] max-w-2xl">
          {heading}
        </h1>
        {subtext && (
          <p className="text-[#8C8277] text-base sm:text-lg mt-4 max-w-xl">{subtext}</p>
        )}
      </div>
    </section>
  );
}
