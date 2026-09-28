import type { Metadata } from "next";

/**
 * Single source of truth for the strings that appear in more than one place —
 * the footer, the root metadata, robots.txt, the sitemap and the JSON-LD all
 * read from here rather than each carrying their own copy.
 */

/* www, because that is the host Vercel serves: the bare domain redirects to
   it. Every absolute URL (sitemap, robots.txt, canonical and Open Graph via
   metadataBase, JSON-LD, share links) is built from this, so a sitemap entry
   answers 200 instead of a redirect. */
export const SITE_URL = "https://www.myellelab.com";
export const SITE_NAME = "MyElleLab";

/** The studio line the footer prints under the wordmark. */
export const STUDIO_DESCRIPTION =
  "An independent iOS studio building focused apps, crafted in suites.";

export const LINKEDIN_URL = "https://www.linkedin.com/company/myellelab/";
export const CONTACT_EMAIL = "hello@myellelab.com";

/** The mark the nav renders; also the Organization schema's logo. */
export const LOGO_PATH = "/myellelab-logo.svg";

/**
 * The byline every post carries unless its frontmatter names someone else.
 * Kept here so adding a post does not mean retyping the name, and so a change
 * of byline is one edit rather than one per file.
 */
export const DEFAULT_AUTHOR = "Leonardo Ferhati";

/** The author's personal site — the Person `url` in a post's JSON-LD. */
export const AUTHOR_URL = "https://leonardoferhati.com";

/**
 * The byline photo, a square image under /public. Unset, the byline draws the
 * author's initials in a lavender disc instead, so a post never shows a
 * broken image. Setting it is the one edit that swaps the placeholder out
 * everywhere, e.g. "/author-leonardo.jpg".
 */
export const AUTHOR_AVATAR: string | undefined = undefined;

export const BLOG_NAME = `${SITE_NAME} Blog`;
export const BLOG_DESCRIPTION =
  "Notes from the studio: one series per suite, plus the studio itself.";

/** Absolute URL for a site-relative path. Schema.org and sitemaps both want
    fully-qualified URLs, and a leading-slash path is what the app deals in. */
export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/**
 * Whether the blog is fit to be indexed. It was held false until every series
 * had at least one published post, since an empty page indexed as your blog
 * is worse than not being indexed at all. That condition was met on
 * 27 September 2026 and the flag is now true.
 *
 * One constant drives both halves: the blog routes' robots tag (see
 * `blogRobots` below) and their presence in the sitemap (see app/sitemap.ts),
 * so the sitemap can never advertise a URL whose page says "don't index me".
 * If a series is ever emptied again, setting this back to false withdraws
 * both at once.
 */
export const BLOG_INDEXABLE = true;

/**
 * `robots` metadata for the blog routes. `undefined` emits no robots tag at
 * all, which is what an indexable page wants.
 */
export const blogRobots: Metadata["robots"] = BLOG_INDEXABLE
  ? undefined
  : { index: false, follow: false };
