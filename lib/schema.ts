import type { Post } from "@/lib/posts";
import { seriesPath, type BlogSeries } from "@/lib/series";
import {
  AUTHOR_URL,
  BLOG_DESCRIPTION,
  DEFAULT_AUTHOR,
  BLOG_NAME,
  LINKEDIN_URL,
  LOGO_PATH,
  SITE_NAME,
  SITE_URL,
  STUDIO_DESCRIPTION,
  absoluteUrl,
} from "@/lib/site";

/**
 * Schema.org objects, built from the same constants the page renders.
 *
 * Deliberately absent from the Organization: legalName, address,
 * foundingDate, numberOfEmployees, vatID, taxID and telephone. MyElleLab is
 * not a registered company, and structured data asserting otherwise would be
 * a false claim about a legal entity — machine-readable, and on every page.
 * Omitting a property is always valid; guessing one is not.
 */

/** Referenced by the Blog schemas so the two are linked rather than repeated. */
const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
} as const;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    description: STUDIO_DESCRIPTION,
    sameAs: [LINKEDIN_URL],
  };
}

export function blogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: BLOG_NAME,
    description: BLOG_DESCRIPTION,
    url: absoluteUrl("/blog"),
    publisher,
  };
}

export function blogSeriesSchema(series: BlogSeries) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${series.name} — ${BLOG_NAME}`,
    description: series.description,
    url: absoluteUrl(seriesPath(series)),
    publisher,
    isPartOf: {
      "@type": "Blog",
      name: BLOG_NAME,
      url: absoluteUrl("/blog"),
    },
  };
}

/**
 * One post. `author` is a Person carrying the byline and the personal site,
 * which is what lets a search or AI-search result attribute the piece rather
 * than leaving it anonymous.
 *
 * `image` is only set when the post actually has a cover; an Article with an
 * image property pointing at nothing is worse than one without.
 */
export function blogPostingSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: absoluteUrl(post.href),
    author: {
      "@type": "Person",
      name: post.author,
      /* The personal site belongs to the default author, so it is only
         attached when the byline is actually theirs. A guest byline with
         someone else's URL would be a false attribution, and a machine-
         readable one at that. */
      ...(post.author === DEFAULT_AUTHOR ? { url: AUTHOR_URL } : {}),
    },
    ...(post.cover ? { image: absoluteUrl(post.cover) } : {}),
    publisher,
    isPartOf: {
      "@type": "Blog",
      name: `${post.series.name} — ${BLOG_NAME}`,
      url: absoluteUrl(seriesPath(post.series)),
    },
  };
}
