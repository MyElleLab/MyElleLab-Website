import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * Crawlers we name explicitly. A blanket `User-agent: *` already allows every
 * one of them — they are listed so that a future edit narrowing the blanket
 * rule has to look at this split and decide deliberately.
 *
 * The two groups are not interchangeable:
 */

/**
 * Search and citation agents. These fetch a page live to answer a question
 * someone is asking right now, and they are what makes the site eligible to
 * be *cited* in an AI answer. Blocking these is the single most common way a
 * site makes itself invisible to AI search — it removes the citation, not the
 * training. If there is ever a reason to block training, it is not a reason
 * to touch this list.
 */
const SEARCH_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

/**
 * Training agents. These collect pages that may end up in a model's training
 * data. For an unknown studio that is upside: being known by a model at all
 * beats being absent from it. Allowed on purpose.
 */
const TRAINING_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

/**
 * /robots.txt
 *
 * CRITICAL — do not add Disallow rules for the noindexed pages (/privacy,
 * /terms, /company, and the blog while it is empty). robots.txt and noindex
 * are not two ways of saying the same thing:
 *
 *   robots.txt stops the *fetch*. noindex is a tag *inside the response*.
 *
 * A crawler blocked in robots.txt never fetches the page, so it never reads
 * the noindex — and the URL can still surface in results, ranked on inbound
 * links alone, as a bare title with no description. Disallowing a noindexed
 * page defeats the noindex. The pages stay fetchable; their own tag does the
 * work. Exclusion from the sitemap (see app/sitemap.ts) does the rest.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...[...SEARCH_AGENTS, ...TRAINING_AGENTS].map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
