import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Licensed stock and your own photos. See docs/IMAGES.md.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
