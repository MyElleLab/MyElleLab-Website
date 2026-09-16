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
        name: "(E)go: MyPersonal Success",
        slug: "ego",
        tagline: "[PLACEHOLDER: tagline to be supplied. Do not publish as-is.]",
        status: "IN_PRODUCTION",
        appStoreId: "6811412550",
        iconSrc: "/icon-MyEgo.png",
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
