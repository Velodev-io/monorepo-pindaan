import type { NextConfig } from "next";

const nextConfig: any = {
  transpilePackages: ["@pinddaan/types", "@pinddaan/schemas", "@pinddaan/config"],
  output: "standalone"
};

export default nextConfig;
