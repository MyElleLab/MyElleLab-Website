"use client";

import type { CSSProperties } from "react";

import styles from "./ClipsToLibrary.module.css";

/**
 * A pile of clips sorting itself into collections.
 *
 * Every card is authored in its row and pushed into a tangle by --dx, --dy
 * and --rot, the same way ScatterToTrend pushes its dots: the finished
 * library is the resting picture and the mess is what gets removed. Offsets
 * come from a fixed seed so server and client agree.
 */
const VIEW_W = 320;
const VIEW_H = 180;
const ROWS = 3;
const COLS = 5;
const CARD_W = 30;
const CARD_H = 20;
const GAP_X = 8;
const ROW_Y = [34, 72, 110];
/* Centred: five cards and four gaps are 182 wide in a 320 frame. */
const START_X = (VIEW_W - (COLS * CARD_W + (COLS - 1) * GAP_X)) / 2;
/* Where the tangle sits before it sorts: left of the rows, low in the frame. */
const PILE = { x: 40, y: 96 };

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CARDS = (() => {
  const rand = seeded(20260927);
  const cards = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = START_X + c * (CARD_W + GAP_X);
      const y = ROW_Y[r];
      const px = PILE.x + (rand() - 0.5) * 50;
      const py = PILE.y + (rand() - 0.5) * 60;
      cards.push({
        x,
        y,
        dx: px - x,
        dy: py - y,
        rot: Math.round((rand() - 0.5) * 70),
        /* The first card of each row is the one you open most: filled ink,
           the way a favourite stands out in a real library. */
        pick: c === 0,
        delay: Math.round((r * COLS + c) * 55 + rand() * 60),
      });
    }
  }
  return cards;
})();

export function ClipsToLibrary() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden
      focusable="false"
    >
      {/* Row labels: a short title line and a shorter count line, drawn in
          once the cards have landed. */}
      {ROW_Y.map((y) => (
        <g key={y} className={styles.meta}>
          <line x1={START_X} y1={y - 7} x2={START_X + 38} y2={y - 7} className={styles.title} />
        </g>
      ))}

      {CARDS.map((card, i) => (
        <g
          key={i}
          className={styles.card}
          style={
            {
              "--dx": `${card.dx.toFixed(1)}px`,
              "--dy": `${card.dy.toFixed(1)}px`,
              "--rot": `${card.rot}deg`,
              "--delay": `${card.delay}ms`,
            } as CSSProperties
          }
        >
          <rect
            x={card.x}
            y={card.y}
            width={CARD_W}
            height={CARD_H}
            rx={4}
            className={card.pick ? styles.pick : styles.clip}
          />
          <path
            d={`M${card.x + 12.5} ${card.y + 6.5} L${card.x + 18.5} ${card.y + 10} L${card.x + 12.5} ${card.y + 13.5} Z`}
            className={card.pick ? styles.playOnInk : styles.play}
          />
        </g>
      ))}

      {/* The loop: a circular arrow under the rows, drawn last, because
          looping is what the sorted library is for. */}
      <g className={styles.loopGroup}>
        <path
          d="M160 146 A10 10 0 1 1 150 156"
          pathLength={1}
          className={styles.loop}
        />
        <path d="M146.5 159.5 L150 156 L153.5 159.5" className={styles.loopHead} />
      </g>
    </svg>
  );
}
