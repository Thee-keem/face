import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Ignore system files that cause Watchpack errors on Windows
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        'C:\\\\DumpStack.log.tmp',
        'C:\\\\hiberfil.sys',
        'C:\\\\pagefile.sys',
        'C:\\\\swapfile.sys'
      ]
    };
    return config;
  }
};

export default nextConfig;