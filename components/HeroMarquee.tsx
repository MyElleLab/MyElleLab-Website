"use client";

import { useCallback, useEffect, useRef } from "react";
import { IconBloom } from "@/components/IconBloom";
import { productAnchorId, type Product } from "@/lib/products";
import styles from "./HeroMarquee.module.css";

/* The track holds the icon set four times and travels -50%, i.e. two whole
   sets. Two sets would satisfy the loop maths but not the geometry: one set is
   704px at desktop against a 1072px viewport, so once it had scrolled a full
   set there would be nothing left to fill the right-hand side. Travelling a
   whole number of sets is what makes the wrap invisible; four copies is what
   keeps the viewport covered. */
const COPIES = 4;

/** How long the row stays still after a touch, so scanning it isn't a fight. */
const RESUME_DELAY_MS = 2000;

export function HeroMarquee({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };

  /* There is no hover on a phone, so the CSS hover-pause never fires and the
     user would be tapping a moving target — a tap landing a moment late opens
     the wrong app. touchstart runs before click, and this writes the style
     straight to the node rather than going through state, so the row is
     already stopped by the time the tap resolves. */
  const pauseNow = useCallback(() => {
    clearTimer();
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  }, []);

  const resumeSoon = useCallback(() => {
    clearTimer();
    resumeTimer.current = setTimeout(() => {
      if (trackRef.current) trackRef.current.style.animationPlayState = "";
    }, RESUME_DELAY_MS);
  }, []);

  useEffect(() => clearTimer, []);

  return (
    <div
      className={styles.viewport}
      onTouchStart={pauseNow}
      onTouchEnd={resumeSoon}
      onTouchCancel={resumeSoon}
    >
      <div className={styles.track} ref={trackRef}>
        {Array.from({ length: COPIES }, (_, copy) => {
          const isClone = copy > 0;
          return (
            <span
              key={copy}
              className={
                isClone ? `${styles.contents} ${styles.dup}` : styles.contents
              }
              /* Only the first pass is real; the rest are visual duplication,
                 and reduced motion drops them so the static fallback is the
                 original eight-disc row rather than thirty-two. */
              aria-hidden={isClone ? true : undefined}
            >
              {products.map((p) => (
                <IconBloom
                  key={`${copy}-${p.name}`}
                  src={p.iconSrc}
                  /* A link needs an accessible name; these used to be
                     decorative and unnamed. */
                  alt={p.name}
                  href={`#${productAnchorId(p)}`}
                  /* Clones stay tappable — a finger can't tell the copies
                     apart — but leave the tab order at eight links, not
                     thirty-two, which aria-hidden alone would not do. */
                  tabIndex={isClone ? -1 : undefined}
                  className={styles.item}
                />
              ))}
            </span>
          );
        })}
      </div>
    </div>
  );
}
