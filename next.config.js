/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

const nextConfig = {
    images: {
        domains: ['xojiaka.uz'], // To'g'ri domen qo'shilganligiga ishonch hosil qiling
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Performance optimizatsiyasi
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['antd', 'lodash', '@ant-design/charts', 'recharts', 'framer-motion'],
    },
    // Qo'shimcha konfiguratsiyalar
    productionBrowserSourceMaps: false, // Source map yaratmaslik (tezroq build uchun)
    poweredByHeader: false, // X-Powered-By headerini olib tashlash
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production', // Production-da console.log-larni olib tashlash
    },
    // Improve performance
    reactStrictMode: false,
};

module.exports = withBundleAnalyzer(nextConfig);
