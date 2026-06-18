import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
    resolveAlias: {
      tailwindcss: path.join(__dirname, "node_modules/tailwindcss"),
      "tw-animate-css": path.join(__dirname, "node_modules/tw-animate-css"),
    },
  },
};

export default nextConfig;