import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only honours quality values listed here; without 85 the hero
    // backdrop silently falls back to the default 75.
    qualities: [75, 85],
  },
};

export default nextConfig;
