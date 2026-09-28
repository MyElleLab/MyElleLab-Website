"use client";

import styles from "./PhotoToListing.module.css";

/**
 * One photo becoming a price and a place to sell.
 *
 * Three beats, left to right: the camera takes the photo, the phone reads the
 * item and a price tag lands, then the listing branches to three marketplaces
 * with the best match filled in. Every element is authored in its final state
 * and held back until the figure plays.
 */
const VIEW_W = 320;
const VIEW_H = 180;

const PLATFORMS = [
  { y: 58, label: "Vinted" },
  { y: 90, label: "eBay", best: true },
  { y: 122, label: "Marketplace" },
];

export function PhotoToListing() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden
      focusable="false"
    >
      {/* Camera */}
      <g className={styles.ink}>
        <rect x={22} y={78} width={40} height={28} rx={5} />
        <path d="M34 78 L37 72 L47 72 L50 78" />
        <circle cx={42} cy={92} r={7.5} />
      </g>

      {/* Camera to phone */}
      <path d="M68 92 L110 92" pathLength={1} className={`${styles.link} ${styles.link1}`} />

      {/* Phone, with the item on screen */}
      <g className={styles.ink}>
        <rect x={116} y={40} width={62} height={104} rx={10} />
        <line x1={139} y1={47} x2={155} y2={47} />
        {/* A jacket, the draft's own example of something to sell. */}
        <path d="M137 66 L141 60 L147 63 L153 60 L157 66 L154 70 L154 88 L140 88 L140 70 Z" />
        <line x1={147} y1={63} x2={147} y2={88} />
      </g>
      <rect x={124} y={56} width={46} height={40} rx={3} className={styles.frame} />
      <line x1={124} y1={56} x2={170} y2={56} className={styles.scan} />

      {/* Price tag */}
      <g className={styles.tag}>
        <rect x={126} y={104} width={42} height={18} rx={4} className={styles.tagBody} />
        <text x={147} y={116.5} textAnchor="middle" className={styles.price}>
          €45
        </text>
      </g>

      {/* Branches to the marketplaces */}
      {PLATFORMS.map((p, i) => (
        <path
          key={p.label}
          d={`M184 92 C210 92 212 ${p.y} 236 ${p.y}`}
          pathLength={1}
          className={`${styles.link} ${styles.branch}`}
          style={{ transitionDelay: `${1500 + i * 120}ms` }}
        />
      ))}
      {PLATFORMS.map((p, i) => (
        <g
          key={p.label}
          className={styles.chip}
          style={{ transitionDelay: `${1900 + i * 120}ms` }}
        >
          <rect
            x={238}
            y={p.y - 10}
            width={64}
            height={20}
            rx={10}
            className={p.best ? styles.chipBest : styles.chipBody}
          />
          <text
            x={270}
            y={p.y + 3.5}
            textAnchor="middle"
            className={p.best ? styles.chipTextBest : styles.chipText}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
