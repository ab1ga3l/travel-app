import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Licensed stock and your own photos. See docs/IMAGES.md.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  // The phone app's web preview lives in public/app (built with `npm run preview:site` in mobile/).
  // Any /app/... page that isn't a file is handled by the app's own router.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        { source: "/app", destination: "/app/index.html" },
        { source: "/app/:path*", destination: "/app/index.html" },
      ],
    };
  },
};

export default nextConfig;
