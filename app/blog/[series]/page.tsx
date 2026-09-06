import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TextPage } from "@/components/TextPage";
import { suiteSlug, suites, type Suite } from "@/lib/products";

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
    title: `${suite.name} — MyElleLab Blog`,
    description: suite.description,
    // TODO: remove `robots` once this series has real posts. An empty series
    // page indexed as your blog is worse than not being indexed at all.
    robots: { index: false, follow: false },
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
    </TextPage>
  );
}
