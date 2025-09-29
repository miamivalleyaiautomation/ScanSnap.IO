// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply CORS headers to all API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL || "https://app.scansnap.io"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS"
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With"
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400"
          }
        ]
      },
      {
        // Specific headers for session endpoints
        source: "/api/app/session/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL || "https://app.scansnap.io"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS"
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Accept"
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true"
          }
        ]
      }
    ]
  },
  
  // Allow app.scansnap.io in image domains if needed
  images: {
    domains: ['scansnap.io', 'app.scansnap.io'],
  },
  
  // Environment variables that should be available
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io',
    NEXT_PUBLIC_PORTAL_URL: process.env.NEXT_PUBLIC_PORTAL_URL || 'https://scansnap.io',
  }
}

module.exports = nextConfig