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
  accent: string;
  products: Product[];
};

export const suites: Suite[] = [
  {
    id: "mydailysuccess",
    name: "MyDailySuccess",
    description: "Apps for building a better daily routine.",
    accent: "from-flame-500/30 via-flame-500/10 to-transparent",
    products: [
      {
        name: "MyHabitStats",
        tagline: "Habit tracker",
        status: "AVAILABLE",
        appStoreId: "6761617617",
        iconSrc: "/icon-MyHabitStats.png",
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
    accent: "from-sky-500/25 via-indigo-500/10 to-transparent",
    products: [
      {
        name: "MyFlux",
        tagline: "Video organizer & looper.",
        status: "AVAILABLE",
        appStoreId: "6761893510",
        iconSrc: "/icon-MyFlux.png",
        siteUrl: "https://getmyflux.com",
      },
      {
        name: "TwinLens",
        tagline:
          "iPhone mirroring for professional photographers and solo travellers.",
        status: "IN_PRODUCTION",
        appStoreId: "6762047518",
        iconSrc: "/icon-TwinLens.jpeg",
        siteUrl: "https://twinlensapp.com",
      },
    ],
  },
];
