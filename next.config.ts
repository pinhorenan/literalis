import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['covers.openlibrary.org'], // permite esse host no <Image>
  },
};

export default nextConfig;
