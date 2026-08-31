"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import styles from "./IconBloom.module.css";

type IconBloomProps = {
  src: string;
  /** Empty string marks the icon decorative — the wrapper is then hidden from AT. */
  alt: string;
  /** When present the disc becomes a link and gains a pointer and press response. */
  href?: string;
  /**
   * Outer disc diameter in px. Omit for the responsive default (60 / 76 at md),
   * which is what the hero row uses.
   */
  size?: number;
  /** App icon size in px inside the disc. Omit to keep the default (32 / 40 at md). */
  iconSize?: number;
  /**
   * Set false where a host element owns the hover — the card, whose tilt already
   * lifts and sheens the disc. Suppresses the lens's own scale, sweep and lift.
   */
  hoverEffects?: boolean;
  /** -1 on decorative duplicates so keyboard users tab the set once. */
  tabIndex?: number;
  className?: string;
};

export function IconBloom({
  src,
  alt,
  href,
  size,
  iconSize,
  hoverEffects = true,
  tabIndex,
  className,
}: IconBloomProps) {
  const classes = [styles.bloom, hoverEffects ? "" : styles.noHover, className]
    .filter(Boolean)
    .join(" ");

  // Inline custom properties override the module's responsive defaults.
  const sizeVars: CSSProperties = {
    ...(size !== undefined ? { "--bloom-size": `${size}px` } : {}),
    ...(iconSize !== undefined ? { "--bloom-icon": `${iconSize}px` } : {}),
  } as CSSProperties;

  const contents = (
    <>
      <span className={styles.back} aria-hidden />
      <span className={styles.glass} aria-hidden />
      <span className={styles.front}>
        <Image
          src={src}
          alt={alt}
          width={96}
          height={96}
          className={styles.icon}
        />
      </span>
    </>
  );

  if (href) {
    // Only leave the site in a new tab. A same-page fragment must navigate in
    // place, or the jump-to-card link would spawn a duplicate tab.
    const external = !href.startsWith("#");
    return (
      <a
        href={href}
        className={classes}
        style={sizeVars}
        tabIndex={tabIndex}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        aria-label={alt || undefined}
      >
        {contents}
      </a>
    );
  }

  return (
    <div
      className={classes}
      style={sizeVars}
      aria-hidden={alt === "" ? true : undefined}
    >
      {contents}
    </div>
  );
}
