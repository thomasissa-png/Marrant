import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog-articles";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://deviens-marrant.fr";

  // Pages dynamiques : lastModified = maintenant (contenu frais quotidien)
  // Pages statiques : lastModified = date fixe (évite signal trompeur pour Bing)
  const now = new Date();
  const lastDeploy = new Date("2026-03-18");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/vannes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/conseils`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/videos`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/parcours`, lastModified: lastDeploy, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/parcours/machine-a-cafe`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/parcours/repartie`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/parcours/confiance`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/abonnement`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/glossaire`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/a-propos`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/mentions-legales`, lastModified: lastDeploy, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/cgu`, lastModified: lastDeploy, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/confidentialite`, lastModified: lastDeploy, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/retractation`, lastModified: lastDeploy, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/register`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Articles statiques
  const staticBlogRoutes: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Articles dynamiques depuis la DB
  let dbBlogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import("@/lib/prisma");
    const dbArticles = await prisma.blogArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, publishedAt: true, updatedAt: true },
    });
    dbBlogRoutes = dbArticles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Table pas encore migrée
  }

  // Dédupliquer par URL
  const allRoutes = [...staticRoutes, ...staticBlogRoutes, ...dbBlogRoutes];
  const seen = new Set<string>();
  return allRoutes.filter((route) => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}
