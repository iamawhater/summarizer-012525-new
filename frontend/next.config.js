/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const rewrites = [
      {
        source: '/api/summarize',
        destination: `${process.env.API_URL}/api/summarize`,
      },
    ];
    console.log('Next.js Rewrites Configuration:', {
      rules: rewrites,
      apiUrl: process.env.API_URL,
      fullDestination: `${process.env.API_URL}/api/summarize`
    });
    return rewrites;
  },
}

module.exports = nextConfig