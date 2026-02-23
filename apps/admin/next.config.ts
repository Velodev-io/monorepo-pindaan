import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pinddaan/types", "@pinddaan/schemas", "@pinddaan/config"],
  output: "standalone"
};

export default nextConfig;
