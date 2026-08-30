"use client";

import styles from "./HeroWordmark.module.css";

const WORDMARK = "MyElleLab";

/**
 * The hero wordmark as three Z-stacked copies of the same text under a shared
 * perspective, wobbling slowly. Renders into whatever heading element the
 * caller passes so the hero keeps its semantics; `aria-label` means the word
 * is announced once rather than three times.
 */
export function HeroWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`${styles.scene} ${className}`} aria-label={WORDMARK}>
      <span className={styles.stack}>
        <span className={`${styles.layer} ${styles.back}`} aria-hidden="true">
          {WORDMARK}
        </span>
        <span className={`${styles.layer} ${styles.mid}`} aria-hidden="true">
          {WORDMARK}
        </span>
        {/* Not aria-hidden: this layer's text is the heading's accessible
            name. aria-label on a generic span is not reliably exposed, so the
            name must not depend on it alone. */}
        <span className={`${styles.layer} ${styles.front}`}>{WORDMARK}</span>
      </span>
    </span>
  );
}
