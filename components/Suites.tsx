import { suites } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function Suites() {
  return (
    <section
      id="suites"
      className="section-anchor relative bg-canvas py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
            <div>
              <p className="font-sans uppercase tracking-eyebrow text-[11px] font-medium text-muted">
                Product suites
              </p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl font-semibold tracking-wordmark text-balance text-ink max-w-2xl leading-[1.05]">
                Apps grouped by what they help you do.
              </h2>
            </div>
            <p className="md:max-w-sm font-sans text-muted leading-relaxed">
              Each suite is a small family of focused iPhone apps designed to
              work together, with a shared sensibility.
            </p>
          </div>
        </Reveal>

        <div className="space-y-24 md:space-y-32">
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
    <div className="relative">
      <Reveal>
        <div className="relative flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="font-sans uppercase tracking-eyebrow text-[11px] font-medium text-muted">
              {idx} / {tot}
            </span>
            <h3 className="mt-3 font-serif text-3xl md:text-4xl font-semibold tracking-wordmark text-ink">
              {suite.name}
            </h3>
            <p className="mt-2 font-sans text-muted max-w-xl">
              {suite.description}
            </p>
          </div>
          <div className="hairline hidden sm:block flex-1 mb-3 ml-6" />
        </div>
      </Reveal>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {suite.products.map((p, i) => (
          <Reveal key={p.name} delay={i * 80} className="h-full">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
