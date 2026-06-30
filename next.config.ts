import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sfo.cloud.appwrite.io",
        port: "",
        pathname: "/v1/storage/buckets/**",
      },
    ],
  },
};

export default nextConfig;
