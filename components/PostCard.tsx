import Image from "next/image";
import Link from "next/link";

import { formatPostDate, type Post } from "@/lib/posts";

/**
 * One post, on the series pages and the /blog index.
 *
 * White surface, the cards' existing radius, and the shared hard edge
 * (`card-edge` in globals.css): 2px ink border, solid 5px offset shadow.
 *
 * A post with no cover renders without the image area rather than with a
 * placeholder; `items-stretch` on the grid plus `h-full` on the card keeps a
 * covered and an uncovered card the same height side by side.
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={post.href}
      className="group flex h-full flex-col overflow-hidden card-edge rounded-2xl bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      {post.cover && (
        <div className="relative aspect-video w-full overflow-hidden border-b-2 border-ink bg-canvas">
          <Image
            src={post.cover}
            alt={post.coverAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-grow flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          {/* Not uppercased: the series names are camelCase brand names, and
              "MYELLELAB" loses the shape of the wordmark. Letter-spacing and
              size are unchanged. */}
          <span className="font-sans text-[11px] font-medium tracking-eyebrow text-muted">
            {post.series.name}
          </span>
          <time
            dateTime={post.date}
            className="shrink-0 font-sans text-xs text-muted"
          >
            {formatPostDate(post.date)}
          </time>
        </div>

        <h3 className="mt-3 line-clamp-2 font-serif text-xl font-semibold leading-snug tracking-wordmark text-ink">
          {post.title}
        </h3>

        {/* Text stays top-aligned; the column below it absorbs the slack. A
            covered and an uncovered card in the same row end up the same
            height via items-stretch + h-full + flex-grow above, and pinning
            the description to the bottom instead would only move the gap
            somewhere uglier. */}
        <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-muted">
          {post.description}
        </p>
      </div>
    </Link>
  );
}

/** The card grid, shared by the series pages and the /blog index. */
export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.href} post={post} />
      ))}
    </div>
  );
}
