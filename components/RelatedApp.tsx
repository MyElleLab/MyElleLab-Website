import { IconBloom } from "@/components/IconBloom";
import { appStoreUrl, type Product } from "@/lib/products";

/**
 * A closing aside pointing at one app. One line, one lens, no card.
 *
 * The pitch is written per post and names the app, so the name inside the
 * sentence becomes the link rather than a separate "Try the app" control. If
 * a pitch does not happen to contain the name, the link is appended instead
 * of silently rendering an unlinked line.
 *
 * The lens is deliberately not a link. The app name a few words to its left
 * already points at the App Store, and a second adjacent link to the same
 * destination is a duplicate target for anyone tabbing or using a screen
 * reader. It is decorative here, the same arrangement ProductCard uses, where
 * the card owns the interaction and the lens is passive.
 */

/**
 * Disc diameter, and the icon seated in it.
 *
 * IconBloom's own ratios put the icon at 53 to 56 per cent of the disc (60/32
 * in the hero, 64/36 on the cards); 24/44 is 55, so the proportions carry
 * over unchanged.
 *
 * 56 was tried first, since that is what a 28px icon wants at those ratios.
 * It sits well beside the two line pitch but is twice the height of a single
 * line of 14px text, and next to a one line aside it reads as a promo badge
 * rather than a mark beside a sentence. 44 stays subordinate to both.
 *
 * Note that the lens is rotated 45 degrees, so its bounding box measures 62px
 * even though the visible disc, and the space it occupies in the flow, is 44.
 */
const LENS_SIZE = 44;
const LENS_ICON = 24;

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
    <p className="mt-8 flex items-center gap-3 font-sans text-sm leading-relaxed text-muted">
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
      {/* alt="" makes IconBloom render a div and hide it from assistive tech,
          which is right: the link already carries the name. hoverEffects off
          because nothing here is hoverable. */}
      <span className="shrink-0">
        <IconBloom
          src={product.iconSrc}
          alt=""
          size={LENS_SIZE}
          iconSize={LENS_ICON}
          hoverEffects={false}
        />
      </span>
    </p>
  );
}
