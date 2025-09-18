/** @type {import(‘next’).NextConfig} */
const nextConfig = {
// Netlify-specific optimizations
output: ‘standalone’,

// ESLint configuration for build
eslint: {
// Only run ESLint on specific directories
dirs: [‘app’, ‘components’, ‘lib’, ‘hooks’],
// Don’t fail builds on ESLint errors (optional - remove if you want strict linting)
ignoreDuringBuilds: false,
},

// TypeScript configuration
typescript: {
// Don’t fail builds on TypeScript errors during development
// Remove this in production if you want strict type checking
ignoreBuildErrors: false,
},

// Image optimization
images: {
formats: [‘image/webp’, ‘image/avif’],
},

// Environment variables that are safe to expose to the browser
env: {
NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
},

// Experimental features that work well with Netlify
experimental: {
serverComponentsExternalPackages: [],
},
};

module.exports = nextConfig;
