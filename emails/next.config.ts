import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@react-email/components", "@react-email/render"],
  serverExternalPackages: ["csv-parse"],
  output: 'standalone',
  images: { unoptimized: true },
};

export default nextConfig;
