import type { Metadata } from "next";
import "@/styles/globals.css";
import SiteChrome from "@/components/SiteChrome";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { buildMetadata, localBusinessSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata({
    title: "Nikoo Aesthetics | Appearance Linked to Health",
    description:
      "Premium medical aesthetics in London. Anti-wrinkle injections, dermal fillers, skin boosters and more — delivered with medical precision and natural results.",
  }),
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = localBusinessSchema();

  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router head placement is correct; this rule predates app router */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:text-warm focus:px-5 focus:py-3 focus:rounded-full focus:font-body focus:text-sm"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <SiteChrome />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
