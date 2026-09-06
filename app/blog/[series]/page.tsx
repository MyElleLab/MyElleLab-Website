import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { TextPage } from "@/components/TextPage";
import { suiteSlug, suites, type Suite } from "@/lib/products";
import { blogSeriesSchema } from "@/lib/schema";
import { BLOG_NAME, blogRobots } from "@/lib/site";

type Params = { series: string };

/* The four series routes are generated from the suites data, not from a list
   kept alongside it — renaming a suite moves its series with it. dynamicParams
   is off so a slug that no longer exists 404s instead of rendering an empty
   series page. */
export function generateStaticParams(): Params[] {
  return suites.map((suite) => ({ series: suiteSlug(suite) }));
}

export const dynamicParams = false;

function findSuite(series: string): Suite | undefined {
  return suites.find((suite) => suiteSlug(suite) === series);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { series } = await params;
  const suite = findSuite(series);
  if (!suite) return {};

  return {
    title: `${suite.name} — ${BLOG_NAME}`,
    description: suite.description,
    // Noindexed while this series is empty. Lifting it is one edit —
    // BLOG_INDEXABLE in lib/site.ts — which also adds this route to the
    // sitemap, so the two signals can never disagree.
    robots: blogRobots,
  };
}

export default async function BlogSeriesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { series } = await params;
  const suite = findSuite(series);
  if (!suite) notFound();

  return (
    <TextPage title={suite.name} subtitle={suite.description}>
      <JsonLd data={blogSeriesSchema(suite)} />

      <p className="text-muted">Posts coming soon.</p>

      {/* The first post is a fill-in, not a design job. Replace the empty
          state above with this list, and give each post an entry in a
          `posts` array keyed by suite slug — same shape as lib/products.ts,
          so the series pages stay data-driven.

          <ol className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <p className="font-sans uppercase tracking-eyebrow text-[11px] font-medium text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold tracking-wordmark text-ink">
                  <Link
                    href={`${blogSeriesPath(suite)}/${post.slug}`}
                    className="hover:text-muted transition"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 font-sans text-muted leading-relaxed">
                  {post.excerpt}
                </p>
              </li>
            ))}
          </ol>
      */}

      {/* And one BlogPosting per post, emitted next to it with the same
          <JsonLd /> component. Every field below is required or strongly
          recommended by schema.org for an Article — leave none of them
          undefined, or the tag renders the string "undefined" and the post
          is worse off than with no structured data at all.

          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,          // <= 110 chars
              description: post.excerpt,
              datePublished: post.date,      // ISO 8601, e.g. "2026-09-06"
              dateModified: post.updated ?? post.date,
              author: { "@type": "Person", name: post.author },
              image: absoluteUrl(post.image),
              articleBody: post.body,
              url: `${absoluteUrl(blogSeriesPath(suite))}/${post.slug}`,
              isPartOf: blogSeriesSchema(suite),
              publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
              },
            }}
          />
      */}
    </TextPage>
  );
}
