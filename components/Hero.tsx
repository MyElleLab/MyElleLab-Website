import { EyebrowWaves } from "@/components/EyebrowWaves";
import { HeroWordmark } from "@/components/HeroWordmark";
import { IconBloom } from "@/components/IconBloom";
import { suites } from "@/lib/products";

const heroIcons = suites.flatMap((s) => s.products);

export function Hero() {
  return (
    <section
      id="top"
      className="ribbons-hero relative isolate overflow-hidden pt-40 pb-28 md:pt-56 md:pb-40"
    >
      <div className="relative mx-auto max-w-6xl px-6 md:px-10 text-center">
        <p className="animate-fade-in font-sans uppercase tracking-eyebrow text-[11px] font-medium text-muted">
          <EyebrowWaves>An independent iOS studio</EyebrowWaves>
        </p>

        <h1 className="animate-fade-up mt-6 font-serif font-bold tracking-wordmark text-balance text-ink text-6xl sm:text-7xl md:text-8xl lg:text-[112px] leading-[1.02]">
          <HeroWordmark />
        </h1>

        <p className="animate-fade-up mx-auto mt-8 max-w-xl font-serif uppercase tracking-tagline text-[13px] md:text-sm text-ink">
          Focused apps, crafted in suites
        </p>

        <div className="animate-fade-in mt-12 flex flex-wrap items-center justify-center gap-3">
          {heroIcons.map((p) => (
            <IconBloom key={p.name} src={p.iconSrc} alt="" />
          ))}
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
