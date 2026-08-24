import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/fishing-charters',
        destination: '/tours',
      },
      {
        source: '/charters',
        destination: '/tours',
      },
      {
        source: '/safari',
        destination: '/tours',
      },
    ];
  },
};

export default nextConfig;
