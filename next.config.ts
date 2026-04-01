import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
    ],
  },
  async headers() {
    const imageCacheHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, stale-while-revalidate=86400",
      },
    ];

    return [
      {
        source: "/backgrounds/:path*",
        headers: imageCacheHeaders,
      },
      {
        source: "/gallery/:path*",
        headers: imageCacheHeaders,
      },
      {
        source: "/ebc/:path*",
        headers: imageCacheHeaders,
      },
      {
        source: "/abc/:path*",
        headers: imageCacheHeaders,
      },
      {
        source: "/upper-mustang/:path*",
        headers: imageCacheHeaders,
      },
      {
        source: "/logo.webp",
        headers: imageCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
