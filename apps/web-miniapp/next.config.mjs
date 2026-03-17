/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@neuro-academy/types'],
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
