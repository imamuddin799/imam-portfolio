import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},

  // Exclude projects/imamuddin from production file tracing
  // This prevents Turbopack from bundling 16,000+ project files
  // outputFileTracingExcludes: {
  //   "*": [
  //     "./projects/**",
  //     "./public/builds/**",
  //   ],
  // },
  // allowedDevOrigins: ['192.168.1.6'],
};

export default nextConfig;