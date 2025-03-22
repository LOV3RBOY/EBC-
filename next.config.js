/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure the experimental features are enabled for app directory
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig
