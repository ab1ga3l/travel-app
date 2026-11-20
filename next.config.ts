import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Licensed stock and your own photos. See docs/IMAGES.md.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  // The app preview's code and fonts have a content hash in their names, so phones can keep them
  // for a year and only download again when the app changes.
  async headers() {
    const forever = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/app/_expo/:path*", headers: forever },
      { source: "/app/assets/:path*", headers: forever },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
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
