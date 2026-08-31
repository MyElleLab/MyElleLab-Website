"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./TaglineWaves.module.css";

/* Two crest states in the 0 0 100 100 viewBox, drawn past both edges so the
   ribbon never ends mid-view. Morphing between them is the whole mechanic. */
const WAVE_UP =
  "M-12.5,50 C-6.25,8 6.25,8 12.5,50 C18.75,92 31.25,92 37.5,50 " +
  "C43.75,8 56.25,8 62.5,50 C68.75,92 81.25,92 87.5,50 C93.75,8 106.25,8 112.5,50";
const WAVE_DOWN =
  "M-12.5,50 C-6.25,92 6.25,92 12.5,50 C18.75,8 31.25,8 37.5,50 " +
  "C43.75,92 56.25,92 62.5,50 C68.75,8 81.25,8 87.5,50 C93.75,92 106.25,92 112.5,50";

const DUR = "4s";
const SPLINE = "0.7 0.6 0.3 0.4";

/* Two on the wave-up values, two on the inverted crest, the pairs reversed and
   offset by half and quarter cycles. The interleave is what reads as water
   rather than one sine. */
const LAYERS = [
  { from: WAVE_UP, to: WAVE_DOWN, begin: "0s", opacity: 0.85 },
  { from: WAVE_DOWN, to: WAVE_UP, begin: "-1s", opacity: 0.6 },
  { from: WAVE_UP, to: WAVE_DOWN, begin: "-2s", opacity: 0.7 },
  { from: WAVE_DOWN, to: WAVE_UP, begin: "-3s", opacity: 0.5 },
];

export function TaglineWaves({ children }: { children: ReactNode }) {
  /* Starts false so the server and the first client render agree, and so a
     reduced-motion visitor never sees a frame of movement. SMIL cannot be
     stopped from CSS, so the <animate> elements are simply not rendered. */
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAnimate(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <span className={styles.wrap}>
      <svg
        className={styles.waves}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="tagline-wave-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.2" stopColor="#fff" />
            <stop offset="0.8" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="tagline-wave-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
            <rect x="0" y="0" width="100" height="100" fill="url(#tagline-wave-fade)" />
          </mask>
        </defs>

        <g mask="url(#tagline-wave-mask)" fill="none" stroke="rgba(216, 213, 234, 0.45)">
          {LAYERS.map((l, i) => (
            <path
              key={i}
              d={l.from}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={l.opacity}
            >
              {animate && (
                <animate
                  attributeName="d"
                  values={`${l.from};${l.to};${l.from}`}
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  keySplines={`${SPLINE};${SPLINE}`}
                  dur={DUR}
                  begin={l.begin}
                  repeatCount="indefinite"
                />
              )}
            </path>
          ))}
        </g>
      </svg>
      <span className={styles.label}>{children}</span>
    </span>
  );
}
