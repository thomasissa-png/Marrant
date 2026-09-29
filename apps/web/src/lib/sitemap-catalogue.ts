import type { MetadataRoute } from "next";
import { buildJokeSlug, buildTipSlug, buildVideoSlug } from "@/lib/catalogue-slug";

const BASE_URL = "https://deviens-marrant.fr";

/**
 * Retourne toutes les entrées sitemap pour les pages individuelles du catalogue.
 * Ce fichier est appelé depuis src/app/sitemap.ts. Isolé pour minimiser les
 * conflits de merge avec les autres évolutions du sitemap (lastmod réels, etc.).
 *
 * Les contenus inactifs (isActive=false) sont exclus.
 * Si la DB n'est pas disponible (ex: build hors ligne), retourne un tableau vide.
 */
export async function getCatalogueSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { prisma } = await import("@/lib/prisma");

    const [jokes, tips, videos] = await Promise.all([
      prisma.joke.findMany({
        where: { isActive: true },
        select: { id: true, content: true, updatedAt: true },
      }),
      prisma.tip.findMany({
        where: { isActive: true },
        select: { id: true, title: true, updatedAt: true },
      }),
      prisma.video.findMany({
        where: { isActive: true },
        select: { id: true, title: true, updatedAt: true },
      }),
    ]);

    const entries: MetadataRoute.Sitemap = [];

    for (const j of jokes) {
      entries.push({
        url: `${BASE_URL}/vannes/${buildJokeSlug(j)}`,
        lastModified: j.updatedAt ?? new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
    for (const t of tips) {
      entries.push({
        url: `${BASE_URL}/conseils/${buildTipSlug(t)}`,
        lastModified: t.updatedAt ?? new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
    for (const v of videos) {
      entries.push({
        url: `${BASE_URL}/videos/${buildVideoSlug(v)}`,
        lastModified: v.updatedAt ?? new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      });
    }

    return entries;
  } catch {
    // DB indisponible (build sans Postgres) — fallback vide, la revalidation ISR
    // du sitemap régénère les entrées quand la DB revient.
    return [];
  }
}
