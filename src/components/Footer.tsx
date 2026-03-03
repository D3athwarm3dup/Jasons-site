import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  noStore(); // always read fresh data — never serve a stale cached footer
  let s: Record<string, string> = {};

  try {
    const rows = await prisma.siteSettings.findMany({
      where: {
        key: {
          in: [
            "business_logo",
            "business_name",
            "business_tagline",
            "business_phone",
            "business_email",
            "business_address",
            "business_suburb",
            "business_state",
            "business_abn",
            "business_licence",
            "facebook_url",
            "instagram_url",
          ],
        },
      },
    });
    s = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  } catch {
    // fall through to hardcoded defaults
  }

  const businessName = s.business_name || "Norris Decking & Sheds";
  const tagline = s.business_tagline || "Quality custom decks and sheds built to last. Proudly servicing Adelaide and surrounding areas with craftsmanship you can trust.";
  const phone = s.business_phone || "0400 000 000";
  const email = s.business_email || "jason@norrisdeckingandheds.com.au";
  const suburb = s.business_suburb || "Adelaide";
  const state = s.business_state || "SA";
  const address = s.business_address
    ? `${s.business_address}, ${suburb}, ${state}`
    : `${suburb} & Surrounds, ${state}`;
  const facebookUrl = s.facebook_url || "https://facebook.com";
  const instagramUrl = s.instagram_url || "";
  const phoneClean = phone.replace(/\s/g, "");

  return (
    <footer className="bg-[#2C2C2C] text-white pt-6 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#3a3a3a] items-start">
          {/* Brand */}
          <div>
            {s.business_logo ? (
              <div className="relative overflow-hidden mb-3" style={{ height: "56px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.business_logo}
                  alt={businessName}
                  className="absolute w-auto"
                  style={{ maxWidth: "220px", top: "50%", left: 0, transform: "translateY(-50%)" }}
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-[#8B5E3C] rounded-sm flex items-center justify-center overflow-hidden">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div>
                  <div className="text-lg font-bold font-[var(--font-heading)]">{businessName}</div>
                  <div className="text-xs text-[#8C8277] tracking-widest uppercase">Adelaide & Surrounds</div>
                </div>
              </div>
            )}
            <p className="text-[#8C8277] text-sm leading-relaxed max-w-xs">
              {tagline}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#1877F2] hover:bg-[#0e5fc0] rounded flex items-center justify-center transition-colors shrink-0"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <p className="text-xs text-[#8C8277] leading-tight">
                Please follow<br />
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-[#C4936A] font-medium hover:text-white transition-colors">
                  {businessName}
                </a>
              </p>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-[#3a3a3a] hover:bg-[#8B5E3C] rounded flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                    <circle cx="12" cy="12" r="4" strokeWidth={2} />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-[#8B5E3C] mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/projects", label: "Projects" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#8C8277] hover:text-[#C4936A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-[#8B5E3C] mb-3">
              Get In Touch
            </h4>
            <ul className="space-y-2 text-sm text-[#8C8277]">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phoneClean}`} className="hover:text-[#C4936A] transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email}`} className="hover:text-[#C4936A] transition-colors break-all">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </li>
              {s.business_abn && (
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>ABN {s.business_abn}</span>
                </li>
              )}
              {s.business_licence && (
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                  </svg>
                  <span>Lic. {s.business_licence}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#8C8277]">
          <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <p>Built with care in Renmark SA by <a href="mailto:jnorriscomputers@gmail.com?subject=Website%20Build%20Enquiry" className="hover:text-white transition-colors underline underline-offset-2">Jesse Norris Computers</a></p>
        </div>
      </div>
    </footer>
  );
}
