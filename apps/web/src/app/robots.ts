import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallowedPrivate = [
    "/api/",
    "/admin/",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/onboarding",
    "/profil",
    "/favoris",
    // Audit Ahrefs 07/10/2026 : ~950 variantes /register?callbackUrl=… (noindex)
    // et /abonnement?returnTo=… crawlées ; /abonnement nu reste explorable.
    "/register",
    "/abonnement?",
  ];
  // s22 : l'API publique du widget est explorable (annuaires d'API) ; elle reste noindex par en-tête.
  const allowed = ["/", "/api/widget/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: allowed,
        disallow: disallowedPrivate,
      },
      // Un groupe User-agent spécifique REMPLACE le groupe "*" pour ce bot :
      // chaque groupe doit donc répéter les pages privées (sinon bingbot,
      // msnbot et les bots LLM pouvaient crawler /api/, /login, /profil…).
      { userAgent: "bingbot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "msnbot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "SemrushBot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "AhrefsBot", allow: allowed, disallow: disallowedPrivate },
      // LLM bots — explicitement autorisés (GEO), hors pages privées.
      // Bots de RECHERCHE / consultation (sans eux : pas de citation dans les
      // réponses) : OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User,
      // PerplexityBot, Perplexity-User. Bots d'ENTRAÎNEMENT (choix business,
      // autorisés à ce jour) : GPTBot, ClaudeBot, Google-Extended, CCBot…
      // Liste vérifiée le 29/09/2026 (docs OpenAI + Anthropic).
      { userAgent: "OAI-SearchBot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "GPTBot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "ChatGPT-User", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "Google-Extended", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "PerplexityBot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "Perplexity-User", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "Claude-SearchBot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "Claude-User", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "ClaudeBot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "anthropic-ai", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "Bytespider", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "CCBot", allow: allowed, disallow: disallowedPrivate },
      { userAgent: "cohere-ai", allow: allowed, disallow: disallowedPrivate },
    ],
    sitemap: "https://deviens-marrant.fr/sitemap.xml",
  };
}
