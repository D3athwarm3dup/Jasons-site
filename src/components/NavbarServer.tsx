import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  unstable_noStore();
  let logo: string | undefined;
  let businessName: string | undefined;

  try {
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: ["business_logo", "business_name"] } },
    });
    const s = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
    logo = s.business_logo || undefined;
    businessName = s.business_name || undefined;
  } catch {
    // fall through to defaults
  }

  return <Navbar logo={logo} businessName={businessName} />;
}
