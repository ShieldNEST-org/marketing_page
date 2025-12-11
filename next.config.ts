import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development
  reactStrictMode: true,

  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shieldnest.org',
      },
      {
        protocol: 'https',
        hostname: 'www.shieldnest.org',
      },
      {
        protocol: 'https',
        hostname: 'v1.shieldnest.org',
      },
    ],
  },

  // Security and SEO headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache static assets
      {
        source: '/(.*).(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|xml|txt|json)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache JS/CSS
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // No redirects here - let Vercel handle www/non-www at DNS level
};

export default nextConfig;
