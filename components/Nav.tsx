"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "./Logo";

/* Root-relative, not bare hashes: the nav is reused on /privacy, /terms,
   /company and the blog, where "#suites" and "#about" point at sections that
   do not exist on the page. "/#suites" resolves from anywhere. Blog is a real
   route rather than a fragment, so it renders as a Link (see below). */
const links = [
  { href: "/#suites", label: "Suites" },
  { href: "/blog", label: "Blog" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const linkClass =
  "px-3 py-2 rounded-full text-muted hover:text-ink transition";

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
          ? "backdrop-blur-xl bg-canvas/80 border-b border-rule"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5 text-ink">
          <LogoMark size={28} className="shrink-0 rounded-md border border-rule" />
          {/* The wordmark is desktop-only. Four links plus a 90px wordmark do
              not fit the 342px of content width a 390px phone leaves: the row
              was already within 5px of the edge at three links, and "Blog"
              pushed "Contact" off-screen. The mark carries the brand at this
              size, and its alt text keeps the link named for screen readers. */}
          <span className="hidden sm:inline font-serif font-bold tracking-wordmark text-[19px]">
            MyElleLab
          </span>
        </Link>
        <ul className="flex items-center gap-1 md:gap-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              {/* Fragments stay plain anchors so the hash jump and smooth
                  scroll behave; real routes go through Link for client-side
                  navigation, which also makes them work from the blog pages
                  themselves. */}
              {l.href.includes("#") ? (
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
