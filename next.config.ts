import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cache transformed images for 31 days (2,678,400 seconds) to avoid repeat transformations
    minimumCacheTTL: 2678400,

    // Standardize on WebP (avoids duplicate transformations for AVIF + WebP)
    formats: ['image/webp'],

    // Essential responsive breakpoints to limit generated size variants
    deviceSizes: [640, 768, 1080, 1280, 1920],
    imageSizes: [32, 64, 128, 256],

    // Restrict transformation qualities to reduce cache fragmentation
    qualities: [75],

    // Allowlist only required external domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
