import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "About | Norris Decking & Sheds",
  description:
    "Meet Jason Norris - Adelaide's trusted deck and shed builder. Learn about our story, values, and commitment to quality craftsmanship.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#2C2C2C] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#C4936A] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
              Our Story
            </p>
            <h1 className="text-5xl font-bold text-white font-[var(--font-heading)]">
              About Norris Decking & Sheds
            </h1>
          </div>
        </section>

        {/* About content */}
        <section className="py-20 bg-[#FFFDF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              {/* Photo placeholder */}
              <div className="relative">
                <div className="aspect-[4/5] bg-gradient-to-br from-[#E8DDD0] to-[#C4936A]/30 rounded-xl flex items-center justify-center">
                  <div className="text-center text-[#8C8277]">
                    <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-sm">Photo of Jason</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#8B5E3C]/10 rounded-xl -z-10" />
              </div>

              {/* Content */}
              <div>
                <p className="text-[#8B5E3C] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                  Meet Jason
                </p>
                <h2 className="text-3xl font-bold text-[#2C2C2C] mb-6 font-[var(--font-heading)]">
                  Built on Hard Work and Honest Service
                </h2>
                <div className="space-y-4 text-[#8C8277] leading-relaxed">
                  <p>
                    Hi, I&apos;m Jason Norris — owner and builder at Norris Decking & Sheds.
                    I&apos;ve been building custom decks and sheds across Adelaide and surrounds
                    for over a decade, and I&apos;m proud to say that the vast majority of my
                    work comes through word of mouth.
                  </p>
                  <p>
                    I started out as a carpenter and quickly found that outdoor structures
                    were my passion. There&apos;s something deeply satisfying about transforming
                    someone&apos;s backyard into a space they absolutely love. I approach every
                    job — big or small — with the same attention to detail and commitment
                    to quality.
                  </p>
                  <p>
                    When you hire Norris Decking & Sheds, you deal directly with me. No
                    call centres, no layers of middlemen. Just honest advice, fair pricing,
                    and a result you&apos;ll be proud of for years to come.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Quality First",
                  icon: "🔨",
                  description:
                    "We only use premium materials and proven techniques. Every deck and shed is built to last Adelaide's climate.",
                },
                {
                  title: "Honest Pricing",
                  icon: "✅",
                  description:
                    "No hidden costs, no nasty surprises. Your quote is detailed and transparent from day one.",
                },
                {
                  title: "Personal Service",
                  icon: "🤝",
                  description:
                    "You deal with Jason directly throughout the entire project, from first call to final handover.",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-[#FAF5EE] rounded-xl p-7 border border-[#E8DDD0]"
                >
                  <div className="text-3xl mb-4">{value.icon}</div>
                  <h3 className="text-lg font-bold text-[#2C2C2C] mb-2 font-[var(--font-heading)]">
                    {value.title}
                  </h3>
                  <p className="text-[#8C8277] text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
