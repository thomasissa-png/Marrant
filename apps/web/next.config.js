/** @type {import('next').NextConfig} */
// Build target conditionnel :
//   - BUILD_TARGET=mobile → export statique (apps/web/out) consommé par Capacitor
//   - sinon → standalone server (Replit)
const isMobileBuild = process.env.BUILD_TARGET === "mobile";
// Build Cloudflare Workers (OpenNext) : positionné par `npm run build:cf`.
// Sans cette variable (Replit, mobile), la config ci-dessous est inchangée.
const isCloudflareBuild = process.env.MARRANT_BUILD_TARGET === "cloudflare";

// Redirections 301 centralisées — voir src/lib/seo-redirects.data.cjs
// (format CommonJS — next.config.js n'est pas .ts, on ne peut pas require du .ts).
// Côté TS/tests, passer par src/lib/seo-redirects.ts qui re-exporte typé.
const { SEO_REDIRECTS } = require("./src/lib/seo-redirects.data.cjs");

// Widget « La vanne du jour » (s22) : empreinte du script en ligne de /embed/vanne-du-jour
// (même source que la route, voir src/lib/widget/embed-script.data.cjs).
const { EMBED_INLINE_SCRIPT } = require("./src/lib/widget/embed-script.data.cjs");
const EMBED_SCRIPT_HASH = require("crypto").createHash("sha256").update(EMBED_INLINE_SCRIPT, "utf8").digest("base64");

// CSP du site (s11, s16). Si un nouveau tiers est ajouté (Sentry, Datadog RUM…),
// mettre à jour connect-src ET script-src en même temps.
const SITE_FRAME_SRC = "https://www.youtube-nocookie.com https://checkout.stripe.com https://js.stripe.com";
const siteCsp = (frameSrc) =>
  `default-src 'self'; script-src 'self' 'unsafe-inline' https://cloud.umami.is https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-src ${frameSrc}; object-src 'none'; base-uri 'self'`;
// s22 : page d'iframe encadrable partout, rien d'autre ne se charge (un script par empreinte).
const EMBED_CSP = `default-src 'none'; script-src 'sha256-${EMBED_SCRIPT_HASH}'; style-src 'unsafe-inline'; img-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors *`;
// En-têtes communs à toutes les routes, hors X-Frame-Options et CSP.
const COMMON_SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS réactivé à la bascule Cloudflare (s14) : Replit / Google Frontend
  // l'injectait en amont, Cloudflare Workers non. 6 mois, volontairement
  // SANS includeSubDomains ni preload (choix Thomas, réversible).
  { key: "Strict-Transport-Security", value: "max-age=15552000" },
];

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
    // s11 : le helper de test a été sorti de social-analytics/route.ts → le
    // build échoue désormais sur toute erreur de type (plus d'erreurs masquées).
    ignoreBuildErrors: false,
  },
  experimental: {
    instrumentationHook: true,
    // Build Cloudflare uniquement : OpenNext ne réécrit vers la variante
    // `workerd` (client Prisma WebAssembly + driver adapter) que les paquets
    // listés ici explicitement. Sans effet sur Replit (clé absente).
    ...(isCloudflareBuild
      ? { serverComponentsExternalPackages: ["@prisma/client", ".prisma/client"] }
      : {}),
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

      // Cloudflare Workers : binaire natif resvg et SDK Replit inutilisables
      // sous workerd → modules vides (false), jamais appelés sous Workers
      // (image-generator bascule sur next/og, image-storage sur R2).
      if (isCloudflareBuild) {
        externalModules.delete("@resvg/resvg-js");
        externalModules.delete("@replit/object-storage");
        config.resolve = config.resolve || {};
        config.resolve.alias = {
          ...(config.resolve.alias || {}),
          "@resvg/resvg-js": false,
          "@replit/object-storage": false,
        };
      }

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
              // s22 : toutes les routes SAUF /embed/vanne-du-jour (page d'iframe du widget, règle
              // dédiée plus bas, sans X-Frame-Options DENY). Ordre et valeurs inchangés.
              source: "/((?!embed/vanne-du-jour$).*)",
              headers: [
                COMMON_SECURITY_HEADERS[0],
                { key: "X-Frame-Options", value: "DENY" },
                ...COMMON_SECURITY_HEADERS.slice(1),
                // CSP prod — s11 : retrait de 'unsafe-eval' (Next 14 prod n'en
                // a pas besoin ; Umami et Stripe.js n'utilisent pas eval).
                // 'unsafe-inline' reste requis pour les scripts d'hydratation
                // Next et pour Stripe.js. Ajouté explicitement js.stripe.com.
                { key: "Content-Security-Policy", value: siteCsp(SITE_FRAME_SRC) },
              ],
            },
            // s22 : page d'iframe du widget, encadrable par n'importe quel site
            // (`frame-ancestors *`, pas de X-Frame-Options), jamais indexée.
            {
              source: "/embed/vanne-du-jour",
              headers: [
                ...COMMON_SECURITY_HEADERS,
                { key: "Content-Security-Policy", value: EMBED_CSP },
                { key: "X-Robots-Tag", value: "noindex" },
              ],
            },
            // s22 : page du programme, aperçu réel du widget en iframe (même origine).
            // Seule différence avec la CSP du site : 'self' en frame-src.
            {
              source: "/integrer-la-vanne-du-jour",
              headers: [{ key: "Content-Security-Policy", value: siteCsp(`'self' ${SITE_FRAME_SRC}`) }],
            },
            // s21 (@legal L5) : pages de la lettre portant un jeton dans l'URL, jamais
            // transmis en Referer à un autre site (entrée placée après la règle
            // générale : elle l'emporte). `same-origin` et non `no-referrer` (QA s21
            // B1) : sous `no-referrer`, le navigateur envoie `Origin: null` sur le POST
            // du bouton « Confirmer mon adresse », que le contrôle d'origine refusait.
            {
              source: "/lettre/:path*",
              headers: [{ key: "Referrer-Policy", value: "same-origin" }],
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
