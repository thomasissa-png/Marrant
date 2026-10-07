import type { MetadataRoute } from "next";
import { getParcoursSitemapDates } from "@/lib/sitemap-parcours";
import { blogArticles } from "@/lib/blog-articles";
import { REDIRECTED_BLOG_SLUGS, UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import { getCatalogueSitemapEntries } from "@/lib/sitemap-catalogue";
import { VANNES_THEMES, vannesThemePath } from "@/lib/vannes-themes";
import { publicUpdatedAt, visibleBlogArticleWhere } from "@/lib/blog-visibility";

export const revalidate = 3600;

/** Refonte copy + metadata s11 des pages éditoriales (home, catalogues, parcours, ressources). */
const STRUCTURAL_PAGES_LASTMOD = "2026-09-29";
/** Dernière modification du texte des pages légales. */
const LEGAL_PAGES_LASTMOD = "2026-05-06";
/** Politique de confidentialité : phrases P1 à P8 de l'avis @legal s17 (parcours). */
const CONFIDENTIALITE_LASTMOD = "2026-10-07";
/** Mise en ligne des pages thème /vannes/theme/<slug> (lot S3b s14). */
const THEME_PAGES_LASTMOD = "2026-09-30";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://deviens-marrant.fr";

  // lastModified doit etre stable — Bing penalise les dates qui changent a chaque crawl.
  // Pages structurelles : date REELLE de derniere modification du contenu
  // (constante versionnee, a mettre a jour quand le texte d'une page change),
  // et non plus BUILD_DATE qui bougeait a chaque deploiement sans changement de
  // contenu (passe SEO finale s11). Contenu dynamique : date DB reelle.
  const lastDeploy = new Date(STRUCTURAL_PAGES_LASTMOD);
  const legalLastMod = new Date(LEGAL_PAGES_LASTMOD);
  const parcoursDates = await getParcoursSitemapDates();

  // Pour les pages a contenu quotidien, on query la date du dernier DailyContent
  let lastContentDate = lastDeploy;
  try {
    const { prisma } = await import("@/lib/prisma");
    const lastDaily = await prisma.dailyContent.findFirst({
      orderBy: { date: "desc" },
      select: { date: true },
    });
    if (lastDaily?.date) lastContentDate = lastDaily.date;
  } catch {
    // DB pas dispo — fallback sur lastDeploy
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: lastContentDate, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/vannes`, lastModified: lastContentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/conseils`, lastModified: lastContentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/videos`, lastModified: lastContentDate, changeFrequency: "weekly", priority: 0.8 },
    // s17 (SEO-07) : dates réelles des parcours (constante du code ou base, la plus récente).
    { url: `${baseUrl}/parcours`, lastModified: parcoursDates.hub, changeFrequency: "weekly", priority: 0.8 },
    ...(["machine-a-cafe", "repartie", "confiance"] as const).map((slug) => ({
      url: `${baseUrl}/parcours/${slug}`,
      lastModified: parcoursDates.bySlug[slug] ?? parcoursDates.hub,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/blog`, lastModified: lastContentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/abonnement`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/glossaire`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/a-propos`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/mentions-legales`, lastModified: legalLastMod, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/cgu`, lastModified: legalLastMod, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/confidentialite`, lastModified: new Date(CONFIDENTIALITE_LASTMOD), changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/retractation`, lastModified: legalLastMod, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/quiz-humour`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/anatomie-vanne`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.7 },
    // Landings s14 (lots S3a et S3b).
    { url: `${baseUrl}/blague-du-jour`, lastModified: lastContentDate, changeFrequency: "daily", priority: 0.8 },
    ...VANNES_THEMES.map((theme) => ({
      url: `${baseUrl}${vannesThemePath(theme.slug)}`,
      lastModified: new Date(THEME_PAGES_LASTMOD),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // Articles statiques — exclure les slugs dépubliés (cannibalisation s11) ;
  // lastModified = vraie date de modif si dispo, sinon date de publication
  // (évite d'écraser des lastmod réels par une date de build — pénalité Bing).
  const staticBlogRoutes: MetadataRoute.Sitemap = blogArticles
    .filter((article) => !UNPUBLISHED_STATIC_SLUGS.has(article.slug) && !REDIRECTED_BLOG_SLUGS.includes(article.slug))
    .map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // Articles dynamiques depuis la DB
  let dbBlogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import("@/lib/prisma");
    const dbArticles = await prisma.blogArticle.findMany({
      where: { ...visibleBlogArticleWhere(), slug: { notIn: [...REDIRECTED_BLOG_SLUGS] } },
      select: { slug: true, publishedAt: true, updatedAt: true },
    });
    dbBlogRoutes = dbArticles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: publicUpdatedAt(article) || article.publishedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Table pas encore migrée
  }

  // Pages individuelles du catalogue (vannes, conseils, vidéos) — S11-lot5.
  // Isolé dans son propre helper pour minimiser les conflits de merge.
  const catalogueRoutes = await getCatalogueSitemapEntries();

  // Dédupliquer par URL
  const allRoutes = [...staticRoutes, ...staticBlogRoutes, ...dbBlogRoutes, ...catalogueRoutes];
  const seen = new Set<string>();
  return allRoutes.filter((route) => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}
