import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2C2C2C] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3a3a3a]">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#8B5E3C] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <div className="text-lg font-bold font-[var(--font-heading)]">Norris Decking & Sheds</div>
                <div className="text-xs text-[#8C8277] tracking-widest uppercase">Adelaide & Surrounds</div>
              </div>
            </div>
            <p className="text-[#8C8277] text-sm leading-relaxed max-w-xs">
              Quality custom decks and sheds built to last. Proudly servicing Adelaide and surrounding areas with craftsmanship you can trust.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#3a3a3a] hover:bg-[#8B5E3C] rounded flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-[#8B5E3C] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
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
            <h4 className="text-sm font-semibold tracking-widest uppercase text-[#8B5E3C] mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-[#8C8277]">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0400000000" className="hover:text-[#C4936A] transition-colors">
                  0400 000 000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:jason@norrisdeckingandheds.com.au" className="hover:text-[#C4936A] transition-colors break-all">
                  jason@norrisdeckingandheds.com.au
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Adelaide & Surrounds, SA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#8C8277]">
          <p>&copy; {new Date().getFullYear()} Norris Decking & Sheds. All rights reserved.</p>
          <p>Built with care in Adelaide 🌿</p>
        </div>
      </div>
    </footer>
  );
}
