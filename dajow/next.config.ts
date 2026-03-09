import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ✅ Allow ALL HTTPS domains
      },
    ],
  },
};

export default nextConfig;