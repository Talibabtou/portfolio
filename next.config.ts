import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
