"use client";

import { useEffect, useRef } from "react";

export function Hero() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (orbRef.current) {
          orbRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-40 pb-28 md:pt-56 md:pb-40"
    >
      {/* Parallax warm orb */}
      <div
        ref={orbRef}
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(249,115,22,0.55), rgba(249,115,22,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10 text-center">
        <p className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
          <span className="size-1.5 rounded-full bg-flame-500 shadow-[0_0_10px_rgba(249,115,22,0.9)]" />
          Independent iOS studio
        </p>

        <h1 className="animate-fade-up mt-8 font-display font-semibold tracking-tightest text-balance text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[1.02]">
          An iOS studio building
          <br className="hidden sm:block" />{" "}
          <span className="bg-gradient-to-br from-white via-white to-flame-400 bg-clip-text text-transparent">
            focused apps,
          </span>{" "}
          crafted in suites.
        </h1>

        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-base md:text-lg text-white/60 leading-relaxed">
          MyElleLab is four people designing and shipping iPhone apps that do
          one thing beautifully — grouped into themed suites that share a
          purpose.
        </p>

        <div className="animate-fade-up mt-10 flex items-center justify-center gap-3">
          <a
            href="#suites"
            className="group inline-flex items-center gap-2 rounded-full bg-flame-500 px-6 py-3.5 text-sm font-medium text-ink-950 shadow-glow transition hover:bg-flame-400"
          >
            Explore our suites
            <svg
              className="size-4 transition-transform group-hover:translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/[0.05] hover:text-white transition"
          >
            About the studio
          </a>
        </div>
      </div>
    </section>
  );
}
