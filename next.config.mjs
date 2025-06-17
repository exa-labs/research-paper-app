/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/research-paper-app",
    experimental: {
      serverActions: {
        allowedOrigins: ["demo.exa.ai"],
      },
    },
  };

export default nextConfig;
