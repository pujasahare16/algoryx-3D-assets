import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Turbopack (default in Next.js 16)
  turbopack: {},
  // Transpile Three.js packages
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
