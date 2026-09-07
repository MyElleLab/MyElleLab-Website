import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { PostGrid } from "@/components/PostCard";
import { TextPage } from "@/components/TextPage";
import { getLatestPosts } from "@/lib/posts";
import { blogSeries, seriesPath, type BlogSeries } from "@/lib/series";
import { blogSchema } from "@/lib/schema";
import { BLOG_DESCRIPTION, SITE_NAME, blogRobots } from "@/lib/site";

export const metadata: Metadata = {
  title: `Blog — ${SITE_NAME}`,
  description: BLOG_DESCRIPTION,
  // Noindexed while the series pages are empty. Lifting it is one edit —
  // BLOG_INDEXABLE in lib/site.ts — which also adds these routes to the
  // sitemap, so the two signals can never disagree.
  robots: blogRobots,
};

/** How many recent posts the index shows under the series cards. */
const LATEST_COUNT = 6;

export default function BlogIndexPage() {
  const latest = getLatestPosts(LATEST_COUNT);

  return (
    <TextPage
      title="Blog"
      subtitle={BLOG_DESCRIPTION}
      wide={
        latest.length > 0 ? (
          <section aria-labelledby="latest" className="mt-16">
            <h2
              id="latest"
              className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted"
            >
              Latest
            </h2>
            <div className="mt-6">
              <PostGrid posts={latest} />
            </div>
          </section>
        ) : null
      }
    >
      <JsonLd data={blogSchema()} />
      <ul className="space-y-3">
        {blogSeries.map((series) => (
          <li key={series.slug}>
            <SeriesCard series={series} />
          </li>
        ))}
      </ul>
    </TextPage>
  );
}

/**
 * One series row. The featured series is the same component in a different
 * state: identical radius, padding, type and hover, with an ink fill instead
 * of the white surface. Only the colours differ.
 *
 * The description drops from `muted` (3.78:1 on ink, which fails AA) to
 * `muted-ink` at 8.30:1 — see tailwind.config.ts.
 */
function SeriesCard({ series }: { series: BlogSeries }) {
  const featured = series.featured === true;

  return (
    <Link
      href={seriesPath(series)}
      className={[
        "group block rounded-2xl border px-6 py-5 transition",
        featured
          ? "border-ink bg-ink hover:bg-ink/90"
          : "border-rule bg-surface hover:border-ink/20 hover:bg-canvas",
      ].join(" ")}
    >
      <span className="flex items-baseline justify-between gap-4">
        <span
          className={[
            "font-serif text-xl md:text-2xl font-semibold tracking-wordmark",
            featured ? "text-white" : "text-ink",
          ].join(" ")}
        >
          {series.name}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={[
            "size-4 shrink-0 self-center transition",
            featured
              ? "text-white/60 group-hover:text-white"
              : "text-muted group-hover:text-ink",
          ].join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
      <span
        className={[
          "mt-1.5 block font-sans text-sm leading-relaxed",
          featured ? "text-muted-ink" : "text-muted",
        ].join(" ")}
      >
        {series.description}
      </span>
    </Link>
  );
}
