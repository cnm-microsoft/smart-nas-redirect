/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // 确保中间件正常工作
  async rewrites() {
    return []
  },
}

module.exports = nextConfig