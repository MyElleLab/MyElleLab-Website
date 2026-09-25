import { ImageResponse } from "next/og";

import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SAFE_INSET_Y,
  OG_SIZE,
  OG_SPLIT_X,
  markDataUri,
  ogFonts,
  publicImageDataUri,
} from "@/lib/og";
import { getPost, getPosts } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

type Params = { series: string; slug: string };

/* The right panel, and the measure the title wraps against inside it. Both
   are explicit: Satori sizes text against a stated width, and a flex-grown
   column leaves it unbounded. */
const PAD_L = 56;
const PAD_R = 68;
const PANEL_W = OG_SIZE.width - OG_SPLIT_X;
const TEXT_W = PANEL_W - PAD_L - PAD_R;

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
 * Title size, by how much title there is.
 *
 * One size cannot serve both ends of the range honestly. "Find what is
 * uncommon" is 21 characters and "Guideline 2.1(b): adding the subscription
 * group is not enough" is 61, so a size generous enough for the long one
 * leaves the short one looking timid in a panel it barely fills, and a size
 * right for the short one runs the long one past the bottom of the safe band.
 *
 * Three steps rather than a continuous fit: the jumps are invisible across a
 * set of posts, where a formula would make every card a slightly different
 * size for no reason a reader could name. The thresholds are where the line
 * count changes at this measure, not round numbers.
 */
function titleSize(title: string) {
  if (title.length <= 26) return 68;
  if (title.length <= 44) return 60;
  return 52;
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
          background: OG_COLORS.canvas,
          fontFamily: "Geist",
        }}
      >
        {/* The cover fills the left panel and bleeds off the top, left and
            bottom. `cover` rather than `contain`: a contained image in a
            panel this tall would letterbox into the same floating picture
            this layout exists to get rid of. */}
        {post.cover && (
          <img
            src={publicImageDataUri(post.cover)}
            width={OG_SPLIT_X}
            height={OG_SIZE.height}
            style={{
              width: OG_SPLIT_X,
              height: OG_SIZE.height,
              objectFit: "cover",
              /* Centred, and measured rather than assumed: the window keeps
                 the middle 1004px of a 1672px original, and every cover's
                 drawing is wider than that (bomber 1053, phone and checklist
                 1191, dice 1383). No objectPosition fits a subject wider than
                 its window, so centring is not a compromise between options,
                 it is the only one that loses the same amount from both ends.
                 The bomber keeps 95 per cent of its drawing, the checklist 84,
                 the dice row 73. Covers drawn to fill the width will always
                 lose their ends here. */
              objectPosition: "center",
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: PANEL_W,
            height: "100%",
            /* Top and bottom hold the type inside the middle 80 per cent.
               The right is wider than the left so the column sits off the
               edge a platform is most likely to crop into. */
            padding: `${OG_SAFE_INSET_Y}px ${PAD_R}px ${OG_SAFE_INSET_Y}px ${PAD_L}px`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Uppercased here rather than with textTransform, which Satori
                handles inconsistently. The site leaves series names in their
                own casing; this is a label on a card, not the site. */}
            <div
              style={{
                fontSize: 21,
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: OG_COLORS.muted,
              }}
            >
              {post.series.name.toUpperCase()}
            </div>

            <div
              style={{
                display: "flex",
                /* Satori wraps text against a bounded width and not against a
                   flex-grown one: without this the title runs straight off
                   the right edge and the overflow is silently cropped by the
                   frame. Stated explicitly rather than inherited. */
                width: TEXT_W,
                marginTop: 24,
                fontFamily: "Playfair Display",
                fontWeight: 700,
                fontSize: titleSize(post.title),
                lineHeight: 1.14,
                letterSpacing: "-0.015em",
                color: OG_COLORS.ink,
              }}
            >
              {post.title}
            </div>
          </div>

          {/* Quiet, and at the foot of the panel: the card is the post's, not
              the studio's. */}
          <img
            src={markDataUri()}
            width={44}
            height={44}
            style={{ borderRadius: 10 }}
          />
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
