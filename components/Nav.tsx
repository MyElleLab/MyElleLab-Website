"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#suites", label: "Suites" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "backdrop-blur-xl bg-ink-950/70 border-b border-white/5"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="group flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-flame-500 shadow-[0_0_18px_rgba(249,115,22,0.7)]" />
          <span className="font-display font-semibold tracking-tight text-[17px]">
            MyElleLab
          </span>
        </a>
        <ul className="flex items-center gap-1 md:gap-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
