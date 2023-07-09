/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack: (config, { isServer }) => {
      config.externals.push("pino-pretty", "lokijs", "encoding");

      if (!isServer) {
         // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
         config.resolve.fallback = {
            fs: false,
         };
      }

      return config;
   },

   images: {
      domains: ["ipfs.io"],
   },
};

module.exports = nextConfig;
