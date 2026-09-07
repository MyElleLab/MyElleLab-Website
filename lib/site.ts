import type { Metadata } from "next";

/**
 * Single source of truth for the strings that appear in more than one place —
 * the footer, the root metadata, robots.txt, the sitemap and the JSON-LD all
 * read from here rather than each carrying their own copy.
 */

export const SITE_URL = "https://myellelab.com";
export const SITE_NAME = "MyElleLab";

/** The studio line the footer prints under the wordmark. */
export const STUDIO_DESCRIPTION =
  "An independent iOS studio building focused apps, crafted in suites.";

export const LINKEDIN_URL = "https://www.linkedin.com/company/myellelab/";
export const CONTACT_EMAIL = "hello@myellelab.com";

/** The mark the nav renders; also the Organization schema's logo. */
export const LOGO_PATH = "/myellelab-logo.svg";

export const BLOG_NAME = `${SITE_NAME} Blog`;
export const BLOG_DESCRIPTION =
  "Notes from the studio: one series per suite, following the same shape as the apps themselves.";

/** Absolute URL for a site-relative path. Schema.org and sitemaps both want
    fully-qualified URLs, and a leading-slash path is what the app deals in. */
export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/**
 * Whether the blog is fit to be indexed. It is not, while the series pages
 * hold no posts: an empty page indexed as your blog is worse than not being
 * indexed at all.
 *
 * TODO: flip this to `true` when the first real posts land. That single edit
 * does both halves of the job at once — the blog routes drop their noindex
 * (see `blogRobots` below) and the sitemap starts listing them (see
 * app/sitemap.ts). They are deliberately wired to the same constant so the
 * sitemap can never advertise a URL whose page says "don't index me".
 */
export const BLOG_INDEXABLE = false;

/**
 * `robots` metadata for the blog routes. `undefined` emits no robots tag at
 * all, which is what an indexable page wants.
 */
export const blogRobots: Metadata["robots"] = BLOG_INDEXABLE
  ? undefined
  : { index: false, follow: false };
