import Link from "next/link";

import type { Post } from "@/lib/posts";

/**
 * Previous/next within the series. Either end may be missing — a single-post
 * series shows nothing, and the first and last posts show one side. The two
 * links sit on opposite edges, so a lone "next" stays right-aligned rather
 * than sliding into the "previous" slot.
 */
export function SeriesNav({
  previous,
  next,
}: {
  previous?: Post;
  next?: Post;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="More in this series"
      className="mt-16 flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:items-start sm:justify-between"
    >
      {previous ? (
        <Link href={previous.href} className="group max-w-[46%] min-w-0">
          <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted">
            ← Previous
          </span>
          <span className="mt-1.5 block font-serif text-lg leading-snug tracking-wordmark text-ink transition group-hover:text-muted">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}

      {next && (
        <Link href={next.href} className="group max-w-[46%] min-w-0 sm:text-right">
          <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted">
            Next →
          </span>
          <span className="mt-1.5 block font-serif text-lg leading-snug tracking-wordmark text-ink transition group-hover:text-muted">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
