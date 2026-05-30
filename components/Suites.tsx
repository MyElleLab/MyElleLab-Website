import { suites } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function Suites() {
  return (
    <section id="suites" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-flame-500/90">
                Product suites
              </p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tightest text-balance max-w-2xl leading-[1.05]">
                Apps grouped by what they help you do.
              </h2>
            </div>
            <p className="md:max-w-sm text-white/55 leading-relaxed">
              Each suite is a small family of focused iPhone apps designed to
              work together, with a shared sensibility.
            </p>
          </div>
        </Reveal>

        <div className="space-y-24 md:space-y-32">
          {suites.map((suite, idx) => (
            <Suite key={suite.id} suite={suite} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Suite({
  suite,
  index,
}: {
  suite: (typeof import("@/lib/products").suites)[number];
  index: number;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-x-10 -top-20 h-72 rounded-[40px] blur-3xl opacity-70 bg-gradient-to-b ${suite.accent}`}
      />

      <Reveal>
        <div className="relative flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="font-mono text-xs text-white/40">
              0{index + 1} / 0{2}
            </span>
            <h3 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {suite.name}
            </h3>
            <p className="mt-2 text-white/55 max-w-xl">{suite.description}</p>
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
