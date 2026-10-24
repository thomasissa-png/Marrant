import type { MetadataRoute } from "next";
import { getParcoursSitemapDates } from "@/lib/sitemap-parcours";
import { PARCOURS_SLUGS } from "@/lib/entrees-parcours";
import { blogArticles } from "@/lib/blog-articles";
import { REDIRECTED_BLOG_SLUGS, UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import { getCatalogueSitemapEntries } from "@/lib/sitemap-catalogue";
import { VANNES_THEMES, vannesThemePath } from "@/lib/vannes-themes";
import { publicUpdatedAt, visibleBlogArticleWhere } from "@/lib/blog-visibility";
import { WIDGET_PROGRAMME_LASTMOD, WIDGET_PROGRAMME_PATH, WIDGET_VANNE_DU_JOUR_PUBLIE } from "@/config/widget-vanne-du-jour";
import { blogIndexLastMod, capLastModToToday, startOfTomorrowUtc, type BlogDateCandidate } from "@/lib/sitemap-lastmod";

export const revalidate = 3600;

/** Pages éditoriales (home, catalogues, ressources) : textes s21 (abonnement, glossaire, à propos, quiz). */
const STRUCTURAL_PAGES_LASTMOD = "2026-10-18";
/** Dernière modification du texte des pages légales. */
const LEGAL_PAGES_LASTMOD = "2026-05-06";
/** Politique de confidentialité : section 8 « La lettre » (s21). */
const CONFIDENTIALITE_LASTMOD = "2026-10-17";
/** CGU : version du 17/10/2026 (s21), date affichée sur la page. */
const CGU_LASTMOD = "2026-10-17";
/** Mise en ligne des pages thème /vannes/theme/<slug> (lot S3b s14). */
const THEME_PAGES_LASTMOD = "2026-09-30";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://deviens-marrant.fr";
  const now = new Date();

  // lastModified doit etre stable — Bing penalise les dates qui changent a chaque crawl.
  // Pages structurelles : date REELLE de derniere modification du contenu
  // (constante versionnee, a mettre a jour quand le texte d'une page change),
  // et non plus BUILD_DATE qui bougeait a chaque deploiement sans changement de
  // contenu (passe SEO finale s11). Contenu dynamique : date DB reelle.
  const lastDeploy = new Date(STRUCTURAL_PAGES_LASTMOD);
  const legalLastMod = new Date(LEGAL_PAGES_LASTMOD);
  const parcoursDates = await getParcoursSitemapDates();

  // Pour les pages a contenu quotidien, on query la date du dernier DailyContent.
  // s20 (S5) : borne haute = aujourd'hui (UTC). Le contenu du jour est préparé à
  // l'avance (jusqu'au 31/12) : sans borne, 6 URL annonçaient une date future.
  let lastContentDate = lastDeploy;
  try {
    const { prisma } = await import("@/lib/prisma");
    const lastDaily = await prisma.dailyContent.findFirst({
      where: { date: { lt: startOfTomorrowUtc(now) } },
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
    // s18/s19 : parcours publiés seulement (Storytelling quand STORYTELLING_PUBLIE, Boulot quand BOULOT_PUBLIE).
    ...PARCOURS_SLUGS.map((slug) => ({
      url: `${baseUrl}/parcours/${slug}`,
      lastModified: parcoursDates.bySlug[slug] ?? parcoursDates.hub,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // s20 (S5) : date du dernier article visible, plus la vanne du jour (calculée plus bas).
    { url: `${baseUrl}/blog`, lastModified: lastDeploy, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/abonnement`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/glossaire`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/a-propos`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/mentions-legales`, lastModified: legalLastMod, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/cgu`, lastModified: new Date(CGU_LASTMOD), changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/confidentialite`, lastModified: new Date(CONFIDENTIALITE_LASTMOD), changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/retractation`, lastModified: legalLastMod, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/quiz-humour`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/anatomie-vanne`, lastModified: lastDeploy, changeFrequency: "monthly", priority: 0.7 },
    // Landings s14 (lots S3a et S3b).
    { url: `${baseUrl}/blague-du-jour`, lastModified: lastContentDate, changeFrequency: "daily", priority: 0.8 },
    // s22 : page du programme du widget, seulement une fois publiée (go de Thomas).
    ...(WIDGET_VANNE_DU_JOUR_PUBLIE
      ? [{ url: `${baseUrl}${WIDGET_PROGRAMME_PATH}`, lastModified: new Date(WIDGET_PROGRAMME_LASTMOD), changeFrequency: "monthly" as const, priority: 0.6 }]
      : []),
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
  const publishedStaticArticles = blogArticles.filter(
    (article) => !UNPUBLISHED_STATIC_SLUGS.has(article.slug) && !REDIRECTED_BLOG_SLUGS.includes(article.slug),
  );
  const blogDateCandidates: BlogDateCandidate[] = publishedStaticArticles.map((article) => ({
    publishedAt: new Date(article.date),
    lastModified: new Date(article.updatedAt || article.date),
  }));
  const staticBlogRoutes: MetadataRoute.Sitemap = publishedStaticArticles
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
    for (const article of dbArticles) {
      // Article sans date de publication (anciens) : jamais « le plus récent ».
      if (article.publishedAt) {
        blogDateCandidates.push({
          publishedAt: article.publishedAt,
          lastModified: publicUpdatedAt(article) || article.publishedAt,
        });
      }
    }
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

  // s20 (S5) : /blog = date du dernier article visible (repli : pages structurelles).
  const blogLastMod = blogIndexLastMod(blogDateCandidates, now, lastDeploy);
  const routesWithBlogDate = staticRoutes.map((route) =>
    route.url === `${baseUrl}/blog` ? { ...route, lastModified: blogLastMod } : route,
  );

  // Dédupliquer par URL ; garde-fou S5 : aucun lastmod postérieur à aujourd'hui (UTC).
  // Les dates passées (fiches, articles) ne sont pas touchées.
  const allRoutes = [...routesWithBlogDate, ...staticBlogRoutes, ...dbBlogRoutes, ...catalogueRoutes];
  const seen = new Set<string>();
  return allRoutes
    .filter((route) => {
      if (seen.has(route.url)) return false;
      seen.add(route.url);
      return true;
    })
    .map((route) => ({ ...route, lastModified: capLastModToToday(route.lastModified, now) }));
}
