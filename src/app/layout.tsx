import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { prisma } from "@/lib/prisma";
import BrowserCompat from "@/components/BrowserCompat";
import Script from "next/script";
import "./globals.css";

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
  const rows = await prisma.siteSettings.findMany();
  const s = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  const title = s.site_meta_title || "Norris Decking & Sheds | Adelaide & Surrounds";
  const description = s.site_meta_description || "Premium custom decks and sheds built by Jason Norris. Servicing Adelaide and surrounds. Quality craftsmanship, honest service, lasting results.";
  const keywords = s.site_meta_keywords
    ? s.site_meta_keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["decking Adelaide", "custom sheds Adelaide", "deck builder Adelaide", "Norris Decking"];
  return { title, description, keywords };
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

