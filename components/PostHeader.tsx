import Image from "next/image";
import Link from "next/link";

import { formatPostDate, type Post } from "@/lib/posts";
import { seriesPath } from "@/lib/series";
import { AUTHOR_AVATAR, AUTHOR_URL, DEFAULT_AUTHOR } from "@/lib/site";

/**
 * The header every post opens with, in a fixed order: meta line, title,
 * executive summary, byline, rule. It is the template's top half, so a post
 * never restates any of it; the frontmatter fills it in.
 *
 * The title is Playfair at 700, larger and tighter than TextPage's H1. That
 * is the reference's weight and scale carried into the site's own serif
 * rather than a second display face brought in for the blog alone.
 *
 * The summary is muted and one step above body size. It should read as the
 * argument in brief, clearly apart from the first paragraph of the body.
 */

const AVATAR = 44;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ name }: { name: string }) {
  /* The site photo is the default author's. A guest author gets initials
     rather than someone else's face. */
  const src = name === DEFAULT_AUTHOR ? AUTHOR_AVATAR : undefined;

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={AVATAR}
        height={AVATAR}
        className="shrink-0 rounded-full border border-rule object-cover"
        style={{ width: AVATAR, height: AVATAR }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full border border-rule bg-wisp/60 font-serif text-sm font-semibold text-ink"
      style={{ width: AVATAR, height: AVATAR }}
    >
      {initials(name)}
    </span>
  );
}

export function PostHeader({ post }: { post: Post }) {
  const authorHref = post.author === DEFAULT_AUTHOR ? AUTHOR_URL : undefined;

  return (
    <header className="mx-auto max-w-[34rem]">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-sm text-muted">
        {/* Not uppercased: the series name is a wordmark. */}
        <Link
          href={seriesPath(post.series)}
          className="font-medium text-ink transition hover:text-muted"
        >
          {post.series.name}
        </Link>
        <span aria-hidden>·</span>
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} min read</span>
      </p>

      <h1 className="mt-5 font-serif text-[2.5rem] font-bold leading-[1.04] tracking-[-0.025em] text-balance text-ink md:text-6xl">
        {post.title}
      </h1>

      <p className="mt-6 font-sans text-lg leading-relaxed text-muted md:text-xl md:leading-relaxed">
        {post.summary}
      </p>

      <div className="mt-8 flex items-center gap-3 font-sans text-sm text-muted">
        <Avatar name={post.author} />
        <span>
          Written by{" "}
          {authorHref ? (
            <a
              href={authorHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-ink/30 decoration-2 underline-offset-[6px] transition hover:decoration-ink"
            >
              {post.author}
            </a>
          ) : (
            <span className="font-medium text-ink">{post.author}</span>
          )}
        </span>
      </div>

      <div className="hairline mt-10" />
    </header>
  );
}
