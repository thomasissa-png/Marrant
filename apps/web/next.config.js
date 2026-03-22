/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: false,
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ne pas bundler les modules Node.js natifs côté serveur
      config.externals = config.externals || [];
      config.externals.push("crypto", "@resvg/resvg-js");
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-src https://www.youtube.com https://checkout.stripe.com; object-src 'none'; base-uri 'self'" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/blagues",
        destination: "/vannes",
        permanent: true,
      },
      {
        source: "/blog/devenir-marrant",
        destination: "/blog/comment-devenir-drole",
        permanent: true,
      },
      {
        source: "/blog/devenir-plus-drole",
        destination: "/blog/comment-devenir-drole",
        permanent: true,
      },
      {
        source: "/blog/apprendre-a-etre-drole",
        destination: "/blog/comment-devenir-drole",
        permanent: true,
      },
      // Fusions anti-cannibalisation — 18 mars 2026
      {
        source: "/blog/apprendre-etre-drole",
        destination: "/blog/comment-devenir-drole",
        permanent: true,
      },
      {
        source: "/blog/techniques-repartie",
        destination: "/blog/comment-avoir-de-la-repartie",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

module.exports = nextConfig;
