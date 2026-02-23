import type { NextConfig } from "next";

const nextConfig: any = {
  transpilePackages: ["@pinddaan/types", "@pinddaan/schemas", "@pinddaan/config"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
