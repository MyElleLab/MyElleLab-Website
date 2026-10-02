import type { Metadata } from "next";

import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "About — MyElleLab",
  description:
    "MyElleLab is an independent iOS studio of five people, building small, focused iPhone apps.",
  alternates: { canonical: "/about" },
};

/* The About section that used to close the home page, moved here unchanged
   when the home page became the apps wheel. The top padding clears the fixed
   nav. */
export default function AboutPage() {
  return (
    <main className="relative z-10">
      <Nav />
      <div id="main" tabIndex={-1} className="outline-none" />
      <div className="pt-[var(--nav-h)]">
        <About />
      </div>
      <Footer />
    </main>
  );
}
