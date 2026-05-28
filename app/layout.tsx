import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
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
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="grain ambient min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
