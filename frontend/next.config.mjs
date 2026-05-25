/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '192.168.1.2',
    'localhost',
    '127.0.0.1'
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/listings',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;