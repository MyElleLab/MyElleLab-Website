import { Reveal } from "./Reveal";

const team = [
  { initials: "LF", gradient: "from-rose-500 to-pink-600" },
  { initials: "DF", gradient: "from-sky-400 to-indigo-600" },
  { initials: "LC", gradient: "from-emerald-400 to-teal-600" },
];

export function About() {
  return (
    <section
      id="about"
      className="ribbons-about relative py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal>
          <p className="font-sans uppercase tracking-eyebrow text-[11px] font-medium text-muted">
            About the studio
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl font-semibold tracking-wordmark text-balance leading-[1.05] max-w-3xl text-ink">
            Three people. One studio.
            <br />
            <span className="text-muted">
              iPhone apps with a clear point of view.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-2xl font-sans text-ink leading-relaxed text-lg">
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
                  className={`size-12 rounded-full ring-2 ring-canvas bg-gradient-to-br ${m.gradient} grid place-items-center font-serif text-sm font-semibold text-white shadow-sm`}
                  aria-hidden
                >
                  {m.initials}
                </div>
              ))}
            </div>
            <p className="font-sans text-sm text-muted">
              The three founders — design, engineering, product.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
