import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  experimental: {
    // Limit workers for shared hosting with process limits
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
