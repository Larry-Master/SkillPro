/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.resolve.alias = {
      ...config.resolve.alias,
      // your aliases are automatically handled by Next.js
    };

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
