import Image from "next/image";

import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";
import { allProducts, appStoreUrl } from "@/lib/products";

/* Each card is the app's own og-image, copied from its site's repo under
   ~/Developer/landing-page/<app>/ into public/og/<slug>.jpg. MySuccess has no
   site og-image yet, so public/og/ego.jpg is a stand-in drawn in the same
   style (dark ground, icon tile, name, tagline); replace it when the real one
   exists. An app with no file here falls back to its icon. */
const OG_SLUGS = new Set([
  "mysellingmate",
  "mylooper",
  "mytwinlens",
  "mygrowth",
  "ego",
  "mymoodlab",
  "myyahtzee",
]);

const items: WorksWheelItem[] = allProducts.map((p) => ({
  title: p.name,
  image: OG_SLUGS.has(p.slug) ? `/og/${p.slug}.jpg` : p.iconSrc,
  icon: p.iconSrc,
  href: p.siteUrl ?? appStoreUrl(p),
}));

/**
 * The home page: every app on one endless wheel. It fills whatever height the
 * page leaves it between the header and the footer bar, so the page itself
 * never scrolls and every scroll over the wheel turns it.
 */
export function AppsWheel() {
  return (
    <section
      id="apps"
      aria-labelledby="apps-heading"
      className="relative min-h-0 flex-1 bg-canvas"
    >
      <h1 id="apps-heading" className="sr-only">
        MyElleLab: focused iPhone apps, crafted in suites
      </h1>
      {/* The silk backdrop the old hero used, behind the wheel. */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src="/bg-MyElleLab.webp"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <WorksWheel
        items={items}
        label="Our apps"
        action="Visit"
        className="bg-transparent"
      />
      <p
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-6 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted md:left-10"
      >
        <span className="hidden md:inline">Scroll to turn</span>
        <span className="md:hidden">Swipe to turn</span>
      </p>
    </section>
  );
}
