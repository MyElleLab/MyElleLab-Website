import { AppsWheel } from "@/components/AppsWheel";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

/* One screen: header, the apps wheel, a slim footer bar. The wheel loops
   without end, so a footer below it could never be scrolled to; the page is
   held to the viewport instead and the wheel takes the height that is left.
   The top padding clears the fixed header.

   Pinned with fixed inset-0 rather than a 100svh height: svh is the viewport
   with every browser bar showing, and Chrome on iOS shows more than that, so
   a 100svh page ended above the bottom of the screen and left a band of bare
   canvas under the footer. A fixed box is the viewport, whatever the bars do,
   so the footer always sits on the screen's bottom edge. */
export default function Page() {
  return (
    <main className="home-screen fixed inset-0 z-10 flex flex-col pt-[var(--nav-h)]">
      <Nav />
      {/* Skip-link target: after the nav, so "Skip to content" skips it. */}
      <div id="main" tabIndex={-1} className="outline-none" />
      <AppsWheel />
      <Footer variant="slim" />
    </main>
  );
}
