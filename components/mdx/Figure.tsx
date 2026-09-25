"use client";

import type { ReactNode } from "react";

import styles from "./Figure.module.css";
import { useFigurePlayback } from "./useFigurePlayback";

/**
 * The frame for anything visual inside a post body.
 *
 * It is the cover image's treatment, deliberately: 16:9, the prose measure's
 * full width, the same 16px radius and hairline rule, and `my-7`, which is
 * what the MDX `img` mapping already uses. A figure and a cover on the same
 * page should look like the same object.
 *
 * The aspect ratio is on the frame rather than on the contents, so the height
 * is reserved before the contents paint. Nothing below a figure moves while
 * it loads, animates or replays.
 *
 * ## Playback lives here, not in the figures
 *
 * Figure owns the observer and the replay, and publishes the result as
 * `data-figure-state` on the frame. Each figure's stylesheet selects on that
 * attribute from an ancestor, which is why it is a data attribute and not a
 * hashed class. A new figure gets the trigger, the replay and the reduced
 * motion contract by being put in here, without writing any of it again.
 *
 * ## The button, and what it costs
 *
 * The frame is a real `<button>`: one tab stop, reachable by keyboard, named
 * "Replay the animation". The alternative, a click handler on a div, would
 * work with a mouse and with nothing else.
 *
 * The visual inside stays `aria-hidden`, and the caption stays a real
 * `figcaption`, so nothing is duplicated: the button says what the control
 * does, the caption says what the picture means. They are different
 * sentences and a screen reader gets both, in that order.
 *
 * The honest cost is one control that a non-sighted reader has no use for.
 * It is kept because a sighted reader without a mouse has exactly as much use
 * for it as one with a mouse, and hiding it from assistive tech to spare the
 * tab stop would be the worse trade.
 */
export function Figure({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  const { ref, state, replay } = useFigurePlayback<HTMLButtonElement>();

  return (
    <figure className="my-7">
      <button
        ref={ref}
        type="button"
        onClick={replay}
        aria-label="Replay the animation"
        className={styles.frame}
        data-figure-state={state}
      >
        <span
          className={`relative flex aspect-video w-full overflow-hidden rounded-2xl border border-rule bg-canvas ${styles.surface}`}
        >
          {children}
        </span>
      </button>
      {caption && (
        <figcaption className="mt-3 font-sans text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
