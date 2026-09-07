import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

/**
 * Shell for the site's prose routes — legal pages, the blog index, the blog
 * series pages — so they carry the real site chrome: same nav, same footer,
 * same type. The top padding clears the fixed nav (h-16) with room to spare.
 *
 * `subtitle` is the one thing the blog needed that the legal pages did not: a
 * standing line under the H1 that is not part of the body copy.
 */
export function TextPage({
  title,
  eyebrow,
  meta,
  subtitle,
  children,
  wide,
}: {
  title: string;
  /** Small tracked line above the H1 — the post pages' series link. */
  eyebrow?: ReactNode;
  /** Small line under the H1 — the post pages' date. */
  meta?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  /**
   * Rendered below the measure at the full container width. Card grids need
   * the whole page; prose does not.
   */
  wide?: ReactNode;
}) {
  return (
    <main className="relative z-10">
      <Nav />
      <section className="relative bg-canvas pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {eyebrow && <div className="mb-5">{eyebrow}</div>}
          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-wordmark text-balance leading-[1.05] text-ink">
            {title}
          </h1>
          {meta && (
            <p className="mt-4 font-sans text-sm text-muted">{meta}</p>
          )}
          {subtitle && (
            <p className="mt-5 max-w-[34rem] font-sans text-lg text-muted leading-relaxed">
              {subtitle}
            </p>
          )}
          {/* 544px, about 72 characters of running prose.

              Not `65ch`: CSS `ch` is the advance width of the "0" glyph, and
              Geist's zero is 10.61px at 16px, so 65ch computed to 690px and
              fitted roughly 91 characters. That is well past the comfortable
              45 to 75. A fixed rem value keeps the measure independent of the
              typeface's figure width. */}
          {children && (
            <div className="mt-8 max-w-[34rem] font-sans text-ink leading-relaxed space-y-4">
              {children}
            </div>
          )}
          {wide && <div className="mt-8">{wide}</div>}
        </div>
      </section>
      <Footer />
    </main>
  );
}
