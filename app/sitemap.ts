import type { MetadataRoute } from "next";

import { blogSeriesPath, suites } from "@/lib/products";
import { getPosts } from "@/lib/posts";
import { BLOG_INDEXABLE, absoluteUrl } from "@/lib/site";

/**
 * /sitemap.xml
 *
 * Every URL is derived from the suites data and the blog slug helper, so a
 * new or renamed suite moves through here without an edit. A hand-kept list
 * goes stale in silence — nothing fails, the sitemap just quietly stops
 * describing the site.
 *
 * What is NOT here, and why:
 *
 *   /privacy, /terms, /company — all three carry `robots: { index: false }`
 *   while they are placeholders. A sitemap entry means "index this"; the page
 *   says "don't". Sending both is a contradiction, so the noindexed page is
 *   simply left out.
 *
 *   /blog, the four series pages and every post — same reason, for now.
 *   They are written
 *   out below and gated on BLOG_INDEXABLE rather than commented out, so
 *   lifting the noindex is one edit in lib/site.ts and the sitemap follows in
 *   the same breath. The two can't drift apart.
 *
 * TODO: nothing to uncomment here — set BLOG_INDEXABLE = true in lib/site.ts
 * when the first posts land, and these five URLs appear automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /* Build time. Good enough for a site whose content ships with the deploy —
     every page here changes only when the site is rebuilt. */
  const lastModified = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl("/"),
    lastModified,
    changeFrequency: "monthly",
    priority: 1,
  };

  const blog: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/blog"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...suites.map((suite) => ({
      url: absoluteUrl(blogSeriesPath(suite)),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    /* Posts. getPosts() already drops drafts in production, so a draft is
       never advertised. lastModified is the post's own date, not the build's:
       a rebuild should not tell crawlers every post changed. */
    ...getPosts().map((post) => ({
      url: absoluteUrl(post.href),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [home, ...(BLOG_INDEXABLE ? blog : [])];
}
