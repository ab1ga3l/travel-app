import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer, Header } from "@/components/Header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: visa help and travel guides for African passports`, template: `%s · ${SITE.name}` },
  description:
    "Visa requirements, real visa stories, country guides with best months and budgets, and an AI travel assistant. Built Africa-first.",
  openGraph: { siteName: SITE.name, type: "website" },
};

export const viewport: Viewport = { themeColor: "#14213d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
