import Image from "next/image";

import {
  appStoreUrl,
  productAnchorId,
  splitIconLetterName,
  type Product,
} from "@/lib/products";
import { IconBloom } from "./IconBloom";
import styles from "./ProductCard.module.css";

function AppStoreBadge() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.05 12.54c-.02-2.07 1.69-3.07 1.77-3.12-.96-1.4-2.46-1.6-3-1.62-1.27-.13-2.5.75-3.15.75-.66 0-1.66-.73-2.74-.71-1.41.02-2.71.82-3.43 2.08-1.46 2.53-.37 6.27 1.05 8.32.7 1 1.52 2.12 2.6 2.08 1.05-.04 1.45-.67 2.71-.67s1.62.67 2.73.65c1.13-.02 1.84-1.02 2.53-2.02.8-1.16 1.13-2.28 1.15-2.34-.03-.01-2.2-.85-2.22-3.4zM15.06 5.5c.58-.7.97-1.67.86-2.64-.83.04-1.84.55-2.45 1.24-.54.62-1.02 1.61-.89 2.56.93.07 1.89-.47 2.48-1.16z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const isAvailable = product.status === "AVAILABLE";
  const storeUrl = appStoreUrl(product);
  const wordmark = splitIconLetterName(product);

  return (
    <div className={styles.scene}>
      <article
        id={productAnchorId(product)}
        /* Focusable only programmatically: a hash jump leaves focus on <body>
           unless the target can take it, so a keyboard user would land visually
           on the card but keep tabbing from the hero. -1 keeps it out of the
           tab order while letting the fragment move focus here. */
        tabIndex={-1}
        className={`group relative h-full flex flex-col rounded-2xl bg-surface border border-rule p-6 ${styles.card}`}
      >
        <span className={styles.sheen} aria-hidden />

        <div className={`flex items-start justify-between ${styles.layerGroup}`}>
          {/* The Z lift and the lens's own rotate must sit on separate
              elements — both set `transform`, so sharing one element makes
              them clobber each other. */}
          <div className={`size-16 flex-none ${styles.layerIcon} ${styles.iconSlot}`}>
            <IconBloom
              src={product.iconSrc}
              alt={`${product.name} app icon`}
              size={64}
              iconSize={36}
              hoverEffects={false}
            />
          </div>
          <StatusBadge status={product.status} className={styles.layerBadge} />
        </div>

        <div className={`mt-5 flex-grow ${styles.layerGroup}`}>
          <h3
            className={`font-serif text-2xl font-semibold tracking-wordmark text-ink ${styles.layerName}`}
          >
            {wordmark ? (
              <>
                {/* The heading reads as one word only to someone looking at
                    it. This is the whole name, said once, for everyone
                    else. */}
                <span className="sr-only">{product.name}</span>
                <span aria-hidden>
                  {/* alt is never announced under aria-hidden. It is here so
                      that a heading whose image fails still spells the name
                      rather than losing its first letter. */}
                  <span className={styles.wordmarkFused}>
                    <Image
                      src={wordmark.src}
                      alt={wordmark.letter}
                      width={413}
                      height={512}
                      className={styles.wordmarkIcon}
                    />
                    {wordmark.fused}
                  </span>
                  {wordmark.rest}
                </span>
              </>
            ) : (
              product.name
            )}
          </h3>
          <p
            className={`mt-1.5 font-sans text-sm text-muted leading-relaxed ${styles.layerTagline}`}
          >
            {product.tagline}
          </p>
        </div>

        <div
          className={`mt-6 pt-5 flex flex-wrap items-center gap-2 border-t border-rule ${styles.layerActions}`}
        >
          {isAvailable ? (
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-xs font-medium text-white transition hover:bg-black ${styles.actionBtn}`}
            >
              <AppStoreBadge />
              Download
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-label={`${product.name} — coming soon to the App Store`}
              className={`inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-xs font-medium text-white opacity-60 cursor-not-allowed ${styles.actionBtn}`}
            >
              <AppStoreBadge />
              Soon
            </button>
          )}

          {product.siteUrl && (
            <a
              href={product.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full border border-ink bg-surface px-3.5 py-2 text-xs font-medium text-ink hover:bg-ink hover:text-white transition ${styles.actionBtn}`}
            >
              Visit site
              <ExternalIcon />
            </a>
          )}
        </div>
      </article>
    </div>
  );
}

function StatusBadge({
  status,
  className = "",
}: {
  status: Product["status"];
  className?: string;
}) {
  if (status === "AVAILABLE") {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white ${className}`}>
        <span className="size-1.5 rounded-full bg-white" />
        Available
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-muted bg-transparent px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-eyebrow text-muted ${className}`}
    >
      <span className="size-1.5 rounded-full bg-muted" />
      Coming soon
    </span>
  );
}
