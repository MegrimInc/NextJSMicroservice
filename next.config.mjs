/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/website',
    async rewrites() {
      return [
        {
          source: '/website/_next/:path*',
          destination: '/_next/:path*'
        }
      ]
    }
  };

export default nextConfig;
