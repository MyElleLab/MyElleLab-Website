import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { MdxContent } from "@/components/mdx/MdxContent";
import { PostGrid } from "@/components/PostCard";
import { SeriesNav } from "@/components/PostNav";
import { PostShare } from "@/components/PostShare";
import { RelatedApp } from "@/components/RelatedApp";
import { TextPage } from "@/components/TextPage";
import { seriesPath } from "@/lib/series";
import {
  formatPostDate,
  getPost,
  getPosts,
  getPostsElsewhere,
  getSeriesNeighbours,
} from "@/lib/posts";
import { blogPostingSchema } from "@/lib/schema";
import { absoluteUrl, blogRobots } from "@/lib/site";

type Params = { series: string; slug: string };

/* In production this lists published posts only, so a draft has no route at
   all and dynamicParams: false turns its URL into a 404. In dev getPosts()
   includes drafts, which is what makes a draft previewable. */
export function generateStaticParams(): Params[] {
  return getPosts().map((post) => ({
    series: post.seriesSlug,
    slug: post.slug,
  }));
}

export const dynamicParams = false;

/** At least this many posts elsewhere, or the section is not worth showing. */
const ELSEWHERE_MIN = 2;
const ELSEWHERE_MAX = 3;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { series, slug } = await params;
  const post = getPost(series, slug);
  if (!post) return {};

  const images = post.cover
    ? [{ url: absoluteUrl(post.cover), alt: post.coverAlt }]
    : undefined;

  return {
    title: `${post.title} — ${post.series.name}`,
    description: post.description,
    robots: blogRobots,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: absoluteUrl(post.href),
      publishedTime: post.date,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { series, slug } = await params;
  const post = getPost(series, slug);
  if (!post) notFound();

  const { previous, next } = getSeriesNeighbours(post);
  const elsewhere = getPostsElsewhere(post, ELSEWHERE_MAX);

  return (
    <TextPage
      title={post.title}
      eyebrow={
        <Link
          href={seriesPath(post.series)}
          /* Not uppercased: this is a series name, and the camelCase wordmark
             is the name. Size, tracking, colour and spacing are unchanged, so
             it still reads as an eyebrow. Section labels that are not names
             ("Elsewhere in the studio", "Latest") stay uppercase. */
          className="font-sans text-[11px] font-medium tracking-eyebrow text-muted transition hover:text-ink"
        >
          {post.series.name}
        </Link>
      }
      meta={
        <>
          {post.author}
          {/* Thin spaces around the separator so it reads as punctuation
              rather than as a bullet in a list. */}
          <span aria-hidden> · </span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        </>
      }
      wide={
        elsewhere.length >= ELSEWHERE_MIN ? (
          <section aria-labelledby="elsewhere" className="mt-20">
            <h2
              id="elsewhere"
              className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-muted"
            >
              Elsewhere in the studio
            </h2>
            <div className="mt-6">
              <PostGrid posts={elsewhere} />
            </div>
          </section>
        ) : null
      }
    >
      <JsonLd data={blogPostingSchema(post)} />

      {post.cover && (
        <Image
          src={post.cover}
          alt={post.coverAlt ?? ""}
          width={1280}
          height={720}
          priority
          className="w-full rounded-2xl border border-rule object-cover"
        />
      )}

      <MdxContent source={post.body} />

      {/* Closing matter. The hairline is the only separator: the share
          controls and the app line are asides, not new sections. */}
      <div className="hairline mt-14" />

      {/* The canonical URL, not window.location, so a preview deployment
          cannot leak its host into a shared link. */}
      <PostShare title={post.title} url={absoluteUrl(post.href)} />

      {post.relatedApp && post.relatedPitch && (
        <RelatedApp product={post.relatedApp} pitch={post.relatedPitch} />
      )}

      <SeriesNav previous={previous} next={next} />
    </TextPage>
  );
}
