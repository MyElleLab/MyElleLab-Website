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
  /**
   * Renders the /blog index card ink-filled instead of white. A property on
   * the data, not a slug the card component knows about, so moving the
   * treatment to another series is an edit here and nowhere else.
   */
  featured?: boolean;
};

/**
 * The studio-level series. Its slug is the directory name under content/blog.
 */
export const STUDIO_SERIES: BlogSeries = {
  slug: "myellelab",
  name: "MyElleLab",
  description: "Notes about our story and experiences.",
  featured: true,
};

/**
 * What each suite's series writes about, keyed by suite slug.
 *
 * These used to be `suite.description`, which says what the apps in the suite
 * do. That is the right sentence on the homepage and the wrong one here: a
 * reader landing on /blog/mydailysuccess wants to know what the writing
 * covers, and so does a crawler reading the same page. The two strings were
 * identical only until they needed to say different things.
 *
 * Kept here rather than added to lib/products.ts so the blog owns its own
 * copy: editing a series description can never move the homepage, and editing
 * a suite description can never move the blog. Name and slug still derive
 * from the suite, so renaming one still carries its series along.
 */
const SERIES_DESCRIPTIONS: Record<string, string> = {
  mysmartmates:
    "On AI: what it can actually do, and where it still falls short.",
  mycameraroll:
    "On photography and video: technique, tools, and the images worth keeping.",
  mydailysuccess:
    "On habits, motivation, and the slow work of getting better.",
  myfreetime: "On games, play, and the design behind the things that last.",
};

/* The studio leads; the four suites keep their own order behind it. This is
   the blog's order only. The homepage SUITES section reads `suites` directly
   and still starts at MySmartMates. */
export const blogSeries: BlogSeries[] = [
  STUDIO_SERIES,
  ...suites.map((suite) => {
    const slug = suiteSlug(suite);
    const description = SERIES_DESCRIPTIONS[slug];

    /* A new suite with no entry above would otherwise ship describing its
       apps, which is the bug this table exists to fix, and it would do it
       silently. Fail the build instead, the way a bad post frontmatter
       does. */
    if (!description) {
      throw new Error(
        `lib/series.ts: no series description for the "${slug}" suite. ` +
          `Add one to SERIES_DESCRIPTIONS: it should say what that series ` +
          `writes about, not what its apps do.`,
      );
    }

    return { slug, name: suite.name, description };
  }),
];

export function getSeries(slug: string): BlogSeries | undefined {
  return blogSeries.find((series) => series.slug === slug);
}

/** The single source of truth for a series' href. */
export function seriesPath(series: BlogSeries) {
  return `/blog/${series.slug}`;
}
