import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pinddaan/types", "@pinddaan/schemas", "@pinddaan/config"],
};

export default nextConfig;
