/** @type {import('next').NextConfig} */
const API_ORIGIN = process.env.BACKEND_ORIGIN ?? 'http://localhost:3001';

const nextConfig = {
  transpilePackages: ['@neuro-academy/types'],
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [480, 640, 750, 828],
    imageSizes: [64, 128, 256],
  },
  experimental: {
    optimizePackageImports: ['@neuro-academy/types'],
  },
};

export default nextConfig;
