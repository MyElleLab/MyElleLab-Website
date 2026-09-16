export type ProductStatus = "AVAILABLE" | "IN_PRODUCTION";

export type Product = {
  name: string;
  /** Stable url fragment; the card's id and the hero link both derive from it. */
  slug: string;
  tagline: string;
  status: ProductStatus;
  appStoreId: string;
  iconSrc: string;
  siteUrl?: string;
  /**
   * The app mark redrawn as bare ink, for setting inline in a line of type.
   * The card heading sets it in place of the parenthesised letter in `name`,
   * so the mark and the letters after it read as one word.
   *
   * A separate file from `iconSrc` on purpose: the App Store icon is a filled
   * tile, and a filled tile at heading size reads as a box beside a word
   * rather than as a letter inside one.
   */
  wordmarkIconSrc?: string;
};

export type Suite = {
  id: string;
  name: string;
  description: string;
  products: Product[];
};

/* Order is meaningful: it drives the suite eyebrow numbering (01/04 …), the
   hero marquee's icon order, and the footer's Apps column. Reorder here and
   the page follows. */
export const suites: Suite[] = [
  {
    id: "mysmartmates",
    name: "MySmartMates",
    description: "Apps that think ahead so you don't have to.",
    products: [
      {
        name: "MySellingMate",
        slug: "mysellingmate",
        tagline:
          "Photograph anything you want to sell and get a price and a place to sell it.",
        status: "AVAILABLE",
        appStoreId: "6794851597",
        iconSrc: "/icon-MySellingMate.png",
        siteUrl: "https://mysellingmate.myellelab.com",
      },
    ],
  },
  {
    id: "mycameraroll",
    name: "MyCameraRoll",
    description: "Apps for your photos and videos.",
    products: [
      {
        name: "MyLooper",
        slug: "mylooper",
        tagline: "Video organizer & looper.",
        status: "AVAILABLE",
        appStoreId: "6761893510",
        iconSrc: "/icon-MyLooper.svg",
        siteUrl: "https://mylooper.myellelab.com",
      },
      {
        name: "MyTwinLens",
        slug: "mytwinlens",
        tagline: "iPhone mirroring for solo travellers.",
        status: "AVAILABLE",
        appStoreId: "6762047518",
        iconSrc: "/icon-MyTwinLens.jpeg",
        siteUrl: "https://mytwinlens.myellelab.com",
      },
    ],
  },
  {
    id: "mydailysuccess",
    name: "MyDailySuccess",
    description: "Apps for building a better daily routine.",
    products: [
      {
        name: "MyGrowth",
        slug: "mygrowth",
        tagline: "Watch your habits compound into success.",
        status: "AVAILABLE",
        appStoreId: "6761617617",
        iconSrc: "/icon-MyGrowth.png",
        siteUrl: "https://mygrowth.myellelab.com/en/",
      },
      {
        name: "(E)go: MySuccess",
        slug: "ego",
        tagline: "Remind yourself that you are the best.",
        status: "IN_PRODUCTION",
        appStoreId: "6811412550",
        iconSrc: "/icon-MyEgo.png",
        wordmarkIconSrc: "/wordmark-MyEgo.png",
        siteUrl: "https://ego.myellelab.com/",
      },
    ],
  },
  {
    id: "myfreetime",
    name: "MyFreeTime",
    description: "Apps for the moments you make your own.",
    products: [
      {
        name: "MyMoodLab",
        slug: "mymoodlab",
        tagline: "Relationship Court.",
        status: "AVAILABLE",
        appStoreId: "6758580161",
        iconSrc: "/icon-MyMoodLab.png",
        siteUrl: "https://mymoodlab.myellelab.com",
      },
      {
        name: "MyYahtzee",
        slug: "myyahtzee",
        tagline: "Dice & Tracker.",
        status: "AVAILABLE",
        appStoreId: "6790156691",
        iconSrc: "/icon-MyYahtzee.png",
        siteUrl: "https://myyahtzee.myellelab.com",
      },
    ],
  },
];

/** Every product across every suite, flattened. */
export const allProducts: Product[] = suites.flatMap((suite) => suite.products);

/** Lookup by the product's own slug. Used to resolve a post's relatedApp. */
export function findProduct(slug: string): Product | undefined {
  return allProducts.find((product) => product.slug === slug);
}

/**
 * Splits a name that carries the app mark as one of its own letters.
 *
 * A single parenthesised letter at the head of `name` marks the letter the
 * icon stands for, which is how the app writes itself: "(E)go: MySuccess" is
 * the mark, then "go", then the rest. `fused` is the run of letters the mark
 * must never be separated from; `rest` is free to wrap.
 *
 * Returns undefined for every other name, which is all of them. Nothing has
 * to opt in twice: the name states the device and `wordmarkIconSrc` supplies
 * the artwork, so the two cannot describe different letters.
 */
export function splitIconLetterName(product: Product) {
  if (!product.wordmarkIconSrc) return undefined;
  const match = /^\(([A-Za-z])\)(\w*)(.*)$/.exec(product.name);
  if (!match) return undefined;
  const [, letter, fused, rest] = match;
  return { letter, fused, rest, src: product.wordmarkIconSrc };
}

/** The App Store listing for a product. */
export function appStoreUrl(product: Product) {
  return `https://apps.apple.com/app/id${product.appStoreId}`;
}

/** The single source of truth for a product card's anchor id. */
export function productAnchorId(product: Product) {
  return `product-${product.slug}`;
}

/**
 * The single source of truth for a suite's blog series slug — the same idea as
 * productAnchorId(). The blog routes are generated from this, so renaming a
 * suite moves its series rather than stranding a dead route behind it.
 */
export function suiteSlug(suite: Suite) {
  return suite.id;
}

/* The blog's href helper used to live here. It moved to lib/series.ts as
   seriesPath(), because the blog now has a series that is not a suite. */
