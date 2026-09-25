"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** What the figure's CSS keys off. Plain data attribute, not a hashed class,
 *  so each figure's own module can select on it from an ancestor. */
export type FigureState = "idle" | "resetting" | "playing";

/**
 * When a figure plays, and how it plays again.
 *
 * ## Why the trigger is not simply "is it visible"
 *
 * It used to be threshold 0.35 against the whole viewport, which fires the
 * moment a third of the figure clears the bottom edge. Measured on a 390x844
 * phone at a gentle 1000px/s scroll, that meant the animation began with the
 * figure's top at y=748, 96 of its 192px on screen, and finished with its top
 * at y=-569, already gone off the top. The whole thing played while the
 * figure was travelling past, so a reader scrolling normally never saw it
 * move. That is the bug behind "it does not animate on iPhone", not a failure
 * to fire.
 *
 * The rootMargin pulls the trigger line up to the reading band. The figure has
 * to reach the middle of the screen, where someone would actually be looking,
 * before anything starts.
 *
 * ## Why "scrolled past" also counts
 *
 * A figure that is never seen must not sit in its offset state for good: the
 * offset is the unfinished picture. If an entry arrives showing the figure
 * entirely above the viewport, it has been passed and is marked played, so it
 * rests finished rather than scattered.
 *
 * ## Why replaying needs three states rather than two
 *
 * Dropping straight back to idle would animate the figure *backwards* into
 * its offset over the full duration, staggered, which looks like a fault.
 * `resetting` is one frame with transitions off: the figure snaps to the
 * start, and the frame after that it plays forward. Interrupting a run mid
 * way goes through the same two steps, so it restarts rather than queues.
 *
 * ## Reduced motion is not handled here
 *
 * Each figure's stylesheet pins every state to the settled one under
 * `prefers-reduced-motion: reduce`. Enforcing it in the CSS rather than in
 * this hook means no path through the JS can bypass it, including a tap.
 */
export function useFigurePlayback<T extends Element>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<FigureState>("idle");
  const frames = useRef<number[]>([]);

  const cancelPending = () => {
    for (const id of frames.current) cancelAnimationFrame(id);
    frames.current = [];
  };

  useEffect(() => cancelPending, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* No observer, no trigger: rest finished rather than wait for an
       animation that will never arrive. */
    if (typeof IntersectionObserver === "undefined") {
      setState("playing");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const passed = entry.boundingClientRect.bottom <= 0;
          if (!entry.isIntersecting && !passed) continue;
          setState("playing");
          io.unobserve(entry.target);
        }
      },
      {
        /* Any part of the figure inside the band is enough, so the threshold
           does not have to be tuned against a figure's height. The band is
           what does the work. */
        threshold: 0,
        /* Top 22 per cent and bottom 30 per cent of the viewport are not the
           reading position. The figure has to reach the middle before it
           starts. */
        rootMargin: "-22% 0px -30% 0px",
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * Restart from the beginning. Safe to call during a run: the reset frame
   * snaps the figure back with transitions off before the next one starts it
   * forward again, so repeated taps do not stack or stutter.
   */
  const replay = useCallback(() => {
    cancelPending();
    setState("resetting");
    frames.current.push(
      requestAnimationFrame(() => {
        frames.current.push(
          requestAnimationFrame(() => setState("playing")),
        );
      }),
    );
  }, []);

  return { ref, state, replay };
}
