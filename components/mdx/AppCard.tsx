import Image from "next/image";

import { IconBloom } from "@/components/IconBloom";
import { appStoreUrl, findProduct, suites } from "@/lib/products";

/**
 * The in-body advert for one app, placed by hand between two sections:
 *
 *   <AppCard
 *     app="mygrowth"
 *     headline="Keep a record of your own."
 *     caption="One sentence on why this app belongs next to this post."
 *   />
 *
 * It is the template's one loud element, so it is built to be recognisably a
 * card and not body copy: white surface, hairline, the post title's heading
 * voice, and a full width ink button. The closing one-liner (RelatedApp) is
 * the quiet version of the same idea and stays at the end of the post; the
 * two are meant to appear together.
 *
 * `image` is optional: a screenshot or device frame under /public, shown in a
 * tinted panel under the call to action. Without it the card ends at the
 * button, which is complete on its own.
 *
 * An unknown slug throws, which stops the build and names the slug. A card
 * that silently renders nothing in the middle of a post is the worse failure.
 */

/** "(E)go" style names carry their icon letter in parentheses; drop them here. */
function displayName(name: string) {
  return name.replace(/[()]/g, "");
}

export function AppCard({
  app,
  headline,
  caption,
  image,
  imageAlt,
}: {
  /** A product slug from lib/products.ts. */
  app: string;
  /** Short, declarative, ends with a full stop. Defaults to the app's tagline. */
  headline?: string;
  /** One or two sentences tying the app to the post. */
  caption: string;
  image?: string;
  imageAlt?: string;
}) {
  const product = findProduct(app);
  if (!product) {
    throw new Error(
      `<AppCard app="${app}">: no product has that slug in lib/products.ts`,
    );
  }

  const name = displayName(product.name);
  const suite = suites.find((s) => s.products.includes(product));
  const available = product.status === "AVAILABLE";
  const href = available ? appStoreUrl(product) : product.siteUrl;

  return (
    <aside
      aria-label={`${name}, from MyElleLab`}
      className="my-12 overflow-hidden rounded-2xl border border-rule bg-surface"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3">
          <IconBloom
            src={product.iconSrc}
            alt=""
            size={44}
            iconSize={24}
            hoverEffects={false}
          />
          <p className="font-sans text-sm text-muted">
            <span className="font-medium text-ink">{name}</span>
            {suite && (
              <>
                <span aria-hidden> · </span>
                {suite.name}
              </>
            )}
          </p>
        </div>

        <p className="mt-6 font-serif text-[1.75rem] font-bold leading-[1.08] tracking-[-0.025em] text-balance text-ink md:text-4xl">
          {headline ?? product.tagline}
        </p>

        <p className="mt-4 font-sans text-base leading-relaxed text-muted">
          {caption}
        </p>

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex w-full items-center justify-center rounded-xl bg-ink px-5 py-4 font-sans text-sm font-semibold text-surface transition hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {available ? `Get ${name} on the App Store` : `Follow ${name}`}
          </a>
        )}

        <p className="mt-4 text-center font-sans text-xs text-muted">
          {available ? "On the App Store for iPhone" : "In production"}
          {available && product.siteUrl && (
            <>
              <span aria-hidden> · </span>
              <a
                href={product.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rule underline-offset-4 transition hover:text-ink hover:decoration-ink"
              >
                {name} website
              </a>
            </>
          )}
        </p>
      </div>

      {image && (
        <div className="border-t border-rule bg-gradient-to-b from-canvas to-wisp/40 px-6 pt-8 md:px-8">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            width={1280}
            height={960}
            className="mx-auto w-full max-w-[20rem] object-contain"
          />
        </div>
      )}
    </aside>
  );
}
