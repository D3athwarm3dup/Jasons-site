"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  type: "item";
  href: string;
  label: string;
  icon: React.ReactNode;
};

type NavGroup = {
  type: "group";
  label: string;
  icon: React.ReactNode;
  children: { href: string; label: string; icon: React.ReactNode }[];
};

const navConfig: (NavItem | NavGroup)[] = [
  {
    type: "item",
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
  },
  {
    type: "group",
    label: "Pages",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    children: [
      {
        href: "/admin/homepage",
        label: "Homepage",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
      },
      {
        href: "/admin/services",
        label: "Services",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />,
      },
      {
        href: "/admin/projects",
        label: "Projects",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
      },
      {
        href: "/admin/business",
        label: "Business",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
      },
      {
        href: "/admin/about",
        label: "About",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
      },
      {
        href: "/admin/pages",
        label: "Page Heroes",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      },
    ],
  },
  {
    type: "item",
    href: "/admin/feedback",
    label: "Feedback",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  },
  {
    type: "item",
    href: "/admin/enquiries",
    label: "Enquiries",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  },
  {
    type: "item",
    href: "/admin/contacts",
    label: "Contacts",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  },
  {
    type: "item",
    href: "/admin/seo",
    label: "SEO",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  },
  {
    type: "item",
    href: "/admin/users",
    label: "Users",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
  },
];

// All hrefs that live under the Pages group
const PAGES_GROUP_HREFS = ["/admin/homepage", "/admin/services", "/admin/projects", "/admin/business", "/admin/about", "/admin/pages"];

export default function AdminNav() {
  const pathname = usePathname();
  const pagesGroupActive = PAGES_GROUP_HREFS.some((h) => pathname === h || pathname.startsWith(h + "/"));
  const [pagesOpen, setPagesOpen] = useState(pagesGroupActive);
  const pagesExpanded = pagesOpen;

  return (
    <nav className="w-64 min-h-screen bg-[#2C2C2C] flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-[#3a3a3a]">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#8B5E3C] rounded flex items-center justify-center">
            <span className="text-white font-bold text-base">N</span>
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">Admin Panel</p>
            <p className="text-[#8C8277] text-xs">Norris Decking</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <ul className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navConfig.map((entry) => {
          if (entry.type === "item") {
            const isActive = pathname === entry.href || pathname.startsWith(entry.href + "/");
            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? "bg-[#8B5E3C] text-white" : "text-[#8C8277] hover:text-white hover:bg-[#3a3a3a]"
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {entry.icon}
                  </svg>
                  {entry.label}
                </Link>
              </li>
            );
          }

          // Group
          const group = entry as NavGroup;
          const groupActive = group.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

          return (
            <li key={group.label}>
              {/* Group header button */}
              <button
                onClick={() => setPagesOpen((o) => !o)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  groupActive && !pagesExpanded ? "bg-[#8B5E3C]/30 text-white" : "text-[#8C8277] hover:text-white hover:bg-[#3a3a3a]"
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {group.icon}
                </svg>
                <span className="flex-1 text-left">{group.label}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${pagesExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Children */}
              {pagesExpanded && (
                <ul className="mt-1 ml-3 pl-3 border-l border-[#3a3a3a] space-y-1">
                  {group.children.map((child) => {
                    const isActive = pathname === child.href || pathname.startsWith(child.href + "/");
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive ? "bg-[#8B5E3C] text-white" : "text-[#8C8277] hover:text-white hover:bg-[#3a3a3a]"
                          }`}
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {child.icon}
                          </svg>
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {/* Bottom actions */}
      <div className="p-4 border-t border-[#3a3a3a] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8C8277] hover:text-white hover:bg-[#3a3a3a] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Website
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/auth/signout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8C8277] hover:text-white hover:bg-[#3a3a3a] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
