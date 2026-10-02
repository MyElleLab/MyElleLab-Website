import { AppsWheel } from "@/components/AppsWheel";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

/* One screen: header, the apps wheel, a slim footer bar. The wheel loops
   without end, so a footer below it could never be scrolled to; the page is
   held to the viewport instead and the wheel takes the height that is left.
   The top padding clears the fixed header. */
export default function Page() {
  return (
    <main className="relative z-10 flex h-[100svh] min-h-[30rem] flex-col pt-[var(--nav-h)]">
      <Nav />
      {/* Skip-link target: after the nav, so "Skip to content" skips it. */}
      <div id="main" tabIndex={-1} className="outline-none" />
      <AppsWheel />
      <Footer variant="slim" />
    </main>
  );
}
