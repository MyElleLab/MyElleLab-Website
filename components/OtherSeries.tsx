import Link from "next/link";

import { blogSeries, seriesPath, type BlogSeries } from "@/lib/series";

/**
 * A way out of a series page that is not the back button.
 *
 * The list is derived from `blogSeries` with the current one filtered out, so
 * a new series appears here the moment it exists and no page ever links to
 * itself. Nothing here knows a name or a slug.
 *
 * Deliberately undifferentiated: the studio series carries `featured` and the
 * /blog index fills its card with ink, but that is a hierarchy among cards a
 * reader is choosing between. In a row of wayfinding links, emphasis reads as
 * state rather than as category, and the one thing a reader would take it for
 * is "you are here" — which is the one series this row never contains.
 *
 * It wraps rather than scrolls. Four names do not fit on one line at 390px,
 * and a scroller would put the last of them off-screen behind no affordance,
 * which is a poor trade for navigation whose whole job is to show where you
 * can go. Wrapping costs one line.
 */
export function OtherSeries({ current }: { current: BlogSeries }) {
  const others = blogSeries.filter((series) => series.slug !== current.slug);
  if (others.length === 0) return null;

  return (
    <nav aria-label="Other series" className="mt-16">
      {/* The same fading rule the post pages close with, not a border: this
          is a change of subject, not a new section. */}
      <div className="hairline" />

      <h2 className="mt-8 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted">
        Other series
      </h2>

      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {others.map((series) => (
          <li key={series.slug}>
            <Link
              href={seriesPath(series)}
              /* Not uppercased, unlike the label above it. These are
                 wordmarks, and the two places that already set a series name
                 at this size leave their capitals alone: the post card's
                 series line and the post page's series link. Uppercasing
                 flattens MySmartMates into one run of letters. */
              className="font-sans text-[11px] font-medium tracking-eyebrow text-muted transition hover:text-ink"
            >
              {series.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
