import { suites } from "@/lib/products";

export function Footer() {
  const sites = suites
    .flatMap((s) => s.products)
    .filter((p) => p.siteUrl)
    .map((p) => ({
      name: p.name,
      siteUrl: p.siteUrl!,
      label: p.siteUrl!.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    }));

  return (
    <footer
      id="contact"
      className="relative bg-canvas border-t border-rule mt-12"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold tracking-wordmark text-xl text-ink">
                MyElleLab
              </span>
            </div>
            <p className="mt-4 max-w-sm font-sans text-muted leading-relaxed text-sm">
              An independent iOS studio building focused apps, crafted in
              suites.
            </p>
            <a
              href="mailto:hello@myellelab.com"
              className="mt-6 inline-flex items-center gap-2 text-sm font-sans text-ink hover:text-muted transition"
            >
              hello@myellelab.com
              <svg
                viewBox="0 0 24 24"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-sans uppercase tracking-eyebrow text-[11px] font-medium text-muted">
              Apps
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {sites.map((s) => (
                <li key={s.siteUrl}>
                  <a
                    href={s.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-ink hover:text-muted transition"
                  >
                    {s.name}{" "}
                    <span className="text-muted">— {s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-sans uppercase tracking-eyebrow text-[11px] font-medium text-muted">
              Follow
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/company/myellelab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-ink hover:text-muted transition"
                >
                  LinkedIn @MyElleLab
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-rule font-sans text-muted">
          {/* Legal links are unlinked while /privacy, /terms and /company are
              still placeholders. The routes remain in the repo, noindexed and
              with no inbound links. To restore the row: uncomment the block
              below, add back `import { Fragment } from "react"` and
              `import Link from "next/link"`, and put `mt-4` back on the
              copyright row underneath so it clears this one.

              const legalLinks = [
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
                { href: "/company", label: "Company Details" },
              ];

              <nav
                aria-label="Legal"
                className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs"
              >
                {legalLinks.map((l, i) => (
                  <Fragment key={l.href}>
                    {i > 0 && (
                      <span aria-hidden className="select-none opacity-50">
                        ·
                      </span>
                    )}
                    <Link href={l.href} className="hover:text-ink transition">
                      {l.label}
                    </Link>
                  </Fragment>
                ))}
              </nav>
          */}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <p>© {new Date().getFullYear()} MyElleLab. All rights reserved.</p>
            <p>Designed & built in-house.</p>
          </div>

          {/* Required attribution: the site uses iPhone, iOS, App Store and the
              Apple glyph on the Download buttons. Fine print by design. */}
          <p className="mt-4 max-w-3xl text-[11px] leading-relaxed">
            Apple, the Apple logo, iPhone, iPad, and App Store are trademarks of
            Apple Inc., registered in the U.S. and other countries. iOS is a
            trademark or registered trademark of Cisco in the U.S. and other
            countries and is used under license.
          </p>
        </div>
      </div>
    </footer>
  );
}
