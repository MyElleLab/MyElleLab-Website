"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "./Logo";

/* Blog, About and Contact. The home page is the apps wheel and nothing else,
   so About is a page of its own now rather than a section. Contact is rendered
   separately below as the bar's one action. Any fragment link added here must
   be root-relative ("/#section"), because the nav is reused on pages where a
   bare "#section" does not exist. */
const links = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

/* 44px tall so each link is a real touch target, not just its text. Every
   section link carries a 2px underline (a pseudo-element under the label):
   light ink at rest, full ink on hover, and full ink with ink text when it is
   the current page, so "you are here" still reads apart from the rest. */
const LINK =
  "relative inline-flex min-h-11 items-center rounded-md px-2.5 sm:px-3 transition-colors duration-200 " +
  "after:absolute after:inset-x-2.5 sm:after:inset-x-3 after:bottom-2 after:h-0.5 after:rounded-full after:transition-colors after:duration-200 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const LINK_IDLE = "text-muted hover:text-ink after:bg-ink/25 hover:after:bg-ink";
const LINK_ACTIVE = "font-medium text-ink after:bg-ink";

/* Contact is the one action in the bar, so it is drawn as one: a small pill
   with the cards' hard edge, scaled down (3px offset for a 40px control). */
const CONTACT =
  "ml-1 inline-flex min-h-10 items-center rounded-full border-2 border-ink bg-surface px-3.5 sm:px-4 font-medium text-ink " +
  "shadow-[3px_3px_0_0_theme(colors.ink)] transition duration-200 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_0_theme(colors.ink)] " +
  "motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export function Nav() {
  const pathname = usePathname();

  /* A hard 2px ink rule separates the bar from every page, at the top and
     while scrolling: the same edge weight as the cards and the Contact pill.
     The bar keeps its own translucent ground at all times so the rule never
     floats over the hero on its own. */
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-ink bg-canvas/85 backdrop-blur-xl">
      {/* First tab stop on every page, visible only when focused. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:border-2 focus:border-ink focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-2.5 rounded-md text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <LogoMark size={28} className="shrink-0 rounded-md border border-rule" />
          {/* The wordmark shows at every width again: with two items on the
              right there is room for it on a 375px phone, which the four-link
              bar did not have. */}
          <span className="font-serif font-bold tracking-wordmark text-[19px]">
            MyElleLab
          </span>
        </Link>
        <ul className="flex items-center gap-0.5 md:gap-1 text-sm">
          {links.map((l) => {
            /* Only real routes can be current; a fragment such as /#about is
               a place on the home page, not a page of its own. */
            const active = !l.href.includes("#") && pathname.startsWith(l.href);
            const className = `${LINK} ${active ? LINK_ACTIVE : LINK_IDLE}`;
            return (
            <li key={l.href}>
              {/* Fragments stay plain anchors so the hash jump and smooth
                  scroll behave; real routes go through Link for client-side
                  navigation, which also makes them work from the blog pages
                  themselves. */}
              {l.href.includes("#") ? (
                <a href={l.href} className={className}>
                  {l.label}
                </a>
              ) : (
                <Link
                  href={l.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              )}
            </li>
            );
          })}
          <li>
            {/* The contact card at the foot of /about. */}
            <a href="/about#contact" className={CONTACT}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
