import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo root has its own package.json for the asset-register scripts, so
  // Next sees two lockfiles and has to guess which is the workspace root.
  // Pin it to this app.
  turbopack: {
    root: __dirname,
  },
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
};

export default nextConfig;
