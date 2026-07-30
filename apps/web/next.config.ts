import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  transpilePackages: ['@edusheets/ui', '@edusheets/types', '@edusheets/db'],
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }] },
};
export default nextConfig;
