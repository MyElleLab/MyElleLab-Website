import { ImageResponse } from "next/og";

import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SAFE_INSET_Y,
  OG_SIZE,
  markDataUri,
  ogFonts,
  publicImageDataUri,
} from "@/lib/og";
import { getPost, getPosts } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

type Params = { series: string; slug: string };

/**
 * The post card, in the site's current language: the cover as a card with
 * the blog cards' hard edge (2px ink border, solid offset shadow), and beside
 * it the post header in brief: meta line, title, byline.
 *
 * The description is left out on purpose. Every platform that shows this
 * image prints the description under it, so repeating it here would only
 * shrink the title.
 *
 * Geometry is explicit throughout: Satori sizes text against a stated width,
 * and a flex-grown column leaves it unbounded.
 */

const EDGE = 56;
/* 16:9, the covers' own ratio, so `cover` fit crops nothing. */
const CARD_W = 560;
const CARD_H = Math.round((CARD_W * 9) / 16);
const BORDER = 3;
/* The site's 5px offset at card scale is lost at thumbnail size; 10px reads
   as the same edge once the image is shrunk into a feed. */
const SHADOW = 10;
const GAP = 60;
const TEXT_X = EDGE + CARD_W + SHADOW + GAP;
const TEXT_W = OG_SIZE.width - TEXT_X - EDGE;
const TEXT_H = CARD_H + SHADOW;

/* Guard: if the card ever grows, the column must still clear the safe band. */
if (TEXT_H > OG_SIZE.height - OG_SAFE_INSET_Y * 2) {
  throw new Error("Post OG card is taller than the safe band");
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/* A static alt: Next's file convention does not take a per-post one without
   generateImageMetadata, which does not combine with generateStaticParams
   here. The image itself carries the title, so the alt names the site. */
export const alt = `A post on the ${SITE_NAME} blog`;

export function generateStaticParams(): Params[] {
  return getPosts().map((post) => ({
    series: post.seriesSlug,
    slug: post.slug,
  }));
}

/**
 * Title size, by how much title there is, in three steps rather than a
 * continuous fit: the jumps are invisible across a set of posts, where a
 * formula would make every card a slightly different size for no reason a
 * reader could name. Thresholds are where the line count changes at this
 * measure (about 470px), checked against the shortest title ("Find what is
 * uncommon", 21) and the longest ("Guideline 2.1(b): adding the subscription
 * group is not enough", 61).
 */
function titleSize(title: string) {
  if (title.length <= 26) return 60;
  if (title.length <= 44) return 52;
  return 44;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { series, slug } = await params;
  const post = getPost(series, slug);

  const fonts = ogFonts();
  if (!post) {
    return new ImageResponse(<div style={{ background: OG_COLORS.canvas }} />, {
      ...size,
      fonts,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: OG_COLORS.canvas,
          fontFamily: "Geist",
          paddingLeft: EDGE,
        }}
      >
        {/* The cover card. A post without a cover keeps the card as an empty
            wisp panel, so every post card has the same silhouette. */}
        <div
          style={{
            display: "flex",
            width: CARD_W,
            height: CARD_H,
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: 28,
            border: `${BORDER}px solid ${OG_COLORS.ink}`,
            background: post.cover ? OG_COLORS.canvas : OG_COLORS.wisp,
            boxShadow: `${SHADOW}px ${SHADOW}px 0 0 ${OG_COLORS.ink}`,
          }}
        >
          {post.cover && (
            <img
              src={publicImageDataUri(post.cover)}
              width={CARD_W - BORDER * 2}
              height={CARD_H - BORDER * 2}
              style={{
                width: CARD_W - BORDER * 2,
                height: CARD_H - BORDER * 2,
                objectFit: "cover",
              }}
            />
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: TEXT_W,
            /* The column spans exactly the card, shadow included, so the
               meta line sits on the card's top edge and the byline on its
               bottom. At 325px centred, both stay well inside the middle 80
               per cent that survives every platform crop. */
            height: TEXT_H,
            marginLeft: SHADOW + GAP,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* The post header's meta line: series as a wordmark in ink, then
                the read time. The mark sits in front as the studio's
                signature. The date is left out: a link preview outlives the
                week it was posted, and a date makes it look stale. */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 22,
                color: OG_COLORS.muted,
              }}
            >
              <img
                src={markDataUri()}
                width={36}
                height={36}
                style={{ borderRadius: 8, marginRight: 14 }}
              />
              <span style={{ fontWeight: 500, color: OG_COLORS.ink }}>
                {post.series.name}
              </span>
              <span style={{ margin: "0 10px" }}>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>

            <div
              style={{
                display: "flex",
                width: TEXT_W,
                marginTop: 28,
                fontFamily: "Playfair Display",
                fontWeight: 700,
                fontSize: titleSize(post.title),
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                color: OG_COLORS.ink,
              }}
            >
              {post.title}
            </div>
          </div>

          {/* The byline, as the post header sets it: initials in a wisp disc
              until a photo exists, then "Written by" and the name. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 22,
              color: OG_COLORS.muted,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 26,
                border: `2px solid ${OG_COLORS.ink}`,
                background: OG_COLORS.wisp,
                fontFamily: "Playfair Display",
                fontWeight: 700,
                fontSize: 20,
                color: OG_COLORS.ink,
                marginRight: 16,
              }}
            >
              {initials(post.author)}
            </div>
            {/* One text run: Satori spaces separate flex children
                unevenly, so "Written by" and the name are one line with the
                name picked out in a nested span. */}
            <div style={{ display: "flex" }}>
              {`Written by\u00a0`}
              <span style={{ fontWeight: 500, color: OG_COLORS.ink }}>
                {post.author}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
