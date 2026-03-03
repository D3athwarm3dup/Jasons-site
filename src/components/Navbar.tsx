"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#2C2C2C] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#8B5E3C] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg font-[var(--font-heading)]">N</span>
            </div>
            <div>
              <div className="text-lg font-bold leading-tight font-[var(--font-heading)] text-white group-hover:text-[#C4936A] transition-colors">
                Norris Decking
              </div>
              <div className="text-xs text-[#8C8277] tracking-widest uppercase">
                & Sheds
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm tracking-wide hover:text-[#C4936A] transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-sm tracking-wide hover:text-[#C4936A] transition-colors">
              Services
            </Link>
            <Link href="/projects" className="text-sm tracking-wide hover:text-[#C4936A] transition-colors">
              Projects
            </Link>
            <Link href="/about" className="text-sm tracking-wide hover:text-[#C4936A] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm tracking-wide hover:text-[#C4936A] transition-colors">
              Contact
            </Link>
            <Link
              href="/contact"
              className="bg-[#8B5E3C] hover:bg-[#6B4226] text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-[#3a3a3a] py-4 space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
              { href: "/projects", label: "Projects" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-sm hover:text-[#C4936A] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block bg-[#8B5E3C] text-center text-white text-sm font-semibold px-5 py-2.5 rounded mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
