import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Native module: keep it out of the bundler and require it at runtime.
  serverExternalPackages: ["better-sqlite3"],
  // Banner image uploads go through Server Actions (1.5 MB cap enforced in code; nginx allows 2 MB).
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  images: {
    // Logos are SVG and served from /public; no remote images at runtime.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
