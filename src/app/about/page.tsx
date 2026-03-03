import { unstable_noStore } from "next/cache";
import Navbar from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "About | Norris Decking & Sheds",
  description:
    "Meet Jason Norris - Adelaide's trusted deck and shed builder. Learn about our story, values, and commitment to quality craftsmanship.",
};

type TeamMember = { id: string; name: string; role: string; bio: string; image: string };

const DEFAULTS = {
  ap_hero_bg_image: "",
  ap_hero_label: "Our Story",
  ap_hero_heading: "About Norris Decking & Sheds",
  ab_main_image: "",
  ab_main_label: "Meet Jason",
  ab_main_heading: "Built on Hard Work and Honest Service",
  ab_main_bio:
    "Hi, I'm Jason Norris - owner and builder at Norris Decking & Sheds. I've been building custom decks and sheds across Adelaide and surrounds for over a decade, and I'm proud to say that the vast majority of my work comes through word of mouth.\n\nI started out as a carpenter and quickly found that outdoor structures were my passion. There's something deeply satisfying about transforming someone's backyard into a space they absolutely love. I approach every job - big or small - with the same attention to detail and commitment to quality.\n\nWhen you hire Norris Decking & Sheds, you deal directly with me. No call centres, no layers of middlemen. Just honest advice, fair pricing, and a result you'll be proud of for years to come.",
  ab_team_members: "[]",
  ab_val1_icon: "🔨",
  ab_val1_title: "Quality First",
  ab_val1_desc: "We only use premium materials and proven techniques. Every deck and shed is built to last Adelaide's climate.",
  ab_val2_icon: "✅",
  ab_val2_title: "Honest Pricing",
  ab_val2_desc: "No hidden costs, no nasty surprises. Your quote is detailed and transparent from day one.",
  ab_val3_icon: "🤝",
  ab_val3_title: "Personal Service",
  ab_val3_desc: "You deal with Jason directly throughout the entire project, from first call to final handover.",
};

export default async function AboutPage() {
  unstable_noStore();
  const rows = await prisma.siteSettings.findMany();
  const raw = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  const s = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== "")) as Partial<typeof DEFAULTS>;
  const t = { ...DEFAULTS, ...s };

  let teamMembers: TeamMember[] = [];
  try {
    const parsed = JSON.parse(t.ab_team_members);
    teamMembers = Array.isArray(parsed) ? parsed : [];
  } catch { /* empty */ }

  const bioParagraphs = t.ab_main_bio.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          bgImage={t.ap_hero_bg_image}
          label={t.ap_hero_label}
          heading={t.ap_hero_heading}
        />

        {/* About content */}
        <section className="py-14 sm:py-20 bg-[#FFFDF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Main person — image left, text right */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14 sm:mb-20">
              {/* Photo */}
                <div className="relative">
                {t.ab_main_image ? (
                  <div className="aspect-[4/5] rounded-xl overflow-hidden">
                    <Image src={t.ab_main_image} alt={t.ab_main_label} fill className="object-cover object-center" />
                  </div>
                ) : (
                  <div className="aspect-[4/5] bg-gradient-to-br from-[#E8DDD0] to-[#C4936A]/30 rounded-xl flex items-center justify-center">
                    <div className="text-center text-[#8C8277]">
                      <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-sm">Photo coming soon</p>
                    </div>
                  </div>
                )}
                <div className="hidden sm:block absolute -bottom-4 -right-4 w-32 h-32 bg-[#8B5E3C]/10 rounded-xl -z-10" />
              </div>

              {/* Content */}
              <div>
                <p className="text-[#8B5E3C] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                  {t.ab_main_label}
                </p>
                <h2 className="text-3xl font-bold text-[#2C2C2C] mb-6 font-[var(--font-heading)]">
                  {t.ab_main_heading}
                </h2>
                <div className="space-y-4 text-[#8C8277] leading-relaxed">
                  {bioParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional team members — alternating layout */}
            {teamMembers.map((member, i) => {
              const imageRight = i % 2 === 0; // index 0 = image right (alternating from Jason's image-left)
              const memberBio = member.bio.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

              const photoBlock = (
                  <div className="relative">
                  {member.image ? (
                    <div className="aspect-[4/5] rounded-xl overflow-hidden">
                      <Image src={member.image} alt={member.name} fill className="object-cover object-center" />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-gradient-to-br from-[#E8DDD0] to-[#C4936A]/30 rounded-xl flex items-center justify-center">
                      <div className="text-center text-[#8C8277]">
                        <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-sm">Photo coming soon</p>
                      </div>
                    </div>
                  )}
                  <div className={`hidden sm:block absolute -bottom-4 ${imageRight ? "-right-4" : "-left-4"} w-32 h-32 bg-[#8B5E3C]/10 rounded-xl -z-10`} />
                </div>
              );

              const textBlock = (
                <div>
                  {member.role && (
                    <p className="text-[#8B5E3C] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                      {member.role}
                    </p>
                  )}
                  <h2 className="text-3xl font-bold text-[#2C2C2C] mb-6 font-[var(--font-heading)]">
                    {member.name}
                  </h2>
                  <div className="space-y-4 text-[#8C8277] leading-relaxed">
                    {memberBio.map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                </div>
              );

              return (
                <div key={member.id} className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14 sm:mb-20">
                  {imageRight ? (
                    <>{textBlock}{photoBlock}</>
                  ) : (
                    <>{photoBlock}{textBlock}</>
                  )}
                </div>
              );
            })}

            {/* Values */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: t.ab_val1_icon, title: t.ab_val1_title, desc: t.ab_val1_desc },
                { icon: t.ab_val2_icon, title: t.ab_val2_title, desc: t.ab_val2_desc },
                { icon: t.ab_val3_icon, title: t.ab_val3_title, desc: t.ab_val3_desc },
              ].map((v, i) => (
                <div key={i} className="bg-[#FAF5EE] rounded-xl p-5 sm:p-7 border border-[#E8DDD0]">
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <h3 className="text-lg font-bold text-[#2C2C2C] mb-2 font-[var(--font-heading)]">
                    {v.title}
                  </h3>
                  <p className="text-[#8C8277] text-sm leading-relaxed">{v.desc}</p>
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
