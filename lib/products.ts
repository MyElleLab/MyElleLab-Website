export type ProductStatus = "AVAILABLE" | "IN_PRODUCTION";

export type Product = {
  name: string;
  tagline: string;
  status: ProductStatus;
  domain?: string;
  appStoreUrl?: string;
  iconGradient: string;
  initials: string;
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
        domain: "myhabitstats.com",
        appStoreUrl: "https://apps.apple.com/app/myhabitstats",
        iconGradient: "from-flame-500 to-rose-500",
        initials: "HS",
      },
      {
        name: "MyVisionLab",
        tagline: "Turn your vision into a daily practice.",
        status: "IN_PRODUCTION",
        iconGradient: "from-indigo-500 to-violet-600",
        initials: "VL",
      },
      {
        name: "MyDarkMotivation",
        tagline: "Unfiltered fuel for the days you don't feel like it.",
        status: "IN_PRODUCTION",
        iconGradient: "from-zinc-700 to-zinc-900",
        initials: "DM",
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
        domain: "getmyflux.com",
        appStoreUrl: "https://apps.apple.com/app/myflux",
        iconGradient: "from-sky-400 to-indigo-500",
        initials: "FX",
      },
      {
        name: "TwinLens",
        tagline:
          "iPhone mirroring for professional photographers and solo travellers.",
        status: "IN_PRODUCTION",
        domain: "twinlensapp.com",
        iconGradient: "from-emerald-400 to-teal-600",
        initials: "TL",
      },
    ],
  },
];
