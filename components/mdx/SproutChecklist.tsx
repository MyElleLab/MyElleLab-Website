"use client";

import type { CSSProperties } from "react";

import styles from "./SproutChecklist.module.css";

/**
 * A plant that grows one leaf per small choice ticked.
 *
 * The stem draws, and each leaf opens as its matching line on the checklist
 * is ticked, so the link between the two halves is timing rather than a
 * label. Adapted from the raw drawing in the draft folder (sun, sprout,
 * checklist), redrawn on the figure grid.
 */
const VIEW_W = 320;
const VIEW_H = 180;

const LEAVES = [
  { d: "M120 128 C108 124 102 116 104 108 C114 110 120 118 120 128 Z" },
  { d: "M120 112 C132 108 138 100 136 92 C126 94 120 102 120 112 Z" },
  { d: "M120 96 C108 92 102 84 104 76 C114 78 120 86 120 96 Z" },
  { d: "M120 80 C132 76 138 68 136 60 C126 62 120 70 120 80 Z" },
];

const ITEMS = [56, 80, 104, 128];

export function SproutChecklist() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden
      focusable="false"
    >
      <line x1={24} y1={148} x2={296} y2={148} className={styles.ground} />

      {/* Sun, rising a little as the day goes on. */}
      <g className={styles.sun}>
        <circle cx={56} cy={62} r={14} className={styles.sunBody} />
        <circle cx={56} cy={62} r={21} className={styles.sunRing} />
      </g>

      {/* Pot and stem */}
      <path d="M106 148 L110 136 L130 136 L134 148 Z" className={styles.ink} />
      <path d="M120 136 L120 54" pathLength={1} className={styles.stem} />
      <circle cx={120} cy={52} r={2.5} className={styles.bud} />

      {LEAVES.map((leaf, i) => (
        <path
          key={i}
          d={leaf.d}
          className={styles.leaf}
          style={{ "--delay": `${700 + i * 420}ms` } as CSSProperties}
        />
      ))}

      {/* Checklist */}
      {ITEMS.map((y, i) => (
        <g key={y}>
          <rect x={196} y={y - 7} width={14} height={14} rx={3} className={styles.box} />
          <path
            d={`M199 ${y} L202.5 ${y + 3.5} L207.5 ${y - 3.5}`}
            pathLength={1}
            className={styles.tick}
            style={{ "--delay": `${650 + i * 420}ms` } as CSSProperties}
          />
          <line x1={218} y1={y} x2={i % 2 ? 262 : 278} y2={y} className={styles.line} />
        </g>
      ))}
    </svg>
  );
}
