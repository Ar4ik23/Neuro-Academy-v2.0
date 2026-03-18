/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@neuro-academy/types'],
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // TON-библиотеки используют Node.js модули — заменяем на пустые в браузере
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        buffer: false,
      };
    }
    return config;
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
