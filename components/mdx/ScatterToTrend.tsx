"use client";

import type { CSSProperties } from "react";

import styles from "./ScatterToTrend.module.css";
import { usePlayOnScroll } from "./usePlayOnScroll";

/**
 * Forty entries that look like noise until they are seen together.
 *
 * The dots are generated once, at module scope, from a fixed seed. Random
 * positions computed during render would differ between the server pass and
 * the client pass and blow up hydration, and a useEffect that fills them in
 * afterwards would leave the figure empty on first paint.
 */
const VIEW_W = 320;
const VIEW_H = 180;
const COUNT = 40;

/* Mulberry32. Small, fast, and identical on both sides of the wire, which is
   the only property that matters here. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The settled line: a gentle rise across the frame, left low to right high. */
function trendY(t: number) {
  return 132 - 78 * t;
}

const DOTS = (() => {
  const rand = seeded(20260906);
  return Array.from({ length: COUNT }, (_, i) => {
    /* Even spacing with a little jitter, so the row does not read as a comb
       once it has settled. */
    const t = (i + 0.5) / COUNT;
    const x = 26 + t * (VIEW_W - 52) + (rand() - 0.5) * 4;
    /* Settled near the trend, not welded to it. Landing every dot exactly on
       the line hides the line: the dots are 5.2 units across and sit 6.8
       apart, so it survives only as slivers between them and the figure
       reads as a dotted line rather than as a line drawn through data. A
       residual of about a tenth of the rise frees the line and looks like
       measurements rather than beads on a string. */
    const y = trendY(t) + (rand() - 0.5) * 9;
    /* Noise wide enough to bury the trend: the rise is 78 units and the
       scatter spans about 96, so at rest there is no line to see. */
    const dy = (rand() - 0.5) * 96;
    const scattered = Math.min(162, Math.max(18, y + dy));
    return { x, y, dy: scattered - y, delay: Math.round(rand() * 900) };
  });
})();

/* The trend itself, from the same function the dots settle around, drawn a
   little past them at both ends so it reads as a line continuing rather than
   one that starts and stops at the outermost measurement. */
const LINE_T0 = -0.04;
const LINE_T1 = 1.04;
const lineX = (t: number) => 26 + t * (VIEW_W - 52);
const LINE = `${lineX(LINE_T0).toFixed(2)},${trendY(LINE_T0).toFixed(2)} ${lineX(LINE_T1).toFixed(2)},${trendY(LINE_T1).toFixed(2)}`;

export function ScatterToTrend() {
  const { ref, played } = usePlayOnScroll<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-full ${played ? styles.play : ""}`}
      /* Decorative: the figcaption underneath says what this means, and a
         screen reader repeating forty circles would say nothing useful. */
      aria-hidden
      focusable="false"
    >
      <polyline
        className={styles.line}
        points={LINE}
        fill="none"
        stroke="var(--wisp)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
      {DOTS.map((d, i) => (
        <circle
          key={i}
          className={styles.dot}
          cx={d.x}
          cy={d.y}
          r={2.6}
          fill="var(--ink)"
          style={{ "--dy": `${d.dy}px`, "--delay": `${d.delay}ms` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
