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
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/onboarding", "/profil", "/favoris"],
      },
      {
        userAgent: "msnbot",
        allow: "/",
      },
      {
        userAgent: "SemrushBot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "AhrefsBot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // LLM bots — explicitement autorisés (GEO)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
    ],
    sitemap: "https://deviens-marrant.fr/sitemap.xml",
  };
}
