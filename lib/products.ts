export type ProductStatus = "AVAILABLE" | "IN_PRODUCTION";

export type Product = {
  name: string;
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

export const suites: Suite[] = [
  {
    id: "mydailysuccess",
    name: "MyDailySuccess",
    description: "Apps for building a better daily routine.",
    products: [
      {
        name: "MyGrowth",
        tagline: "Watch your habits compound into success.",
        status: "AVAILABLE",
        appStoreId: "6761617617",
        iconSrc: "/icon-MyGrowth.png",
        siteUrl: "https://myhabitstats.com",
      },
      {
        name: "MyVisionLab",
        tagline: "Turn your vision into a daily practice.",
        status: "IN_PRODUCTION",
        appStoreId: "6774214996",
        iconSrc: "/icon-MyVisionLab.png",
      },
      {
        name: "MyDarkMotivation",
        tagline: "Unfiltered fuel for the days you don't feel like it.",
        status: "IN_PRODUCTION",
        appStoreId: "6761914913",
        iconSrc: "/icon-MyDarkMotivation.png",
      },
    ],
  },
  {
    id: "mycameraroll",
    name: "MyCameraRoll",
    description: "Apps for your photos and videos.",
    products: [
      {
        name: "MyFlux",
        tagline: "Video organizer & looper.",
        status: "AVAILABLE",
        appStoreId: "6761893510",
        iconSrc: "/icon-MyFlux.svg",
        siteUrl: "https://getmyflux.com",
      },
      {
        name: "TwinLens",
        tagline: "iPhone mirroring for solo travellers.",
        status: "AVAILABLE",
        appStoreId: "6762047518",
        iconSrc: "/icon-TwinLens.jpeg",
        siteUrl: "https://twinlensapp.com",
      },
    ],
  },
];
