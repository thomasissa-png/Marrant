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
    // Build : typecheck via `tsconfig.build.json` (exclut les tests). Les
    // tests restent typechecked séparément par Jest et par la CI
    // (`npx tsc --noEmit`) qui utilise le tsconfig racine.
    tsconfigPath: "tsconfig.build.json",
    // TODO(s12) : passer à `false` une fois le helper de test
    // `__resetBufferQueueCacheForTests` de `src/app/api/cron/social-analytics/route.ts`
    // déplacé hors du fichier `route.ts` (Next 14 refuse les exports arbitraires
    // sur les Route Handlers). Aujourd'hui, `tsc --noEmit -p tsconfig.build.json`
    // remonte 0 erreur, mais Next 14 impose sa propre validation supplémentaire
    // qui échoue tant que ce helper reste co-localisé.
    ignoreBuildErrors: true,
  },
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer, webpack }) => {
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
    // `resend` déclare `@react-email/render` comme peerDependency optionnelle
    // (`peerDependenciesMeta.optional: true`) — utilisé UNIQUEMENT si on passe
    // des composants React à `resend.emails.send`. Or on n'envoie que du HTML
    // brut dans tout le projet. Le paquet n'est pas installé, mais webpack
    // trace quand même la ligne `require("@react-email/render")` du bundle
    // `resend` et casse le build. On l'ignore proprement à la compilation :
    // ce require n'est jamais atteint à l'exécution.
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@react-email\/render$/,
      }),
    );
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
                // HSTS retiré : Replit / Google Frontend en injecte déjà un
                // (max-age=63072000; includeSubDomains) en amont — doublon constaté
                // en prod. Si on redéploie hors Replit, réactiver ici.
                // CSP prod — s11 : retrait de 'unsafe-eval' (Next 14 prod n'en
                // a pas besoin ; Umami et Stripe.js n'utilisent pas eval).
                // 'unsafe-inline' reste requis pour les scripts d'hydratation
                // Next et pour Stripe.js. Ajouté explicitement js.stripe.com.
                // Si un nouveau tiers est ajouté (Sentry, Datadog RUM…), mettre
                // à jour connect-src ET script-src en même temps.
                { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cloud.umami.is https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-src https://www.youtube.com https://checkout.stripe.com https://js.stripe.com; object-src 'none'; base-uri 'self'" },
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
          // Next.js rejette les clés inconnues : on ne garde que les champs attendus.
          return SEO_REDIRECTS.map(({ source, destination, permanent }) => ({
            source,
            destination,
            permanent,
          }));
        },
      }),
};

module.exports = nextConfig;
