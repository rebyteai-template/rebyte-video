import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@react-email/components", "@react-email/render"],
  serverExternalPackages: ["csv-parse", "better-sqlite3"],
};

export default nextConfig;
