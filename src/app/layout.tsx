import type { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import { Playfair_Display, Lato } from "next/font/google";
import { prisma } from "@/lib/prisma";
import BrowserCompat from "@/components/BrowserCompat";
import Script from "next/script";
import "./globals.css";

// Force all pages to be dynamic (never pre-rendered at build time)
// This prevents Prisma queries from running when there is no database
export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  unstable_noStore();
  const defaultMeta: Metadata = {
    title: "Norris Decking & Sheds | Adelaide & Surrounds",
    description: "Premium custom decks and sheds built by Jason Norris. Servicing Adelaide and surrounds. Quality craftsmanship, honest service, lasting results.",
    keywords: ["decking Adelaide", "custom sheds Adelaide", "deck builder Adelaide", "Norris Decking"],
  };
  try {
    const rows = await prisma.siteSettings.findMany();
    const s = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
    const title = s.site_meta_title || defaultMeta.title as string;
    const description = s.site_meta_description || defaultMeta.description as string;
    const keywords = s.site_meta_keywords
      ? s.site_meta_keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
      : defaultMeta.keywords as string[];
    return { title, description, keywords };
  } catch {
    return defaultMeta;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GCPW3P19P8"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GCPW3P19P8');
          `}
        </Script>
        <BrowserCompat />
        {children}
      </body>
    </html>
  );
}

