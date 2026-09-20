import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Bypass Next.js IP resolution for NAT64/IPv6 setups (Supabase already serves optimized assets via CDN)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ibmxgwgzoakrkmoguwxn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
