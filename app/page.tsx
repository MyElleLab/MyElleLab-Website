import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Suites } from "@/components/Suites";

export default function Page() {
  return (
    <main className="relative z-10">
      <Nav />
      {/* Skip-link target: after the nav, so "Skip to content" skips it. */}
      <div id="main" tabIndex={-1} className="outline-none" />
      <Hero />
      <Suites />
      <About />
      <Footer />
    </main>
  );
}
