import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Vercel optimizes images (WebP/AVIF, responsive) at the edge.
    // Only set `unoptimized: true` again if exporting to a static host.
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
