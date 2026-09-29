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
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPrivate,
      },
      // Un groupe User-agent spécifique REMPLACE le groupe "*" pour ce bot :
      // chaque groupe doit donc répéter les pages privées (sinon bingbot,
      // msnbot et les bots LLM pouvaient crawler /api/, /login, /profil…).
      { userAgent: "bingbot", allow: "/", disallow: disallowedPrivate },
      { userAgent: "msnbot", allow: "/", disallow: disallowedPrivate },
      { userAgent: "SemrushBot", allow: "/", disallow: disallowedPrivate },
      { userAgent: "AhrefsBot", allow: "/", disallow: disallowedPrivate },
      // LLM bots — explicitement autorisés (GEO), hors pages privées
      { userAgent: "GPTBot", allow: "/", disallow: disallowedPrivate },
      { userAgent: "ChatGPT-User", allow: "/", disallow: disallowedPrivate },
      { userAgent: "Google-Extended", allow: "/", disallow: disallowedPrivate },
      { userAgent: "PerplexityBot", allow: "/", disallow: disallowedPrivate },
      { userAgent: "ClaudeBot", allow: "/", disallow: disallowedPrivate },
      { userAgent: "anthropic-ai", allow: "/", disallow: disallowedPrivate },
      { userAgent: "Bytespider", allow: "/", disallow: disallowedPrivate },
      { userAgent: "CCBot", allow: "/", disallow: disallowedPrivate },
      { userAgent: "cohere-ai", allow: "/", disallow: disallowedPrivate },
    ],
    sitemap: "https://deviens-marrant.fr/sitemap.xml",
  };
}
