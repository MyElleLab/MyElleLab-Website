import { Reveal } from "./Reveal";

const team = [
  { initials: "LF", gradient: "from-flame-500 to-rose-500" },
  { initials: "DF", gradient: "from-sky-400 to-indigo-500" },
  { initials: "LC", gradient: "from-emerald-400 to-teal-600" },
];

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-flame-500/90">
            About the studio
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-semibold tracking-tightest text-balance leading-[1.05] max-w-3xl">
            Three people. One studio.{" "}
            <span className="text-white/55">
              iPhone apps with a clear point of view.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-2xl text-white/65 leading-relaxed text-lg">
            MyElleLab is an independent iOS studio. We build apps the way we
            wish more apps were built: small in scope, generous in detail, and
            built to live on your home screen for years.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-14 flex items-center gap-4">
            <div className="flex -space-x-3">
              {team.map((m) => (
                <div
                  key={m.initials}
                  className={`size-12 rounded-full ring-2 ring-ink-950 bg-gradient-to-br ${m.gradient} grid place-items-center font-display text-sm font-semibold text-white/95`}
                  aria-hidden
                >
                  {m.initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/55">
              The three founders — design, engineering, product.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
