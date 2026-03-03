import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactContent from "./ContactContent";

export const metadata = {
  title: "Contact | Norris Decking & Sheds",
  description: "Get in touch with Jason Norris for a free consultation on your decking or shed project.",
};

const DEFAULTS = {
  cp_hero_bg_image: "",
  cp_hero_label: "Let's Talk",
  cp_hero_heading: "Get In Touch",
  cp_hero_subtext: "Ready to start your project? Or just want to ask a few questions? Jason is happy to chat - no pressure.",
  business_phone: "0400 000 000",
  business_email: "jason@norrisdeckingandheds.com.au",
  business_service_area: "Adelaide & Surrounds, SA",
};

export default async function ContactPage() {
  unstable_noStore();
  const rows = await prisma.siteSettings.findMany();
  const raw = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  const s = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== "")) as Partial<typeof DEFAULTS>;
  const t = { ...DEFAULTS, ...s };

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          bgImage={t.cp_hero_bg_image}
          label={t.cp_hero_label}
          heading={t.cp_hero_heading}
          subtext={t.cp_hero_subtext}
        />
        <ContactContent
          phone={t.business_phone}
          email={t.business_email}
          serviceArea={t.business_service_area}
        />
      </main>
      <Footer />
    </>
  );
}

