/**
 * Vérification des liens internes d'un article à importer : chaque chemin doit
 * mener à une page qui existe (et qui existera à la date de publication).
 *
 * Sources :
 *  - routes statiques : scan de src/app (page.tsx, groupes de routes retirés) ;
 *  - /blog/<slug> : blog-articles.ts (hors dépubliés et redirigés) puis base ;
 *  - /vannes/theme/<slug> : lib/vannes-themes ;
 *  - /parcours/<slug>, /vannes|conseils|videos/<slug> : base uniquement.
 * Sans base (dry-run hors ligne) : ces derniers sont « non vérifiés ».
 * Une URL qui redirige (seo-redirects) est refusée : lier la destination.
 */
import fs from "node:fs";
import path from "node:path";
import { blogArticles } from "@/lib/blog-articles";
import { SEO_REDIRECTS, UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import { VANNES_THEMES } from "@/lib/vannes-themes";
import { startOfIsoWeekUtc } from "./article-markdown";

export type LinkStatus = { path: string; status: "ok" | "missing" | "unverified"; reason: string };
export type CatalogueKind = "vannes" | "conseils" | "videos";

/** Accès base en lecture seule (implémenté par le CLI via l'API HTTP Neon). */
export interface LinkDb {
  blogArticle(slug: string): Promise<{ isPublished: boolean; publishedAt: Date | null } | null>;
  learningPathActive(slug: string): Promise<boolean>;
  catalogueExists(kind: CatalogueKind, slug: string): Promise<boolean>;
}

export interface LinkContext {
  staticRoutes: Set<string>;
  dynamicRoutes: string[];
  redirects: Map<string, string>;
  staticBlogSlugs: Set<string>;
  themeSlugs: Set<string>;
  /** Date de publication de l'article importé. */
  publishedAt: Date;
  now: Date;
  db?: LinkDb;
}

/** Routes de pages de src/app : statiques (« /blog ») et dynamiques (« /blog/[slug] »). */
export function scanAppRoutes(appDir: string): { staticRoutes: Set<string>; dynamicRoutes: string[] } {
  const staticRoutes = new Set<string>();
  const dynamicRoutes: string[] = [];
  const walk = (dir: string, segments: string[]) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith("_") || entry.name.startsWith("@")) continue; // privés, slots
        const isGroup = /^\(.*\)$/.test(entry.name);
        walk(path.join(dir, entry.name), isGroup ? segments : [...segments, entry.name]);
      } else if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
        const route = `/${segments.join("/")}`;
        if (route.includes("[")) dynamicRoutes.push(route);
        else staticRoutes.add(route);
      }
    }
  };
  walk(appDir, []);
  return { staticRoutes, dynamicRoutes: dynamicRoutes.sort() };
}

export function buildLinkContext(appDir: string, publishedAt: Date, now: Date, db?: LinkDb): LinkContext {
  const redirects = new Map(SEO_REDIRECTS.map((r) => [r.source, r.destination] as [string, string]));
  const staticBlogSlugs = new Set(
    blogArticles
      .map((a) => a.slug)
      .filter((slug) => !UNPUBLISHED_STATIC_SLUGS.has(slug) && !redirects.has(`/blog/${slug}`)),
  );
  return {
    ...scanAppRoutes(appDir),
    redirects,
    staticBlogSlugs,
    themeSlugs: new Set(VANNES_THEMES.map((t) => t.slug)),
    publishedAt,
    now,
    db,
  };
}

/** Tous les slugs pris côté code : articles statiques (même dépubliés) + sources de redirection /blog/. */
export function slugsTakenInCode(): Set<string> {
  const taken = new Set(blogArticles.map((a) => a.slug));
  for (const r of SEO_REDIRECTS) if (r.source.startsWith("/blog/")) taken.add(r.source.slice("/blog/".length));
  return taken;
}

const ok = (p: string, reason: string): LinkStatus => ({ path: p, status: "ok", reason });
const missing = (p: string, reason: string): LinkStatus => ({ path: p, status: "missing", reason });
const unverified = (p: string, reason: string): LinkStatus => ({ path: p, status: "unverified", reason });

export async function checkInternalLink(p: string, ctx: LinkContext): Promise<LinkStatus> {
  const redirect = ctx.redirects.get(p);
  if (redirect) return missing(p, `redirige vers ${redirect} : lier directement la destination`);
  if (ctx.staticRoutes.has(p)) return ok(p, "page du site");

  const parts = p.split("/").filter(Boolean);
  const [section, second, third] = parts;

  if (section === "blog" && parts.length === 2) {
    if (ctx.staticBlogSlugs.has(second)) return ok(p, "article de blog-articles.ts");
    if (!ctx.db) return unverified(p, "article absent de blog-articles.ts, base non consultée");
    const row = await ctx.db.blogArticle(second);
    if (!row) return missing(p, "article inexistant (code et base)");
    if (row.isPublished) return ok(p, "article publié en base");
    // Planifié (semaine en cours ou après, cf. publishDueScheduledArticles) et publié avant celui-ci.
    const weekStart = startOfIsoWeekUtc(ctx.now).getTime();
    if (row.publishedAt && row.publishedAt.getTime() >= weekStart && row.publishedAt.getTime() <= ctx.publishedAt.getTime()) {
      return ok(p, `article planifié le ${row.publishedAt.toISOString().slice(0, 10)}, avant celui-ci`);
    }
    return missing(p, "article en base non publié (retiré, ou planifié après celui-ci)");
  }
  if (section === "vannes" && second === "theme" && parts.length === 3) {
    return ctx.themeSlugs.has(third) ? ok(p, "thème de vannes") : missing(p, "thème de vannes inconnu");
  }
  if (section === "parcours" && parts.length === 2) {
    if (!ctx.db) return unverified(p, "parcours : base non consultée");
    return (await ctx.db.learningPathActive(second)) ? ok(p, "parcours actif en base") : missing(p, "parcours inexistant ou inactif");
  }
  if ((section === "vannes" || section === "conseils" || section === "videos") && parts.length === 2) {
    if (!ctx.db) return unverified(p, "fiche catalogue : base non consultée");
    return (await ctx.db.catalogueExists(section, second))
      ? ok(p, "fiche catalogue active")
      : missing(p, "fiche catalogue introuvable (slug canonique attendu)");
  }
  const pattern = ctx.dynamicRoutes.find((r) => r.split("/").length === p.split("/").length && r.startsWith(`/${section}/`));
  if (pattern) return unverified(p, `route dynamique ${pattern} sans vérificateur`);
  return missing(p, "aucune page à cette adresse");
}

export async function checkInternalLinks(paths: string[], ctx: LinkContext): Promise<LinkStatus[]> {
  const results: LinkStatus[] = [];
  for (const p of paths) results.push(await checkInternalLink(p, ctx));
  return results;
}
