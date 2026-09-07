import { blogSeriesPath, type Suite } from "@/lib/products";
import type { Post } from "@/lib/posts";
import {
  BLOG_DESCRIPTION,
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

export function blogSeriesSchema(suite: Suite) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${suite.name} — ${BLOG_NAME}`,
    description: suite.description,
    url: absoluteUrl(blogSeriesPath(suite)),
    publisher,
    isPartOf: {
      "@type": "Blog",
      name: BLOG_NAME,
      url: absoluteUrl("/blog"),
    },
  };
}

/**
 * One post. No `author`: the studio has not decided how posts are bylined,
 * and an invented or placeholder author is worse than none — schema.org
 * treats author as optional, so omitting it is valid.
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
    ...(post.cover ? { image: absoluteUrl(post.cover) } : {}),
    publisher,
    isPartOf: {
      "@type": "Blog",
      name: `${post.suite.name} — ${BLOG_NAME}`,
      url: absoluteUrl(blogSeriesPath(post.suite)),
    },
  };
}
