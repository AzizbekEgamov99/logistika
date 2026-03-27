/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'xojiaka.uz',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'xojiaka.uz',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false, // 🔧 ESLint xatolarini ko‘rsatadi
  },
  typescript: {
    ignoreBuildErrors: false, // 🔧 TypeScript xatolarini buildda chiqaradi
  },
};

module.exports = nextConfig;
