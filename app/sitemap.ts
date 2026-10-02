import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/posts";
import { blogSeries, seriesPath } from "@/lib/series";
import { BLOG_INDEXABLE, absoluteUrl } from "@/lib/site";

/**
 * /sitemap.xml
 *
 * Every URL is derived from lib/series.ts and the content layer, so a
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
 * The blog (/blog, every series page, every published post) is gated on
 * BLOG_INDEXABLE in lib/site.ts, the same constant that sets those pages'
 * robots tag, so the sitemap and the pages can't drift apart. Drafts never
 * appear: getPosts() drops them in production.
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

  const about: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl("/about"),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  };

  const blog: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/blog"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogSeries.map((series) => ({
      url: absoluteUrl(seriesPath(series)),
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

  return [home, about, ...(BLOG_INDEXABLE ? blog : [])];
}
