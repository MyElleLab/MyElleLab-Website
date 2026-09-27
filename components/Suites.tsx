import { suites } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

/**
 * The suites, one row each: the suite's number, name and line on the left,
 * its apps on the right.
 *
 * Rows rather than a heading over a three-column grid, because no suite has
 * three apps: the grid left a third to two thirds of every row empty and ran
 * the section to about 2,500px. In a row the apps take a two-column grid
 * beside the name, so the section is roughly half as tall and nothing sits
 * empty. A 1px ink rule separates the rows, the same crisp line the header
 * draws under itself.
 */
export function Suites() {
  return (
    <section
      id="suites"
      className="section-anchor relative bg-canvas py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="mb-14 max-w-2xl md:mb-16">
            <p className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted">
              Product suites
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-balance text-ink md:text-6xl">
              Apps grouped by what they help you do.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-muted">
              Each suite is a small family of focused iPhone apps designed to
              work together, with a shared sensibility.
            </p>
          </div>
        </Reveal>

        <div className="border-b border-ink">
          {suites.map((suite, idx) => (
            <Suite
              key={suite.id}
              suite={suite}
              index={idx}
              total={suites.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Suite({
  suite,
  index,
  total,
}: {
  suite: (typeof import("@/lib/products").suites)[number];
  index: number;
  total: number;
}) {
  const idx = String(index + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");

  return (
    <div className="grid grid-cols-1 gap-8 border-t border-ink py-12 md:py-14 lg:grid-cols-12 lg:gap-10">
      <Reveal className="lg:col-span-4">
        <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted">
          {idx} / {tot}
        </span>
        <h3 className="mt-3 font-serif text-3xl font-bold tracking-[-0.02em] text-ink md:text-4xl">
          {suite.name}
        </h3>
        <p className="mt-3 max-w-sm font-sans leading-relaxed text-muted">
          {suite.description}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:col-span-8">
        {suite.products.map((p, i) => (
          <Reveal key={p.name} delay={i * 80} className="h-full">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
