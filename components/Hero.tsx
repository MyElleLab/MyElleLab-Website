import Image from "next/image";

import { TaglineWaves } from "@/components/TaglineWaves";
import { HeroMarquee } from "@/components/HeroMarquee";
import { HeroWordmark } from "@/components/HeroWordmark";
import { suites } from "@/lib/products";

const heroIcons = suites.flatMap((s) => s.products);

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-canvas pt-40 pb-28 md:pt-56 md:pb-40"
    >
      {/* Decorative silk backdrop. Replaces the old .ribbons-hero gradients —
          layering both muddied the folds. */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/bg-MyElleLab.webp"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* The image's bottom edge averages ~[241,237,247] against a
            [248,247,251] canvas, which reads as a hard rule across the page.
            This dissolves it into the next section. */}
        <div className="hero-fade absolute inset-x-0 bottom-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 text-center">
        <p className="animate-fade-in font-sans uppercase tracking-eyebrow text-[11px] font-medium text-muted">
          An independent iOS studio
        </p>

        <h1 className="animate-fade-up mt-6 font-serif font-bold tracking-wordmark text-balance text-ink text-6xl sm:text-7xl md:text-8xl lg:text-[112px] leading-[1.02]">
          <HeroWordmark />
        </h1>

        <p className="animate-fade-up mx-auto mt-8 max-w-xl font-serif uppercase tracking-tagline text-[13px] md:text-sm text-ink">
          <TaglineWaves>Focused apps, crafted in suites</TaglineWaves>
        </p>

        <div className="animate-fade-in mt-12">
          <HeroMarquee products={heroIcons} />
        </div>

        <div className="animate-fade-up mt-14 flex items-center justify-center gap-3">
          <a
            href="#suites"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition hover:bg-black"
          >
            Explore our suites
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
          <a
            href="#about"
            className="inline-flex items-center rounded-full border border-ink bg-surface px-6 py-3.5 text-sm font-medium text-ink hover:bg-ink hover:text-white transition"
          >
            About the studio
          </a>
        </div>
      </div>
    </section>
  );
}
