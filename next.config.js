/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permet le déploiement même si des erreurs TS subsistent
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permet le déploiement même si des erreurs ESLint subsistent
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
