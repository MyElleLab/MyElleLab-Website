import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyElleLab — An iOS studio building focused apps",
  description:
    "MyElleLab is an independent iOS studio. We design and build focused, beautifully crafted iPhone apps, grouped into themed product suites.",
  openGraph: {
    title: SITE_NAME,
    description:
      "An iOS studio building focused apps, crafted in suites.",
    type: "website",
    url: SITE_URL,
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-canvas text-ink font-sans antialiased">
        {/* Studio identity, on every page. Kept to what is verifiable: name,
            url, logo, description, LinkedIn. No legal entity, address or
            founding date — see lib/schema.ts. */}
        <JsonLd data={organizationSchema()} />
        {children}
      </body>
    </html>
  );
}
