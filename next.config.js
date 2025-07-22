/** @type {import('next').NextConfig} */
const nextConfig = {
  // Usar Pages Router (no App Router) para evitar conflictos
  experimental: {
    // Configuraciones experimentales si son necesarias
  },
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig