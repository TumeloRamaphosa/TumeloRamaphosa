import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async redirects() {
    return [
      { source: "/designs", destination: "/designs/index.html", permanent: false },
      { source: "/designs/", destination: "/designs/index.html", permanent: false },
    ];
  },
};

export default nextConfig;
