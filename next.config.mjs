/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.webosmotic.com",
      },
      {
        protocol: "https",
        hostname: "*.visioninfotech.in",
      },
      {
        protocol: "https",
        hostname: "*.weetechsolution.com",
      },
      {
        protocol: "https",
        hostname: "*.narolainfotech.com",
      },
      {
        protocol: "https",
        hostname: "*.artoonsolutions.com",
      },
    ],
  },
};

export default nextConfig;
