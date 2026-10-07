/**
 * `lastmod` réels des pages parcours dans le sitemap (SEO-07, s17 lot C).
 *
 * Date = la plus récente entre :
 * - `PARCOURS_PAGES_LASTMOD` : dernière modification du texte ou de la
 *   structure des pages parcours dans le code (constante versionnée, stable :
 *   Bing pénalise les dates qui bougent à chaque exploration) ;
 * - la base : `LearningPath.updatedAt` et `Tip.updatedAt` des conseils de ses étapes.
 * `/parcours` prend la plus récente des 3. Base indisponible : la constante seule.
 */
export const PARCOURS_PAGES_LASTMOD = "2026-10-07";

export interface ParcoursSitemapDates {
  hub: Date;
  bySlug: Record<string, Date>;
}

interface PathRow {
  slug: string;
  updatedAt: Date;
  steps: { tip: { updatedAt: Date } | null }[];
}

export function computeParcoursDates(rows: readonly PathRow[], base: Date): ParcoursSitemapDates {
  const bySlug: Record<string, Date> = {};
  let hub = base;
  for (const row of rows) {
    let latest = base;
    for (const d of [row.updatedAt, ...row.steps.map((s) => s.tip?.updatedAt)]) {
      if (d instanceof Date && !Number.isNaN(d.getTime()) && d > latest) latest = d;
    }
    bySlug[row.slug] = latest;
    if (latest > hub) hub = latest;
  }
  return { hub, bySlug };
}

export async function getParcoursSitemapDates(): Promise<ParcoursSitemapDates> {
  const base = new Date(PARCOURS_PAGES_LASTMOD);
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.learningPath.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true, steps: { select: { tip: { select: { updatedAt: true } } } } },
    });
    return computeParcoursDates(rows, base);
  } catch {
    return { hub: base, bySlug: {} };
  }
}
