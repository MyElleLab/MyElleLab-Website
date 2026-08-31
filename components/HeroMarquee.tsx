import { IconBloom } from "@/components/IconBloom";
import type { Product } from "@/lib/products";
import styles from "./HeroMarquee.module.css";

/* The track holds the icon set four times and travels -50%, i.e. two whole
   sets. Two sets would satisfy the loop maths but not the geometry: one set is
   704px at desktop against a 1072px viewport, so once it had scrolled a full
   set there would be nothing left to fill the right-hand side. Travelling a
   whole number of sets is what makes the wrap invisible; four copies is what
   keeps the viewport covered. */
const COPIES = 4;

export function HeroMarquee({ products }: { products: Product[] }) {
  return (
    <div className={styles.viewport}>
      <div className={styles.track}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <span
            key={copy}
            className={
              copy > 0 ? `${styles.contents} ${styles.dup}` : styles.contents
            }
            /* Only the first pass is real; the rest are visual duplication,
               and reduced motion drops them so the static fallback is the
               original eight-disc row rather than thirty-two. */
            aria-hidden={copy > 0 ? true : undefined}
          >
            {products.map((p) => (
              <IconBloom
                key={`${copy}-${p.name}`}
                src={p.iconSrc}
                alt=""
                className={styles.item}
              />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
