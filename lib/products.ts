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
        siteUrl: "https://mygrowth.myellelab.com/en/",
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
        name: "MyLooper",
        tagline: "Video organizer & looper.",
        status: "AVAILABLE",
        appStoreId: "6761893510",
        iconSrc: "/icon-MyLooper.svg",
        siteUrl: "https://mylooper.myellelab.com",
      },
      {
        name: "MyTwinLens",
        tagline: "iPhone mirroring for solo travellers.",
        status: "AVAILABLE",
        appStoreId: "6762047518",
        iconSrc: "/icon-MyTwinLens.jpeg",
        siteUrl: "https://mytwinlens.myellelab.com",
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
        tagline: "Relationship Court.",
        status: "AVAILABLE",
        appStoreId: "6758580161",
        iconSrc: "/icon-MyMoodLab.png",
        siteUrl: "https://mymoodlab.myellelab.com",
      },
      {
        name: "MyYahtzee",
        tagline: "Dice & Tracker.",
        status: "AVAILABLE",
        appStoreId: "6790156691",
        iconSrc: "/icon-MyYahtzee.png",
        siteUrl: "https://myyahtzee.myellelab.com",
      },
    ],
  },
  {
    id: "mysmartmates",
    name: "MySmartMates",
    description: "Apps that use AI to make smarter everyday decisions.",
    products: [
      {
        name: "MySellingMate",
        tagline: "Snap a photo, get a resale price and the best place to sell it.",
        status: "IN_PRODUCTION",
        appStoreId: "6794851597",
        iconSrc: "/icon-MySellingMate.png",
        siteUrl: "https://mysellingmate.myellelab.com",
      },
    ],
  },
];
