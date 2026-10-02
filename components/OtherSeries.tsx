import Link from "next/link";

import { Marquee } from "@/components/Marquee";
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
 * A marquee rather than a grid: the other series drift past in one row, the
 * same treatment the /blog index gives all five. Four 18-20rem cards are
 * wider than the 7xl container, so one copy always overfills it and the loop
 * shows no gap. Each card has a fixed width, so a description wraps the same
 * way on every card instead of leaving the row ragged.
 */
export function OtherSeries({ current }: { current: BlogSeries }) {
  const others = blogSeries.filter((series) => series.slug !== current.slug);
  if (others.length === 0) return null;

  return (
    <nav aria-labelledby="read-more" className="mt-16">
      {/* The same fading rule the post pages close with, not a border: this
          is a change of subject, not a new section. */}
      <div className="hairline" />

      <h2
        id="read-more"
        className="mt-8 font-sans text-[11px] font-medium tracking-eyebrow text-muted"
      >
        Read more
      </h2>

      <Marquee duration={32} className="mt-4">
        {others.map((series) => (
          <SeriesLink key={series.slug} series={series} />
        ))}
      </Marquee>
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
    <div className="w-72 md:w-80">
      <Link
        href={seriesPath(series)}
        className={[
          "card-edge group flex h-full flex-col rounded-2xl p-5",
          featured ? "bg-ink hover:bg-ink/90" : "bg-surface",
        ].join(" ")}
      >
        {/* text-xl: the size every PostCard title on this page shares. */}
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
    </div>
  );
}
