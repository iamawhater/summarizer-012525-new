/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://34.226.138.101/api/:path*`,
      },
    ]
  }
}

module.exports = nextConfig