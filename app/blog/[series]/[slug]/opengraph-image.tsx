import { ImageResponse } from "next/og";

import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SAFE_WIDTH,
  OG_SIZE,
  markDataUri,
  ogFonts,
  publicImageDataUri,
} from "@/lib/og";
import { getPost, getPosts } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

type Params = { series: string; slug: string };

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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: OG_COLORS.canvas,
          fontFamily: "Geist",
        }}
      >
        {/* Everything sits in this centred column. A square crop keeps the
            middle 630px, so nothing meaningful goes wider. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: OG_SAFE_WIDTH,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={markDataUri()}
              width={34}
              height={34}
              style={{ borderRadius: 8 }}
            />
            <div
              style={{
                marginLeft: 12,
                fontFamily: "Playfair Display",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.015em",
                color: OG_COLORS.ink,
              }}
            >
              {SITE_NAME}
            </div>
          </div>

          {/* Contained, never cropped: the covers are sparse line drawings and
              filling the box would cut the subject out of them. */}
          {post.cover && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: OG_SAFE_WIDTH,
                height: 224,
                marginTop: 26,
              }}
            >
              <img
                src={publicImageDataUri(post.cover)}
                width={OG_SAFE_WIDTH}
                height={224}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              marginTop: 30,
              width: OG_SAFE_WIDTH,
              textAlign: "center",
              fontFamily: "Playfair Display",
              fontWeight: 700,
              fontSize: 42,
              lineHeight: 1.18,
              letterSpacing: "-0.015em",
              color: OG_COLORS.ink,
            }}
          >
            {post.title}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
