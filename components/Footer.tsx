import Link from "next/link";

import { suites } from "@/lib/products";
import { cn } from "@/lib/utils";
import {
  CONTACT_EMAIL,
  LINKEDIN_URL,
  SITE_NAME,
  STUDIO_DESCRIPTION,
} from "@/lib/site";

/**
 * The page close, in two parts.
 *
 * 1. A contact card on the lavender, with the blog cards' hard edge. It sits
 *    above the ink block rather than inside it: an ink border and an ink
 *    shadow on an ink ground would vanish. It also takes over the space that
 *    used to sit empty between the last section and the footer.
 *
 * 2. The ink block: studio line and site links, the apps grouped by suite
 *    (the way the rest of the site is organised), then the legal row.
 *
 * Colour: white for links and names, `muted-ink` (8.30:1 on ink) for
 * secondary text, white/15 for rules. Every link is at least 44px tall so the
 * lists work as touch targets, not only as text.
 */

const STUDIO_LINKS = [
  { href: "/", label: "Apps" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

/** "(E)go" style names carry their icon letter in parentheses. */
function displayName(name: string) {
  return name.replace(/[()]/g, "");
}

const LINK =
  "inline-flex min-h-11 items-center font-sans text-sm text-white transition hover:text-muted-ink " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const LABEL = "font-sans text-xs font-medium tracking-eyebrow text-muted-ink";

export function Footer({
  variant = "full",
  contact = true,
}: {
  variant?: "full" | "slim";
  /** The "Write to the studio" card above the ink block. The blog leaves it
      off: a reader there is reading, and Contact is one click away in the
      header. */
  contact?: boolean;
}) {
  if (variant === "slim") return <SlimFooter />;

  const groups = suites
    .map((suite) => ({
      name: suite.name,
      apps: suite.products.filter((p) => p.siteUrl),
    }))
    .filter((group) => group.apps.length > 0);

  return (
    <footer className="relative">
      {/* Contact. id="contact" is the nav's Contact target, so the link lands
          on the card that answers it rather than on the fine print. */}
      {/* No background of its own: the section above (the home page's
          gradient, a blog page's canvas) runs on behind the card. */}
      {contact && (
        <div>
          <div className="mx-auto max-w-7xl px-6 pb-16 md:px-10 md:pb-20">
            <section
              id="contact"
              aria-labelledby="contact-title"
              className="scroll-mt-24 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[5px_5px_0_0_theme(colors.ink)] md:flex md:items-center md:justify-between md:gap-10 md:p-10"
            >
              <div>
                <h2
                  id="contact-title"
                  className="font-serif text-3xl font-bold leading-[1.08] tracking-[-0.025em] text-ink md:text-4xl"
                >
                  Write to the studio.
                </h2>
                <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-muted">
                  Questions about one of our apps, press, or any feedback.
                </p>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-6 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-6 font-sans text-sm font-semibold text-white transition hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:mt-0 md:w-auto"
              >
                {CONTACT_EMAIL}
                {/* A plain arrow, not the external-link arrow: mailto opens the
                  reader's mail app, not another site. */}
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </section>
          </div>
        </div>
      )}

      <div className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:px-10 md:pt-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
            {/* Studio */}
            <div className="md:col-span-4">
              <p className="font-serif text-2xl font-bold tracking-wordmark text-white">
                {SITE_NAME}
              </p>
              {/* The Organization JSON-LD reads this same constant, so the
                  machine-readable description and the visible one stay one
                  string. */}
              <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-muted-ink">
                {STUDIO_DESCRIPTION}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <nav aria-labelledby="footer-studio">
                  <h2 id="footer-studio" className={LABEL}>
                    Studio
                  </h2>
                  <ul className="mt-2">
                    {STUDIO_LINKS.map((l) => (
                      <li key={l.href}>
                        {l.href.includes("#") ? (
                          <a href={l.href} className={LINK}>
                            {l.label}
                          </a>
                        ) : (
                          <Link href={l.href} className={LINK}>
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div>
                  <h2 className={LABEL}>Follow</h2>
                  <ul className="mt-2">
                    <li>
                      <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK}
                      >
                        LinkedIn
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Apps, one column per suite. Suite names are wordmarks, so
                they keep their camelCase rather than being uppercased. */}
            <nav aria-labelledby="footer-apps" className="md:col-span-8">
              <h2 id="footer-apps" className="sr-only">
                Apps
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                {groups.map((group) => (
                  <div key={group.name}>
                    <h3 className={LABEL}>{group.name}</h3>
                    <ul className="mt-2">
                      {group.apps.map((app) => (
                        <li key={app.slug}>
                          <a
                            href={app.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={LINK}
                          >
                            {displayName(app.name)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>

          <div className="mt-16 border-t border-white/15 pt-6 font-sans text-xs text-muted-ink">
            {/* Legal links are unlinked while /privacy, /terms and /company are
                still placeholders. The routes remain in the repo, noindexed
                and with no inbound links. To restore them, add a row here in
                the same style as the copyright line, linking /privacy
                ("Privacy Policy"), /terms ("Terms of Use") and /company
                ("Company Details"). */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
              </p>
              <p>Designed and built in-house.</p>
            </div>

            {/* Required attribution: the site uses iPhone, iOS, App Store and
                the Apple glyph on the Download buttons. Apple's own wording,
                including the capital "IOS" for Cisco's mark. */}
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-ink/80">
              Apple, the Apple logo, iPhone, iPad, and App Store are trademarks
              of Apple Inc., registered in the U.S. and other countries. IOS is
              a trademark or registered trademark of Cisco in the U.S. and other
              countries and is used under license.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * The home page's footer: one ink bar under the apps wheel, which holds the
 * page to a single screen. No contact card; the address sits in the bar
 * instead and carries id="contact", so the header's Contact link still lands
 * on something here.
 */
function SlimFooter() {
  return (
    <footer className="shrink-0 border-t-2 border-ink bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-2 font-sans text-xs text-muted-ink sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
        <a
          id="contact"
          href={`mailto:${CONTACT_EMAIL}`}
          className={cn(LINK, "-mx-2 px-2 text-xs")}
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
