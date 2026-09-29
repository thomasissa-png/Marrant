/** @type {import('next').NextConfig} */
// Build target conditionnel :
//   - BUILD_TARGET=mobile → export statique (apps/web/out) consommé par Capacitor
//   - sinon → standalone server (Replit)
const isMobileBuild = process.env.BUILD_TARGET === "mobile";

// Redirections 301 centralisées — voir src/lib/seo-redirects.data.cjs
// (format CommonJS — next.config.js n'est pas .ts, on ne peut pas require du .ts).
// Côté TS/tests, passer par src/lib/seo-redirects.ts qui re-exporte typé.
const { SEO_REDIRECTS } = require("./src/lib/seo-redirects.data.cjs");

const nextConfig = {
  output: isMobileBuild ? "export" : "standalone",
  trailingSlash: isMobileBuild ? true : false,
  // En export statique, les routes dynamiques ont besoin de generateStaticParams
  // Les API routes ne sont PAS embarquées en export — elles sont appelées depuis le webview
  // vers https://deviens-marrant.fr (helper apiBase()).
  images: {
    unoptimized: isMobileBuild,
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  typescript: {
    // Required: TS errors are caught by CI lint, not the build step
    ignoreBuildErrors: true,
  },
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externaliser les modules Node natifs et les packages avec des deps natives.
      // On utilise une fonction callback car les noms avec @ (scoped packages)
      // produisent du JS invalide en syntaxe string simple
      // (module.exports = @replit/object-storage → SyntaxError).
      const externalModules = new Set([
        "crypto",
        "querystring",
        "fs",
        "fs/promises",
        "path",
        "@resvg/resvg-js",
        "@replit/object-storage",
      ]);

      config.externals = config.externals || [];
      config.externals.push(({ request }, callback) => {
        if (externalModules.has(request)) {
          // commonjs2 prefix generates: module.exports = require("@replit/object-storage")
          return callback(null, `commonjs2 ${request}`);
        }
        callback();
      });
    }
    return config;
  },
  // headers() et redirects() sont indisponibles en mode export statique (mobile).
  // En mode mobile, le serveur Next n'est pas lancé — pas besoin de ces helpers côté webview.
  ...(isMobileBuild
    ? {}
    : {
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
                // HSTS retiré : Replit / Google Frontend en injecte déjà un identique
                // en amont, ce qui provoquait un doublon dans les réponses HTTP.
                // Si on redéploie hors Replit, réactiver ici avec la même valeur.
                { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-src https://www.youtube.com https://checkout.stripe.com; object-src 'none'; base-uri 'self'" },
              ],
            },
          ];
        },
      }),
  ...(isMobileBuild
    ? {}
    : {
        async redirects() {
          // Source unique : src/lib/seo-redirects.data.cjs
          // Toute nouvelle redirection 301 doit être ajoutée là, pas ici.
          return SEO_REDIRECTS;
        },
      }),
};

module.exports = nextConfig;
