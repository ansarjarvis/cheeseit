/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["uploadthing.com", "lh3.googleusercontent.com"],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
