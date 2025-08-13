/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        rules: {
            '*.ts': {
                loaders: ['ts-loader'],
            },
        },
    },
    webpack: (config, { isServer, dev }) => {
        // Only apply webpack config when not using Turbopack
        if (!dev) {
            if (!isServer) {
                config.resolve.fallback = {
                    ...config.resolve.fallback,
                    fs: false,
                    net: false,
                    tls: false,
                };
            }
        }
        return config;
    },
    serverExternalPackages: ['fs']
};

module.exports = nextConfig;