// One-off generator for app/icon.svg + app/apple-icon.png.
// Draws "MY" as geometric paths so rasterization is deterministic
// regardless of installed system fonts.

import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, "..", "app");

const SIZE = 180;
const LETTER_H = 110;
const LETTER_W = 50;
const GAP = 12;
const STEM = 14;
const M_V_DEPTH = 72;
const Y_JOIN = 55;

const TOTAL_W = LETTER_W * 2 + GAP;
const X_OFF = Math.round((SIZE - TOTAL_W) / 2);
const Y_OFF = Math.round((SIZE - LETTER_H) / 2);

const mLeft = X_OFF;
const mCx = mLeft + LETTER_W / 2;
const yLeft = X_OFF + LETTER_W + GAP;
const yCx = yLeft + LETTER_W / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#ffffff"/>
  <g fill="#000000">
    <!-- M: two legs + V stroke (uniform width) -->
    <rect x="${mLeft}" y="${Y_OFF}" width="${STEM}" height="${LETTER_H}"/>
    <rect x="${mLeft + LETTER_W - STEM}" y="${Y_OFF}" width="${STEM}" height="${LETTER_H}"/>
    <path d="M ${mLeft + STEM / 2} ${Y_OFF} L ${mCx} ${Y_OFF + M_V_DEPTH} L ${mLeft + LETTER_W - STEM / 2} ${Y_OFF}" fill="none" stroke="#000000" stroke-width="${STEM}" stroke-linejoin="round" stroke-linecap="butt"/>
    <!-- Y: arms + stem -->
    <path d="M ${yLeft + STEM / 2} ${Y_OFF} L ${yCx} ${Y_OFF + Y_JOIN} L ${yLeft + LETTER_W - STEM / 2} ${Y_OFF}" fill="none" stroke="#000000" stroke-width="${STEM}" stroke-linejoin="round" stroke-linecap="butt"/>
    <rect x="${yCx - STEM / 2}" y="${Y_OFF + Y_JOIN - STEM / 2}" width="${STEM}" height="${LETTER_H - Y_JOIN + STEM / 2}"/>
  </g>
</svg>
`;

await writeFile(join(appDir, "icon.svg"), svg);
const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(join(appDir, "apple-icon.png"), png);
console.log(`Wrote icon.svg + apple-icon.png (${png.length} bytes)`);
