import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['redis'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('redis');
    }
    return config;
  },
};

export default nextConfig;
