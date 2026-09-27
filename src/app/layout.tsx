import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import FloatingNav from "@/components/nav/FloatingNav";
import MagneticCursor from "@/components/cursor/MagneticCursor";
import AmbientNoise from "@/components/background/AmbientNoise";
import Preloader from "@/components/loader/Preloader";
import FXLayer from "@/components/fx/FXLayer";
import AnimeImpactFlash from "@/components/fx/AnimeImpactFlash";
import { site } from "@/data/site";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: {
    default: site.seo.title,
    template: `%s — ${site.name}`,
  },
  description: site.seo.description,
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${site.name} — Portfolio`,
    locale: site.seo.locale.replace("_", "-"),
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1012",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${syne.variable} ${inter.variable}`}
    >
      <body className="font-body antialiased">
        {/* Skip link — first tab stop on every page */}
        <a
          href="#main"
          data-cursor="hover"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-fg focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>
          <FloatingNav />
          {children}
        </SmoothScrollProvider>
        <Preloader />
        <AmbientNoise />
        <MagneticCursor />
        <FXLayer />
        <AnimeImpactFlash />
      </body>
    </html>
  );
}
