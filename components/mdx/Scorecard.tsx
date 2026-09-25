"use client";

import type { CSSProperties } from "react";

import styles from "./Scorecard.module.css";

/**
 * A scorecard emptying of options.
 *
 * Thirteen cells in two groups, six and seven, echoing the upper and lower
 * sections without labelling either: the post has already written the rules
 * out, and a diagram that repeats them would be a table, not a figure. What
 * is left is the shape of the thing, which is the part worth seeing move.
 *
 * They fill in a scattered order, not left to right. A row that fills in
 * sequence is a progress bar and reads as time passing; a scattered one reads
 * as choices being made, which is the argument the section is making.
 *
 * The order is drawn once at module scope from a fixed seed, for the same
 * reason the other figure's positions are: values computed during render
 * would differ between the server pass and the client pass and break
 * hydration.
 */
const VIEW_W = 320;
const VIEW_H = 180;

const UPPER = 6;
const LOWER = 7;
const TOTAL = UPPER + LOWER;

/* Sized against the other figure rather than against the frame.
   ScatterToTrend settles to about 2 per cent ink: forty 5.2-unit dots and a
   2-unit line on a 320x180 field. Thirteen cells at 31x34, which is what
   filled the frame comfortably on its own, settle to 24 per cent, and two
   figures in one blog that differ tenfold in weight do not read as a pair.
   At 18x22 the block settles to 8 per cent, still heavier because thirteen
   solid rectangles cannot help being heavier than forty dots, but close
   enough that they look drawn by the same hand. */
const CELL_W = 18;
const CELL_H = 22;
const GAP = 6.5;
const ROW_GAP = 18;

/* Mulberry32, the same generator the other figure uses. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Each group is centred on its own row, so the two read as one block. */
function rowX(count: number, i: number) {
  const width = count * CELL_W + (count - 1) * GAP;
  return (VIEW_W - width) / 2 + i * (CELL_W + GAP);
}

const BLOCK_H = CELL_H * 2 + ROW_GAP;
const ROW_Y = [
  (VIEW_H - BLOCK_H) / 2,
  (VIEW_H - BLOCK_H) / 2 + CELL_H + ROW_GAP,
];

/**
 * Roughly three seconds for thirteen cells. The step is the whole of the
 * timing: each cell's own fill is quick, the way writing a score is, and the
 * pause between them is what makes it a game rather than a sweep.
 */
const STEP_MS = 225;

const CELLS = (() => {
  const rand = seeded(19560214);

  const laid = Array.from({ length: TOTAL }, (_, i) => {
    const upper = i < UPPER;
    const within = upper ? i : i - UPPER;
    return {
      x: rowX(upper ? UPPER : LOWER, within),
      y: ROW_Y[upper ? 0 : 1],
    };
  });

  /* Fisher-Yates over the indices, so every cell gets exactly one turn and
     no two share a moment. A per-cell random delay would clump. */
  const order = laid.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const delay: number[] = [];
  order.forEach((cellIndex, position) => {
    delay[cellIndex] = position * STEP_MS;
  });

  return laid.map((cell, i) => ({ ...cell, delay: delay[i] }));
})();

export function Scorecard() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      /* Decorative: the figcaption says what this means, and a screen reader
         counting thirteen rectangles would say nothing useful. */
      aria-hidden
      focusable="false"
    >
      {CELLS.map((cell, i) => (
        <rect
          key={i}
          className={styles.cell}
          x={cell.x}
          y={cell.y}
          width={CELL_W}
          height={CELL_H}
          rx={2.5}
          /* Authored filled. The CSS is what empties it, so the state this
             markup describes on its own is the finished one. */
          fill="var(--ink)"
          stroke="var(--rule)"
          strokeWidth={2}
          style={{ "--delay": `${cell.delay}ms` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
