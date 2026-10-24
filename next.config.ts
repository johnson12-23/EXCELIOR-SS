import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  async redirects() { return [{ source: "/touch", destination: "/contact", permanent: true }]; },
};
export default nextConfig;
