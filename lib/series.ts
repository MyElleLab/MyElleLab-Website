import { suiteSlug, suites } from "@/lib/products";

/**
 * The blog's series.
 *
 * Four of them are the product suites, derived from lib/products.ts exactly as
 * before — renaming a suite still moves its series. The fifth is the studio
 * itself, for writing that belongs to MyElleLab rather than to any one product:
 * App Review, subscriptions, how things get built. Forcing a post like that
 * under a product suite would misfile it permanently.
 *
 * So a series is no longer strictly a suite. It is a suite *or* the studio, and
 * this list is what the blog routes, the /blog index and the sitemap iterate.
 */
export type BlogSeries = {
  slug: string;
  name: string;
  description: string;
};

/**
 * The studio-level series. Its slug is the directory name under content/blog,
 * and it sits last so the four product suites keep their deliberate order.
 */
export const STUDIO_SERIES: BlogSeries = {
  slug: "myellelab",
  name: "MyElleLab",
  description:
    "Notes from building the studio — what shipping actually involves.",
};

export const blogSeries: BlogSeries[] = [
  ...suites.map((suite) => ({
    slug: suiteSlug(suite),
    name: suite.name,
    description: suite.description,
  })),
  STUDIO_SERIES,
];

export function getSeries(slug: string): BlogSeries | undefined {
  return blogSeries.find((series) => series.slug === slug);
}

/** The single source of truth for a series' href. */
export function seriesPath(series: BlogSeries) {
  return `/blog/${series.slug}`;
}
