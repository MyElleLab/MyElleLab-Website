import { ImageResponse } from "next/og";

import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  markDataUri,
  ogFonts,
  publicImageDataUri,
} from "@/lib/og";
import { SITE_NAME, STUDIO_DESCRIPTION } from "@/lib/site";

/**
 * The site's default link preview. Metadata files cascade, so this covers the
 * homepage, /blog, the series pages and the legal pages, and any post that
 * does not generate one of its own.
 */
export const alt = `${SITE_NAME}. ${STUDIO_DESCRIPTION}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
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
        <img
          src={publicImageDataUri("og-bg-MyElleLab.jpg")}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <img
          src={markDataUri()}
          width={96}
          height={96}
          style={{ borderRadius: 22 }}
        />
        <div
          style={{
            marginTop: 34,
            fontFamily: "Playfair Display",
            fontWeight: 700,
            fontSize: 76,
            letterSpacing: "-0.015em",
            color: OG_COLORS.ink,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 18,
            maxWidth: 640,
            textAlign: "center",
            fontSize: 30,
            lineHeight: 1.45,
            color: OG_COLORS.muted,
          }}
        >
          Focused apps, crafted in suites.
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() },
  );
}
