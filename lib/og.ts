import fs from "node:fs";
import path from "node:path";

/**
 * Shared pieces for the generated Open Graph images.
 *
 * ImageResponse renders through Satori, which does not see the app's
 * next/font setup and cannot read the woff2 files next/font caches. The
 * typefaces are therefore vendored as TrueType under assets/fonts and read
 * from disk here. A font that fails to load does not error: the text renders
 * as blank or as boxes, so this is worth keeping explicit.
 */

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** 1.91:1, the ratio the platforms actually want. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Site palette, repeated here because Satori has no access to Tailwind. */
export const OG_COLORS = {
  canvas: "#F8F7FB",
  ink: "#0A0A0B",
  muted: "#6B6B7A",
  rule: "#E5E3EC",
};

/**
 * Meaningful content stays inside this width on the centred layouts. A
 * platform cropping the 1200x630 frame to a square keeps only the middle
 * 630px, so anything wider than this is at risk of being cut in a preview.
 */
export const OG_SAFE_WIDTH = 600;

/**
 * The post card's split. The cover takes the left panel and bleeds off three
 * edges; the type takes what is left.
 *
 * A square crop cuts the title, and no value here prevents it. A centred
 * 630x630 keeps x=285..915, while type that begins after a left panel of 55
 * per cent or more cannot start before x=716, which leaves under 200px of
 * measure inside the square. Putting the title beside the cover and keeping
 * it whole in a centred square crop are mutually exclusive; this layout
 * chooses the first, because 1.91:1 is what the feeds that matter actually
 * render and the square is a thumbnail fallback.
 *
 * OG_SAFE_WIDTH above still describes the centred layouts, where the
 * constraint does hold.
 */
export const OG_SPLIT_X = Math.round(OG_SIZE.width * 0.56);

/**
 * Type never goes above or below this band. Platforms crop this one image to
 * several shapes, and the middle 80 per cent survives all of them. The cover
 * is exempt by design: it is meant to bleed.
 */
export const OG_SAFE_INSET_Y = Math.round(OG_SIZE.height * 0.1);

export function ogFonts() {
  const read = (file: string) => fs.readFileSync(path.join(FONT_DIR, file));
  return [
    {
      name: "Playfair Display",
      data: read("playfair-700.ttf"),
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: read("geist-400.ttf"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: read("geist-500.ttf"),
      weight: 500 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * A file under public/ as a data URI. Satori cannot fetch a relative path,
 * and pointing it at the production URL would fail at build time for an image
 * that has not been deployed yet, so the bytes are inlined.
 */
export function publicImageDataUri(publicPath: string) {
  const ext = path.extname(publicPath).slice(1).toLowerCase();
  const mime =
    ext === "svg"
      ? "image/svg+xml"
      : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : `image/${ext}`;
  const bytes = fs.readFileSync(path.join(PUBLIC_DIR, publicPath));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

/** The MY mark. */
export function markDataUri() {
  return publicImageDataUri("myellelab-logo.svg");
}
