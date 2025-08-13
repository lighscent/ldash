/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: false,
    },
    webpack: (config) => {
        config.externals = [...config.externals, 'fs'];
        return config;
    },
    env: {
        NODE_ENV: process.env.NODE_ENV,
    }
};

module.exports = nextConfig;
