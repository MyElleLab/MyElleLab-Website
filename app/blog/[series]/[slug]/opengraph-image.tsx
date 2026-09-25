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
/* The divider is a flex item between the two panels rather than something
   laid over them, so it cannot clip the contained cover and the seam it draws
   is the seam that is actually there. The text panel gives up its width so
   the three still total 1200. */
const RULE_W = 1;
const PANEL_W = OG_SIZE.width - OG_SPLIT_X - RULE_W;
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
        {/* The cover takes the left panel at its full width and bleeds off
            the left edge.

            `contain`, not `cover`. Cropping to the panel window kept only the
            middle 1004px of a 1672px original, and every drawing is wider
            than that: the bomber lost 5 per cent, the checklist 16, and the
            dice row 27, which took its outer two dice down to slivers. No
            objectPosition fixes a subject wider than its window, so the
            window had to stop being the constraint.

            Contain letterboxes, and here the bars cost nothing: the drawings
            sit on the same #F8F7FB the panel does, so bar and ground are the
            same colour and there is no seam to see. That is a property of
            these particular covers, not of the layout, and a cover exported
            on any other ground would show a band top and bottom. */}
        {post.cover && (
          <img
            src={publicImageDataUri(post.cover)}
            width={OG_SPLIT_X}
            height={OG_SIZE.height}
            style={{
              width: OG_SPLIT_X,
              height: OG_SIZE.height,
              objectFit: "contain",
              /* Stated on the image rather than left to the root, so the bars
                 are the panel colour by declaration and not by inheritance. */
              background: OG_COLORS.canvas,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            width: RULE_W,
            height: "100%",
            background: OG_COLORS.ink,
          }}
        />

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
            {/* As written, not uppercased. The site settled this already:
                series names are wordmarks and keep their capitals, section
                labels do not. MYFREETIME is a run of letters; MyFreeTime is
                the mark. This image predates that decision and was the last
                place still shouting it. */}
            <div
              style={{
                fontSize: 21,
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: OG_COLORS.muted,
              }}
            >
              {post.series.name}
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
