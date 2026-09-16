# Source artwork

Files kept for provenance. Nothing here is served: `assets/` sits outside
`public/`, so these never reach a browser and never count towards the page
weight. The vendored typefaces next door in `assets/fonts/` are read from disk
at build time by `lib/og.ts`; the files here are not read by anything.

## icon-MyEgo-v1.png

The (E)go mark as exported: a black E on a white ground, 1254x1254.

`public/wordmark-MyEgo.png` was derived from it, and is what the (E)go product
card sets as the E in its heading. The derivation:

1. Read the white ground as alpha. The artwork is ink on white, so
   `alpha = 255 - luminance` is the ink's exact coverage at every pixel,
   antialiased edges included. The ink colour is carried over unchanged.
2. Crop to the ink. Here that is the box `(357, 292, 897, 961)`, 540x669.
3. Resize to 512 tall, giving 413x512.

Step 2 is the one that matters. Cropped to its ink, the box the line lays out
is the letter itself, so `vertical-align: baseline` stands the E on the
baseline with no tucking, and the brackets either side of it can be set tight
without a ground painting over them. The app icon, `public/icon-MyEgo.png`,
cannot stand in: it is a filled tile, and a filled tile reads as a box beside a
word rather than as a letter inside one.

Re-exporting the mark means repeating all three steps. It also means
re-checking the fit in `components/ProductCard.module.css`, whose height and
side bearings are measured against Playfair at the heading's size.
