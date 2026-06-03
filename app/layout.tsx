import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
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
    title: "MyElleLab",
    description:
      "An iOS studio building focused apps, crafted in suites.",
    type: "website",
    url: "https://myellelab.com",
  },
  metadataBase: new URL("https://myellelab.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-canvas text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
