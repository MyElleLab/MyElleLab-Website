"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The trigger every figure in a post body shares.
 *
 * On scroll into view, not on mount. A figure sits partway down a long post;
 * started on mount it would be finished long before anyone reached it, and
 * the reader would only ever meet the settled state.
 *
 * It runs once and is never rewound: the observer is detached on the first
 * intersection and the flag it sets is never cleared. Scrolling past and back
 * does not replay.
 *
 * Extracted rather than copied so a second figure cannot drift from the
 * first. The threshold is the one thing a figure might reasonably want to
 * differ on, so it is an argument; everything else is fixed on purpose.
 */
export function usePlayOnScroll<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* No observer, no trigger: show the settled state rather than an
       animation that will never arrive. */
    if (typeof IntersectionObserver === "undefined") {
      setPlayed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setPlayed(true);
          io.unobserve(entry.target);
        }
      },
      { threshold },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, played };
}
