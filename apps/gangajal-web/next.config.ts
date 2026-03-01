import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pinddaan/types",
    "@pinddaan/schemas",
    "@pinddaan/config",
    "@pinddaan/shared",
    "@pinddaan/auth",
    "@pinddaan/ui",
    "@pinddaan/payments",
    "@pinddaan/email",
    "lucide-react"
  ],
  output: "standalone",
  turbopack: {
    root: "../../"
  }
};

export default nextConfig;
