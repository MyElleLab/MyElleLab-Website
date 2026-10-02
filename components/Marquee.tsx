"use client";

// Marquee — a row of items drifting sideways in a seamless loop.
//
// The track holds the items twice. Animating it by -50% lands the second copy
// exactly where the first began, so the loop never jumps. The copy is
// aria-hidden, and its links are taken out of the Tab order, so screen readers
// and the keyboard meet each item once.
//
// Not `inert`, which the original used: an inert copy ignores the mouse too,
// and at any moment half of what is on screen is the copy - so a click on a
// card that had drifted in from the second copy did nothing.
// Hover or keyboard focus pauses the row so a moving link can be clicked;
// prefers-reduced-motion shows one static, wrapping row instead (globals.css).
import { useEffect, useRef } from "react";

const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]";

export function Marquee({
  children,
  duration = 30,
  reverse = false,
  repeat = 1,
  className = "",
}: {
  children: React.ReactNode;
  /** Seconds for one full loop. Longer is calmer. */
  duration?: number;
  /** Drift left-to-right instead of right-to-left. */
  reverse?: boolean;
  /** Repeat the items inside each copy so one copy is wider than the viewport. */
  repeat?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Every focusable element inside a copy leaves the Tab order. Done after
  // render because the children are arbitrary: the copy holds whatever the
  // caller passed, and only the DOM knows which of it is focusable.
  useEffect(() => {
    rootRef.current
      ?.querySelectorAll<HTMLElement>(`[aria-hidden="true"] :is(${FOCUSABLE})`)
      .forEach((el) => el.setAttribute("tabindex", "-1"));
  });

  const group = Array.from({ length: repeat }, (_, i) => (
    <MarqueeSet key={i} hidden={i > 0}>
      {children}
    </MarqueeSet>
  ));

  return (
    <div
      ref={rootRef}
      className={`marquee ${className}`}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}>
        <div className="marquee-group">{group}</div>
        <div className="marquee-group" aria-hidden="true">
          {group}
        </div>
      </div>
    </div>
  );
}

function MarqueeSet({
  hidden,
  children,
}: {
  hidden: boolean;
  children: React.ReactNode;
}) {
  return hidden ? (
    <div className="marquee-set" aria-hidden="true">
      {children}
    </div>
  ) : (
    <div className="marquee-set">{children}</div>
  );
}
