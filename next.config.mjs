/** @type {import('next').NextConfig} */
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
    ],
  },

};

export default nextConfig;
