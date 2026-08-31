import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

/**
 * Shell for the legal routes so they carry the real site chrome — same nav,
 * same footer, same type — rather than reading as bare documents.
 */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="relative z-10">
      <Nav />
      <section className="relative bg-canvas pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-wordmark text-balance leading-[1.05] text-ink">
            {title}
          </h1>
          {/* ~65ch keeps the measure comfortable once real copy lands. */}
          <div className="mt-8 max-w-[65ch] font-sans text-ink leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
