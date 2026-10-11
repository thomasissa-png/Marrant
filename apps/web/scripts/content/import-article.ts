/**
 * Import d'un article préparé (docs/copy/articles-q4/*.md) dans BlogArticle,
 * NON publié, avec `publishedAt` = date prévue. La publication programmée
 * (lib/scheduler/prepared-content, tick 15 min) le rend visible à cette heure.
 *
 * Lancement (depuis apps/web) :
 *   npx tsx scripts/content/import-article.ts <fichier.md>            # DRY-RUN (défaut) : affiche la ligne, n'écrit rien
 *   npx tsx scripts/content/import-article.ts <fichier.md> --write    # insère en base
 *   npx tsx scripts/content/import-article.ts <fichier.md> --update            # DRY-RUN : diff des champs qui changeraient
 *   npx tsx scripts/content/import-article.ts <fichier.md> --update --write    # corrige un article programmé
 *
 * Options :
 *   --write         Écrit en base (sinon dry-run, lecture seule).
 *   --heure-utc=N   Heure UTC de publication (défaut 5 : 7 h Paris l'été, 6 h l'hiver).
 *   --offline       Dry-run sans base (slug et liens base non vérifiés).
 *   --full          Affiche le contenu complet (sinon un extrait).
 *   --update        Corrige un article PROGRAMMÉ déjà en base (même slug) au lieu d'insérer :
 *                   permis seulement si la ligne existe avec isPublished = false et une
 *                   publishedAt de la semaine en cours ou après (un article retiré, dépublié
 *                   avant cette semaine, est refusé ; un article publié n'est JAMAIS modifié,
 *                   y compris s'il est publié entre le contrôle et l'écriture). Met à jour
 *                   title, excerpt, content (FAQ finale incluse), category, readingTime,
 *                   metaTitle, metaDescription, publishedAt et updatedAt. Mêmes contrôles
 *                   que l'import. Sans --write : affiche le diff des champs, n'écrit rien.
 *
 * Base : NEON_DATABASE_URL (ou DATABASE_URL), URL Neon ; accès par l'API SQL
 * HTTPS de Neon via curl (même méthode que scripts/infra/copie-replit-neon.py,
 * aucune connexion TCP Postgres nécessaire).
 *
 * Refus (code 1) : slug déjà pris (base sans --update, blog-articles.ts, redirections),
 * --update sur un article absent, publié ou retiré,
 * tiret cadratin, lien interne vers une URL inexistante ou qui redirige,
 * date antérieure à la semaine en cours, catégorie inconnue, FAQ non conforme.
 */
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { buildJokeSlug, buildTipSlug, buildVideoSlug, parseShortIdFromSlug } from "@/lib/catalogue-slug";
import {
  DEFAULT_PUBLISH_HOUR_UTC,
  parseArticleMarkdown,
  publishedAtFor,
  startOfIsoWeekUtc,
  toBlogArticleRow,
  validateArticle,
  type BlogArticleRow,
} from "./article-markdown";
import { buildLinkContext, checkInternalLinks, slugsTakenInCode, type LinkDb, type LinkStatus } from "./article-links";

const APP_DIR = path.resolve(__dirname, "../../src/app");

type Row = Record<string, unknown>;
export type SqlQuery = (sql: string, params?: unknown[]) => Promise<Row[]>;

/** API SQL HTTPS de Neon (POST https://<host>/sql). */
export function neonHttpQuery(url: string): SqlQuery {
  const host = url.split("@")[1]?.split("/")[0]?.split("?")[0];
  if (!host || !host.includes("neon.tech")) throw new Error("NEON_DATABASE_URL doit être une URL Neon (…neon.tech).");
  return async (sql, params = []) => {
    const out = execFileSync(
      "curl",
      ["-sS", "--max-time", "20", "-X", "POST", `https://${host}/sql`, "-H", `Neon-Connection-String: ${url}`,
        "-H", "Content-Type: application/json", "--data-binary", "@-"],
      { input: JSON.stringify({ query: sql, params }), encoding: "utf-8" },
    );
    const res = JSON.parse(out) as { rows?: Row[]; message?: string };
    if (!res.rows) throw new Error(`Erreur SQL (${sql.slice(0, 60)}…) : ${res.message ?? out.slice(0, 200)}`);
    return res.rows;
  };
}

/** Colonne `timestamp` (sans fuseau, stockée en UTC) renvoyée par l'API Neon : « 2026-10-05 05:00:00 ». */
export function parseDbTimestamp(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return value;
  return new Date(String(value).replace(" ", "T").replace(/Z?$/, "Z"));
}

export function sqlLinkDb(q: SqlQuery): LinkDb {
  const catalogue = {
    vannes: { table: "Joke", text: "content", build: (r: Row) => buildJokeSlug({ id: String(r.id), content: String(r.text) }) },
    conseils: { table: "Tip", text: "title", build: (r: Row) => buildTipSlug({ id: String(r.id), title: String(r.text) }) },
    videos: { table: "Video", text: "title", build: (r: Row) => buildVideoSlug({ id: String(r.id), title: String(r.text) }) },
  } as const;
  return {
    async blogArticle(slug) {
      const [row] = await q(`select "isPublished", "publishedAt" from "BlogArticle" where slug = $1`, [slug]);
      if (!row) return null;
      return { isPublished: row.isPublished === true, publishedAt: parseDbTimestamp(row.publishedAt) };
    },
    async learningPathActive(slug) {
      return (await q(`select 1 from "LearningPath" where slug = $1 and "isActive" = true`, [slug])).length > 0;
    },
    async catalogueExists(kind, slug) {
      const shortId = parseShortIdFromSlug(slug);
      if (!shortId) return false;
      const c = catalogue[kind];
      const rows = await q(`select id, "${c.text}" as text from "${c.table}" where "isActive" = true and id like $1`, [`${shortId}%`]);
      return rows.some((r) => c.build(r) === slug);
    },
  };
}

/** Champs réécrits par --update (la FAQ vit dans `content` ; `updatedAt` est posé par la requête). */
export const UPDATE_FIELDS = [
  "title", "excerpt", "content", "category", "readingTime", "metaTitle", "metaDescription", "publishedAt",
] as const;
export type UpdateField = (typeof UPDATE_FIELDS)[number];
export type FieldChange = { field: UpdateField; before: string | null; after: string | null };

export interface PreparedImport {
  row: BlogArticleRow;
  faqCount: number;
  links: LinkStatus[];
  errors: string[];
  warnings: string[];
  /** --update avec la base : champs qui changeraient (vide = article déjà à jour). */
  changes?: FieldChange[];
}

function normalizeField(field: UpdateField, value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (field === "publishedAt") return parseDbTimestamp(value)?.toISOString() ?? null;
  return String(value);
}

export function diffFields(existing: Row, row: BlogArticleRow): FieldChange[] {
  return UPDATE_FIELDS.map((field) => ({
    field,
    before: normalizeField(field, existing[field]),
    after: normalizeField(field, row[field]),
  })).filter((c) => c.before !== c.after);
}

/** Erreur si la ligne existante ne peut pas être corrigée par --update, sinon null. */
export function updateRefusal(slug: string, existing: Row | undefined, now: Date): string | null {
  if (!existing) return `--update : article « ${slug} » absent de la base (importer sans --update).`;
  if (existing.isPublished === true) {
    return `--update : article « ${slug} » déjà publié, modification refusée (corriger un article publié hors de ce script).`;
  }
  const current = parseDbTimestamp(existing.publishedAt);
  if (!current || current.getTime() < startOfIsoWeekUtc(now).getTime()) {
    return `--update : article « ${slug} » non publié mais pas programmé (publishedAt ${current ? current.toISOString() : "vide"}, article retiré ?), modification refusée.`;
  }
  return null;
}

export async function prepareImport(
  markdown: string,
  opts: { now: Date; hourUtc?: number; q?: SqlQuery; strictLinks?: boolean; update?: boolean },
): Promise<PreparedImport> {
  const article = parseArticleMarkdown(markdown);
  const publishedAt = publishedAtFor(article.publishDate, opts.hourUtc ?? DEFAULT_PUBLISH_HOUR_UTC);
  const { errors, warnings } = validateArticle(article, publishedAt, opts.now);
  const row = toBlogArticleRow(article, publishedAt);
  let changes: FieldChange[] | undefined;

  if (slugsTakenInCode().has(article.slug)) errors.push(`Slug « ${article.slug} » déjà pris (blog-articles.ts ou redirection).`);
  if (opts.q) {
    const [existing] = await opts.q(
      `select "isPublished", "publishedAt", ${UPDATE_FIELDS.map((f) => `"${f}"`).join(", ")} from "BlogArticle" where slug = $1`,
      [article.slug],
    );
    if (opts.update) {
      const refusal = updateRefusal(article.slug, existing, opts.now);
      if (refusal) errors.push(refusal);
      else changes = diffFields(existing, row);
    } else if (existing) {
      errors.push(`Slug « ${article.slug} » déjà présent en base (corriger un article programmé : --update).`);
    }
  } else {
    warnings.push(
      opts.update
        ? "Base non consultée : existence et statut de l'article à mettre à jour non vérifiés."
        : "Base non consultée : unicité du slug en base non vérifiée.",
    );
  }

  const links = await checkInternalLinks(
    article.internalLinks,
    buildLinkContext(APP_DIR, publishedAt, opts.now, opts.q ? sqlLinkDb(opts.q) : undefined),
  );
  for (const l of links) {
    const msg = `Lien interne ${l.path} : ${l.reason}.`;
    if (l.status === "missing" || (l.status === "unverified" && opts.strictLinks)) errors.push(msg);
    else if (l.status === "unverified") warnings.push(msg);
  }
  return { row, faqCount: article.faqs.length, links, errors, warnings, changes };
}

function newId(): string {
  return `c${Date.now().toString(36)}${randomBytes(8).toString("hex")}`.slice(0, 25);
}

async function insertRow(q: SqlQuery, row: BlogArticleRow): Promise<string> {
  const rows = await q(
    `insert into "BlogArticle" ("id","slug","title","excerpt","content","category","readingTime","targetKeyword",
       "metaTitle","metaDescription","isPublished","publishedAt","generatedByAI","createdAt","updatedAt")
     values ($1,$2,$3,$4,$5,$6,$7,$8,null,$9,false,$10::timestamptz at time zone 'UTC',false,
       now() at time zone 'UTC', now() at time zone 'UTC')
     on conflict ("slug") do nothing returning "id"`,
    [newId(), row.slug, row.title, row.excerpt, row.content, row.category, row.readingTime, row.targetKeyword,
      row.metaDescription, row.publishedAt],
  );
  if (rows.length !== 1) throw new Error(`Insertion refusée : slug « ${row.slug} » déjà présent (course).`);
  return String(rows[0].id);
}

/** --update --write : la clause `"isPublished" = false` garantit qu'un article publié n'est jamais touché. */
export async function updateRow(q: SqlQuery, row: BlogArticleRow): Promise<string> {
  const rows = await q(
    `update "BlogArticle" set "title" = $2, "excerpt" = $3, "content" = $4, "category" = $5, "readingTime" = $6,
       "metaTitle" = $7, "metaDescription" = $8, "publishedAt" = $9::timestamptz at time zone 'UTC',
       "updatedAt" = now() at time zone 'UTC'
     where slug = $1 and "isPublished" = false returning "id"`,
    [row.slug, row.title, row.excerpt, row.content, row.category, row.readingTime, row.metaTitle,
      row.metaDescription, row.publishedAt],
  );
  if (rows.length !== 1) throw new Error(`Mise à jour refusée : article « ${row.slug} » absent ou publié entre-temps.`);
  return String(rows[0].id);
}

/** Affichage d'un changement : champs courts en entier, contenu en lignes retirées / ajoutées. */
export function formatChange(c: FieldChange, full = false): string {
  if (c.field !== "content") return `  ${c.field} :\n    avant : ${JSON.stringify(c.before)}\n    après : ${JSON.stringify(c.after)}`;
  const before = (c.before ?? "").split("\n");
  const after = (c.after ?? "").split("\n");
  const removed = before.filter((l) => !after.includes(l));
  const added = after.filter((l) => !before.includes(l));
  const cap = (lines: string[], sign: string) =>
    (full ? lines : lines.slice(0, 20)).map((l) => `    ${sign} ${full ? l : l.slice(0, 160)}`).join("\n") +
    (!full && lines.length > 20 ? `\n    … ${lines.length - 20} de plus (--full)` : "");
  return [
    `  content : ${before.join("\n").length} → ${after.join("\n").length} caractères, ${removed.length} ligne(s) retirée(s), ${added.length} ajoutée(s)`,
    removed.length ? cap(removed, "-") : "",
    added.length ? cap(added, "+") : "",
  ].filter(Boolean).join("\n");
}

async function main(argv: string[]): Promise<number> {
  const file = argv.find((a) => !a.startsWith("--"));
  if (!file) {
    console.error("Usage : npx tsx scripts/content/import-article.ts <fichier.md> [--update] [--write] [--heure-utc=5] [--offline] [--full]");
    return 2;
  }
  const write = argv.includes("--write");
  const update = argv.includes("--update");
  const offline = argv.includes("--offline");
  const hourArg = argv.find((a) => a.startsWith("--heure-utc="));
  const hourUtc = hourArg ? Number(hourArg.split("=")[1]) : DEFAULT_PUBLISH_HOUR_UTC;
  if (!Number.isInteger(hourUtc) || hourUtc < 0 || hourUtc > 23) {
    console.error("--heure-utc doit être un entier entre 0 et 23.");
    return 2;
  }
  if (write && offline) {
    console.error("--write et --offline sont incompatibles.");
    return 2;
  }
  const dbUrl = offline ? undefined : process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl && !offline) {
    console.error("NEON_DATABASE_URL absente : définir l'URL Neon, ou --offline pour un dry-run sans base.");
    return 2;
  }
  const q = dbUrl ? neonHttpQuery(dbUrl) : undefined;

  const prepared = await prepareImport(fs.readFileSync(path.resolve(file), "utf-8"), {
    now: new Date(), hourUtc, q, strictLinks: write, update,
  });
  const { row } = prepared;
  const full = argv.includes("--full");
  if (update && prepared.changes) {
    console.log(`Article programmé « ${row.slug} » : ${prepared.changes.length} champ(s) modifié(s).`);
    for (const c of prepared.changes) console.log(formatChange(c, full));
  } else {
    const shown = full ? row : { ...row, content: `${row.content.slice(0, 400)}… (${row.content.length} caractères)` };
    console.log(JSON.stringify(shown, null, 2));
  }
  console.log(`\nFAQ : ${prepared.faqCount} question(s) (rendues en bloc « Questions fréquentes » + JSON-LD FAQPage).`);
  console.log("Liens internes :");
  for (const l of prepared.links) console.log(`  [${l.status}] ${l.path} (${l.reason})`);
  for (const w of prepared.warnings) console.log(`AVERTISSEMENT : ${w}`);
  for (const e of prepared.errors) console.error(`ERREUR : ${e}`);
  if (prepared.errors.length > 0) {
    console.error(`\n${update ? "Mise à jour" : "Import"} refusé(e) (${prepared.errors.length} erreur(s)). Rien n'a été écrit.`);
    return 1;
  }
  if (update) {
    if (!write) {
      console.log(`\nDRY-RUN : rien n'a été écrit. Relancer avec --update --write pour appliquer (publication le ${row.publishedAt}).`);
      return 0;
    }
    if (prepared.changes?.length === 0) {
      console.log("\nArticle déjà à jour : rien à écrire.");
      return 0;
    }
    const id = await updateRow(q!, row);
    const [check] = await q!(`select "isPublished", "publishedAt", "updatedAt" from "BlogArticle" where id = $1`, [id]);
    console.log(`\nMis à jour : id ${id}, isPublished=${String(check?.isPublished)}, publishedAt=${String(check?.publishedAt)}, updatedAt=${String(check?.updatedAt)} (UTC).`);
    return 0;
  }
  if (!write) {
    console.log(`\nDRY-RUN : rien n'a été écrit. Relancer avec --write pour insérer (publication le ${row.publishedAt}).`);
    return 0;
  }
  const id = await insertRow(q!, row);
  const [check] = await q!(`select "isPublished", "publishedAt" from "BlogArticle" where id = $1`, [id]);
  console.log(`\nInséré : id ${id}, isPublished=${String(check?.isPublished)}, publishedAt=${String(check?.publishedAt)} (UTC).`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    },
  );
}
