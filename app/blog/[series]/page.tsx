import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { OtherSeries } from "@/components/OtherSeries";
import { PostGrid } from "@/components/PostCard";
import { TextPage } from "@/components/TextPage";
import { getPostsInSeries } from "@/lib/posts";
import { blogSeries, getSeries } from "@/lib/series";
import { blogSeriesSchema } from "@/lib/schema";
import { BLOG_NAME, blogRobots } from "@/lib/site";

type Params = { series: string };

/* Series routes are generated from lib/series.ts — the four suites plus the
   studio — not from a list kept alongside it, so renaming a suite moves its
   series with it. dynamicParams is off so a slug that no longer exists 404s
   instead of rendering an empty series page. */
export function generateStaticParams(): Params[] {
  return blogSeries.map((series) => ({ series: series.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { series } = await params;
  const found = getSeries(series);
  if (!found) return {};

  return {
    title: `${found.name} — ${BLOG_NAME}`,
    description: found.description,
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
  const found = getSeries(series);
  if (!found) notFound();

  const posts = getPostsInSeries(series);

  return (
    <TextPage
      title={found.name}
      subtitle={found.description}
      /* `wide` renders below `children`, so the row goes here rather than
         beside the empty state: that is what puts it under the grid when
         there is one and under "Posts coming soon." when there is not. */
      wide={
        <>
          {posts.length > 0 && <PostGrid posts={posts} />}
          <OtherSeries current={found} />
        </>
      }
    >
      <JsonLd data={blogSeriesSchema(found)} />

      {/* The empty state stays for a series with nothing in it yet. */}
      {posts.length === 0 && <p className="text-muted">Posts coming soon.</p>}
    </TextPage>
  );
}
