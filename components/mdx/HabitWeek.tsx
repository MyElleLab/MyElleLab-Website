"use client";

import type { CSSProperties } from "react";

import styles from "./HabitWeek.module.css";

/**
 * A week of seven habits, filled in day by day.
 *
 * The misses are part of the picture on purpose: a grid with every cell done
 * reads as a poster, and a record with gaps reads as someone's actual week.
 * The pattern is fixed rather than random so the server and client render the
 * same cells.
 */
const VIEW_W = 320;
const VIEW_H = 180;

const HABITS = [
  "Time blocks",
  "Learning",
  "Movement",
  "Three things",
  "Shutdown",
  "Tracking",
  "Sleep",
];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

/* 1 done, 0 missed. Roughly five in seven, with the weekend looser, which is
   what most weeks look like. */
const DONE = [
  [1, 1, 1, 1, 1, 0, 0],
  [1, 1, 0, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 0, 1],
  [0, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 1],
];

const LABEL_X = 86;
const GRID_X = 98;
const GRID_Y = 34;
const CELL = 15;
const STEP = 20;

export function HabitWeek() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      /* Decorative: the caption says what it means. */
      aria-hidden
      focusable="false"
    >
      {DAYS.map((d, c) => (
        <text
          key={c}
          x={GRID_X + c * STEP + CELL / 2}
          y={GRID_Y - 8}
          textAnchor="middle"
          className={styles.day}
        >
          {d}
        </text>
      ))}

      {HABITS.map((habit, r) => (
        <g key={habit}>
          <text
            x={LABEL_X}
            y={GRID_Y + r * STEP + CELL / 2 + 3}
            textAnchor="end"
            className={styles.label}
          >
            {habit}
          </text>
          {DONE[r].map((done, c) => {
            const x = GRID_X + c * STEP;
            const y = GRID_Y + r * STEP;
            return (
              <g key={c}>
                {/* The empty box is always there; the fill is what arrives. */}
                <rect
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={3.5}
                  className={styles.box}
                />
                {done === 1 && (
                  <rect
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={3.5}
                    className={styles.fill}
                    /* Day by day, then habit by habit inside a day, so the
                       week fills left to right the way it is lived. */
                    style={{ "--delay": `${c * 170 + r * 40}ms` } as CSSProperties}
                  />
                )}
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
