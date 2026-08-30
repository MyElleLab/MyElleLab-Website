"use client";

import Image from "next/image";
import styles from "./IconBloom.module.css";

type IconBloomProps = {
  src: string;
  /** Empty string marks the icon decorative — the wrapper is then hidden from AT. */
  alt: string;
  /** When present the disc becomes a link and gains a pointer and press response. */
  href?: string;
  className?: string;
};

export function IconBloom({ src, alt, href, className }: IconBloomProps) {
  const classes = className ? `${styles.bloom} ${className}` : styles.bloom;

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
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer"
        aria-label={alt || undefined}
      >
        {contents}
      </a>
    );
  }

  return (
    <div className={classes} aria-hidden={alt === "" ? true : undefined}>
      {contents}
    </div>
  );
}
