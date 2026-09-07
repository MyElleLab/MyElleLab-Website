import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { PostGrid } from "@/components/PostCard";
import { TextPage } from "@/components/TextPage";
import { suiteSlug, suites, type Suite } from "@/lib/products";
import { getPostsInSeries } from "@/lib/posts";
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

  const posts = getPostsInSeries(series);

  return (
    <TextPage
      title={suite.name}
      subtitle={suite.description}
      wide={posts.length > 0 ? <PostGrid posts={posts} /> : null}
    >
      <JsonLd data={blogSeriesSchema(suite)} />

      {/* The empty state stays for a series with nothing in it yet. */}
      {posts.length === 0 && <p className="text-muted">Posts coming soon.</p>}

    </TextPage>
  );
}
