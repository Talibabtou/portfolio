import type { NextConfig } from 'next';

const mediaBase = process.env.MEDIA_BASE?.replace(/\/$/, '');

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
  async rewrites() {
    if (!mediaBase) return [];

    return [
      {
        source: '/media/:path*',
        destination: `${mediaBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
