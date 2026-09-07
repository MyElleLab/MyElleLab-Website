import Image from "next/image";

import { appStoreUrl, type Product } from "@/lib/products";

/**
 * A closing aside pointing at one app. One line, one icon, no card.
 *
 * The pitch is written per post and names the app, so the name inside the
 * sentence becomes the link rather than a separate "Try the app" control. If
 * a pitch does not happen to contain the name, the link is appended instead
 * of silently rendering an unlinked line.
 */
export function RelatedApp({
  product,
  pitch,
}: {
  product: Product;
  pitch: string;
}) {
  const at = pitch.indexOf(product.name);
  const before = at === -1 ? pitch : pitch.slice(0, at);
  const after = at === -1 ? "" : pitch.slice(at + product.name.length);

  const link = (
    <a
      href={appStoreUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink underline decoration-rule decoration-1 underline-offset-4 transition hover:decoration-ink"
    >
      {product.name}
    </a>
  );

  return (
    <p className="mt-8 flex items-center gap-2.5 font-sans text-sm leading-relaxed text-muted">
      <span>
        {at === -1 ? (
          <>
            {before} {link}
          </>
        ) : (
          <>
            {before}
            {link}
            {after}
          </>
        )}
      </span>
      <Image
        src={product.iconSrc}
        alt=""
        width={28}
        height={28}
        aria-hidden
        className="size-7 shrink-0 rounded-lg border border-rule"
      />
    </p>
  );
}
