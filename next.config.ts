import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Fully static output in `out/` — no Node process to run or maintain.
   * Cloudflare Pages serves that directory directly.
   */
  output: "export",
  images: {
    // No image optimiser exists without a server.
    unoptimized: true,
  },
  // Emits `path/index.html`, which keeps directory-style URLs working on any
  // static host without per-host rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
