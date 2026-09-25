import Link from "next/link";

import { blogSeries, seriesPath, type BlogSeries } from "@/lib/series";

/**
 * A way out of a series page that is not the back button.
 *
 * The list is derived from `blogSeries` with the current one filtered out, so
 * a new series appears here the moment it exists and no page ever links to
 * itself. Nothing here knows a name or a slug.
 *
 * The card is PostCard's: the same surface, hairline, radius, shadow, hover
 * lift and `h-full flex-col`. PostCard is the card sitting directly above
 * this row on a series page that has posts, so borrowing any other card would
 * put two card languages on one page.
 *
 * Two up rather than four across. Four fit, and are in fact shorter overall,
 * but at 285px three of the four descriptions wrap to a second line and the
 * fourth does not, so the row reads ragged. At 590px every name and every
 * description is one line. 590 also sits near the page's own 544px prose
 * measure, where 285 is narrower than anything else on the page and makes the
 * row read as a denser continuation of the post grid rather than a footer to
 * it.
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

      <ul className="mt-6 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2">
        {others.map((series) => (
          <SeriesLink key={series.slug} series={series} />
        ))}
      </ul>
    </nav>
  );
}

/**
 * The studio series keeps the ink fill it has on the /blog index.
 *
 * When this row was 11px text links the fill was left off, on the grounds
 * that an inked link among muted ones is indistinguishable from the hover
 * state and would be read as "you are here" — which is the one thing it
 * cannot mean, since the current series is never in this list. At card size
 * that does not hold: a filled card among white cards reads as identity, the
 * way it already does on /blog, because a card carries a fill as what it is
 * rather than as what state it is in.
 *
 * So it is carried, and the two surfaces now agree on the one distinction the
 * data actually makes: MyElleLab is the studio, not a product suite.
 *
 * The description drops from `muted` to `muted-ink` on the fill, for the same
 * reason as on /blog: muted is 3.78:1 on ink and fails AA, muted-ink is 8.30.
 */
function SeriesLink({ series }: { series: BlogSeries }) {
  const featured = series.featured === true;

  return (
    <li className="h-full">
      <Link
        href={seriesPath(series)}
        className={[
          "group flex h-full flex-col rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md",
          featured
            ? "border-ink bg-ink hover:bg-ink/90"
            : "border-rule bg-surface hover:border-ink/15",
        ].join(" ")}
      >
        {/* text-xl, not the /blog index's text-xl md:text-2xl. That card is
            full width and can carry 24px; these are half width. 20px is the
            size both neighbours share: the /blog card below its breakpoint,
            and every PostCard title on this page. */}
        <span
          className={[
            "font-serif text-xl font-semibold leading-snug tracking-wordmark",
            featured ? "text-white" : "text-ink",
          ].join(" ")}
        >
          {series.name}
        </span>
        <span
          className={[
            "mt-2 block font-sans text-sm leading-relaxed",
            featured ? "text-muted-ink" : "text-muted",
          ].join(" ")}
        >
          {series.description}
        </span>
      </Link>
    </li>
  );
}
