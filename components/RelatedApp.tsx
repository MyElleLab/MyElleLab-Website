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
 * The lens is a link too, to the app's own site. It was decorative until the
 * two links could be told apart: a second link to the *same* destination is a
 * duplicate target for anyone tabbing or listening, which is what it would
 * have been while both pointed at the App Store. Pointing it at the product
 * site instead gives it somewhere of its own to go, and a name of its own to
 * say, so the two are distinct rather than redundant.
 *
 * Name to the store, mark to the site. The accessible names are "MyGrowth"
 * and "MyGrowth website", which is the distinction stated out loud rather
 * than left to the reader to infer from two identical-sounding targets.
 *
 * A product with no siteUrl falls back to the decorative lens rather than a
 * dead link. Every product has one today; the type says the field is
 * optional, so the fallback is what keeps that true.
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
      <span className="shrink-0">
        {product.siteUrl ? (
          /* href makes IconBloom an anchor and alt becomes its aria-label, so
             the accessible name is "MyGrowth website" rather than the empty
             string this used to render or the whole sentence beside it.
             hoverEffects is left at its default, which is the hero row's
             behaviour: scale, glass sweep and a press state, all already
             gated behind (hover: hover) and reduced motion in the module. */
          <IconBloom
            src={product.iconSrc}
            alt={`${product.name} website`}
            href={product.siteUrl}
            size={LENS_SIZE}
            iconSize={LENS_ICON}
          />
        ) : (
          /* alt="" makes IconBloom render a div and hide it from assistive
             tech, and nothing here is hoverable, which is right when there is
             nowhere for it to go. */
          <IconBloom
            src={product.iconSrc}
            alt=""
            size={LENS_SIZE}
            iconSize={LENS_ICON}
            hoverEffects={false}
          />
        )}
      </span>
    </p>
  );
}
