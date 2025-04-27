import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['redis'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('redis');
    }
    return config;
  },
  output: 'standalone',
  turbopack: {
    resolveAlias: {
      // Add any path aliases if needed
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  }
};

export default nextConfig;
