/**
 * Préparation mensuelle des posts sociaux X + Instagram + LinkedIn depuis le catalogue
 * validé (génération IA quotidienne arrêtée le 01/10/2026 ; relance des 3 réseaux le
 * 05/10, cadence de docs/social/strategie-relance-v2.md, paramétrable : CADENCE_V2).
 *
 * Lancement (depuis apps/web) :
 *   npx tsx scripts/content/prepare-social-month.ts --month 2026-10 --from 2026-10-02
 *       DRY-RUN (défaut) : lectures SELECT seulement, écrit docs/social/preparation/<mois>.md
 *       (plan complet + tirage de 10 posts pour validation de Thomas). Rien en base.
 *   npx tsx scripts/content/prepare-social-month.ts --month 2026-10 --from 2026-10-02 --write --echantillon-valide
 *       Insère les posts en APPROVED (approvedBy « preparation-mensuelle ») avec leur scheduledAt.
 *       Refusé sans --echantillon-valide (Thomas a relu l'échantillon du dry-run) ou si le mois
 *       a déjà été inséré.
 *
 * Options : --seed <texte> (défaut : le mois ; même graine = même plan), --site-url <url>,
 *           --out <fichier.md>.
 * Base : NEON_DATABASE_URL (ou DATABASE_URL), API SQL HTTPS Neon (même méthode que import-article).
 *
 * Sources (aucune IA, aucun texte inventé) :
 *  - vanne du jour : DailyContent → Joke (pour X, si isActive + copyVerdict GARDER) ;
 *  - cartes Instagram et repli X : Joke isActive + copyVerdict = 'GARDER' ;
 *  - articles relayés : BlogArticle publiés le jour même (lundi, jeudi), lien UTM ;
 *    LinkedIn : seulement si angle bureau, lien en premier commentaire (colonne `cta`).
 * Contrôle bloquant sans IA : scripts/content/social-controls.ts.
 *
 * Images Instagram : carrousel v3 4:5 (cartes « piste A ») rendu à la demande par le
 * Worker. Le script insère `imageUrl = null` et `threadParts = [amorce, chute]` (vanne)
 * ou `[]` (relais d'article, sourceType BLOG) ; publish-social envoie à Buffer une URL
 * par slide `/api/social/image?postId=<id>&slide=<n>` (generatePostImage → renderSlides).
 */
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { neonHttpQuery, type SqlQuery } from "./import-article";
import { addDays, buildPlan, drawSample, mondayOf, monthEnd, CADENCE_V2, type CatalogueJoke, type PlannedPost } from "./social-month-plan";
import type { PreparedPlatform } from "./social-controls";

export const APPROVED_BY = "preparation-mensuelle";
const DOCS_DIR = path.resolve(__dirname, "../../../../docs/social/preparation");

function arg(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  if (i >= 0) return argv[i + 1];
  return argv.find((a) => a.startsWith(`${name}=`))?.split("=")[1];
}

const s = (v: unknown) => (v == null ? "" : String(v));

export async function loadInputs(q: SqlQuery, month: string, from: string) {
  const end = monthEnd(month);
  const weekStart = mondayOf(from);
  const weekEnd = addDays(mondayOf(end), 6);
  const dailyRows = await q(
    `select to_char(dc.date, 'YYYY-MM-DD') as d, j.id, j.content, j.punchline, j."isActive" as active, j."copyVerdict" as verdict, j.category::text as category
     from "DailyContent" dc join "Joke" j on j.id = dc."jokeId" where dc.date >= $1::date and dc.date <= $2::date`,
    [weekStart, weekEnd],
  );
  const daily = new Map<string, CatalogueJoke>(dailyRows.map((r) => [s(r.d), {
    id: s(r.id), setup: s(r.content), punchline: s(r.punchline), isActive: r.active === true, verdict: r.verdict == null ? null : s(r.verdict),
    category: r.category == null ? null : s(r.category),
  }]));
  const pool: CatalogueJoke[] = (await q(
    `select id, content, punchline, category::text as category from "Joke" where "isActive" = true and "copyVerdict" = 'GARDER' order by id`,
  )).map((r) => ({ id: s(r.id), setup: s(r.content), punchline: s(r.punchline), isActive: true, verdict: "GARDER", category: s(r.category) || null }));
  const articles = (await q(
    `select slug, title, to_char("publishedAt", 'YYYY-MM-DD') as d from "BlogArticle"
     where "publishedAt" >= $1::date and "publishedAt" < ($2::date + 1)`,
    [from, end],
  )).map((r) => ({ slug: s(r.slug), title: s(r.title), date: s(r.d) }));
  const usedRows = await q(
    `select platform::text as platform, "sourceId" from "SocialPost"
     where "scheduledAt" >= $1::date and "scheduledAt" < ($2::date + 1) and "sourceId" is not null
       and status::text not in ('REJECTED', 'FAILED') and platform::text in ('TWITTER', 'INSTAGRAM', 'LINKEDIN')`,
    [`${month}-01`, end],
  );
  const alreadyUsed = usedRows.map((r) => ({ platform: s(r.platform) as PreparedPlatform, sourceId: s(r.sourceId) }));
  const [{ n }] = await q(
    `select count(*)::int as n from "SocialPost" where "approvedBy" = $1 and "scheduledAt" >= $2::date and "scheduledAt" < ($3::date + 1)`,
    [APPROVED_BY, from, end],
  );
  return { daily, pool, articles, alreadyUsed, alreadyPrepared: Number(n) };
}

const PLATFORM_LABEL: Record<PreparedPlatform, string> = { TWITTER: "X", INSTAGRAM: "Instagram", LINKEDIN: "LinkedIn" };
const KIND_LABEL = {
  VANNE_DU_JOUR: "Vanne du jour", VANNE: "Vanne du catalogue", VANNE_QUIZ: "Vanne + quiz", ARTICLE: "Relais d'article",
} as const;
const JOURS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

function frDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${JOURS[new Date(`${date}T12:00:00Z`).getUTCDay()]} ${d}/${m}/${y}`;
}

function imageLine(p: PlannedPost): string {
  if (!p.card) return "aucune (post texte)";
  const card = p.card.setup ? `« ${p.card.setup} » puis « ${p.card.punchline} »` : `couverture « ${p.card.punchline} » + fin`;
  return `carrousel 4:5 v3 : ${card} (rendu par le Worker à la publication)`;
}

function postBlock(p: PlannedPost, i: number): string {
  const lines = [
    `### ${i}. ${frDate(p.date)} ${p.parisTime} (Paris), ${PLATFORM_LABEL[p.platform]}, ${KIND_LABEL[p.kind]}`,
    "",
    ...p.text.split("\n").map((l) => `> ${l}`),
    "",
    `- Caractères : ${p.text.length}`,
    `- Image prévue : ${imageLine(p)}`,
    `- Source : ${p.sourceType} \`${p.sourceId}\``,
  ];
  if (p.link) lines.push(`- Lien UTM : ${p.link}`);
  if (p.firstComment) lines.push(`- Premier commentaire LinkedIn : ${p.firstComment}`);
  if (p.note) lines.push(`- Note : ${p.note}`);
  return lines.join("\n");
}

function creneaux(): string {
  return (Object.entries(CADENCE_V2) as Array<[PreparedPlatform, { h: number; m: number }]>)
    .map(([pf, c]) => `${PLATFORM_LABEL[pf]} ${String(c.h).padStart(2, "0")}:${String(c.m).padStart(2, "0")}`)
    .join(", ");
}

export function renderMarkdown(month: string, from: string, posts: PlannedPost[], sample: PlannedPost[], warnings: string[], errors: string[], seed: string): string {
  const count = (pf: PreparedPlatform) => posts.filter((p) => p.platform === pf).length;
  const out = [
    `# Préparation sociale ${month} (à partir du ${frDate(from)})`,
    "",
    `> Généré par \`apps/web/scripts/content/prepare-social-month.ts --month ${month} --from ${from}\` (dry-run, graine « ${seed} »). Rien n'est inséré en base.`,
    "> Contenu 100 % repris du catalogue validé (vannes actives au verdict GARDER, articles programmés). Aucune génération IA.",
    "> Insertion après validation de l'échantillon : relancer avec `--write --echantillon-valide` (même graine = même plan).",
    "",
    `Total : ${posts.length} posts (X : ${count("TWITTER")}, Instagram : ${count("INSTAGRAM")}, LinkedIn : ${count("LINKEDIN")}). Créneaux (heure de Paris) : ${creneaux()}.`,
    "",
  ];
  if (errors.length) out.push("## Erreurs bloquantes", "", ...errors.map((e) => `- ${e}`), "");
  if (warnings.length) out.push("## Avertissements", "", ...warnings.map((w) => `- ${w}`), "");
  out.push("## Échantillon de 10 posts à valider par Thomas (tirage au hasard)", "",
    "Règle : si un seul post est sous la barre, le lot est refait.", "");
  sample.forEach((p, i) => out.push(postBlock(p, i + 1), "", "- [ ] Validé", ""));
  out.push("## Calendrier", "", "| Date | Heure (Paris) | Plateforme | Type | Début du texte |", "|---|---|---|---|---|");
  for (const p of posts) {
    const start = p.text.split("\n")[0].replace(/\|/g, "/").slice(0, 70);
    out.push(`| ${frDate(p.date)} | ${p.parisTime} | ${PLATFORM_LABEL[p.platform]} | ${KIND_LABEL[p.kind]} | ${start} |`);
  }
  out.push("", "## Détail de tous les posts", "");
  posts.forEach((p, i) => out.push(postBlock(p, i + 1), ""));
  return out.join("\n");
}

const INSERT_SQL = `insert into "SocialPost" ("id","platform","format","content","hook","cta","hashtags","targetPersona",
  "sourceType","sourceId","threadParts","status","directorNote","approvedBy","scheduledAt","imageUrl","createdAt","updatedAt")
  select x.id, x.platform::"SocialPlatform", x.format::"SocialFormat", x.content, x.hook, x.cta, '{}'::text[], 'YANIS',
    x."sourceType", x."sourceId", array(select json_array_elements_text(x."threadParts")), 'APPROVED'::"SocialPostStatus",
    x.note, $2, (x."scheduledAt")::timestamptz at time zone 'UTC', null, now() at time zone 'UTC', now() at time zone 'UTC'
  from json_to_recordset($1::json) as x(id text, platform text, format text, content text, hook text, cta text,
    "sourceType" text, "sourceId" text, "threadParts" json, note text, "scheduledAt" text)
  returning id`;

export function toRows(posts: PlannedPost[], month: string, newId: () => string) {
  return posts.map((p) => ({
    id: newId(),
    platform: p.platform,
    format: p.platform === "INSTAGRAM" ? "IMAGE_QUI_CLAQUE" : p.platform === "LINKEDIN" ? "POTE_AU_TAF" : "TWEET",
    content: p.text,
    hook: p.text.split("\n")[0].slice(0, 80),
    cta: p.firstComment,
    sourceType: p.sourceType,
    sourceId: p.sourceId,
    threadParts: p.card ? (p.card.setup ? [p.card.setup, p.card.punchline] : []) : [],
    note: `Préparation mensuelle ${month} (catalogue validé, échantillon validé par Thomas).`,
    scheduledAt: p.scheduledAt,
  }));
}

function newId(): string {
  // Même format que import-article (25 caractères, préfixe c).
  return `c${Date.now().toString(36)}${randomBytes(8).toString("hex")}`.slice(0, 25);
}

async function main(argv: string[]): Promise<number> {
  const month = arg(argv, "--month");
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    console.error("Usage : npx tsx scripts/content/prepare-social-month.ts --month AAAA-MM [--from AAAA-MM-JJ] [--write --echantillon-valide] [--seed x] [--site-url url] [--out fichier.md]");
    return 2;
  }
  const from = arg(argv, "--from") ?? `${month}-01`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !from.startsWith(month)) {
    console.error("--from doit être une date AAAA-MM-JJ du mois demandé.");
    return 2;
  }
  const write = argv.includes("--write");
  if (write && !argv.includes("--echantillon-valide")) {
    console.error("--write exige --echantillon-valide : Thomas valide d'abord l'échantillon de 10 du dry-run.");
    return 2;
  }
  const seed = arg(argv, "--seed") ?? month;
  const siteUrl = arg(argv, "--site-url") ?? "https://deviens-marrant.fr";
  const dbUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("NEON_DATABASE_URL absente : le plan se construit sur le catalogue en base (lecture seule en dry-run).");
    return 2;
  }
  const q = neonHttpQuery(dbUrl);
  const inputs = await loadInputs(q, month, from);
  const { posts, warnings, errors } = buildPlan({ month, from, seed, siteUrl, ...inputs });
  const sample = drawSample(posts, 10, seed);
  console.log(`Catalogue : ${inputs.pool.length} vannes GARDER, ${inputs.daily.size} vannes du jour, ${inputs.articles.length} article(s).`);
  const n = (pf: string) => posts.filter((p) => p.platform === pf).length;
  console.log(`Plan : ${posts.length} posts (X ${n("TWITTER")}, Instagram ${n("INSTAGRAM")}, LinkedIn ${n("LINKEDIN")}).`);
  for (const w of warnings) console.log(`AVERTISSEMENT : ${w}`);
  for (const e of errors) console.error(`ERREUR : ${e}`);

  if (!write) {
    const out = arg(argv, "--out") ?? path.join(DOCS_DIR, `${month}.md`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, renderMarkdown(month, from, posts, sample, warnings, errors, seed), "utf-8");
    console.log(`\nDRY-RUN : rien n'a été écrit en base. Fichier de préparation : ${out}`);
    return errors.length > 0 ? 1 : 0;
  }
  if (errors.length > 0) {
    console.error(`\nInsertion refusée (${errors.length} erreur(s) bloquante(s)). Rien n'a été écrit.`);
    return 1;
  }
  if (inputs.alreadyPrepared > 0) {
    console.error(`\nInsertion refusée : ${inputs.alreadyPrepared} post(s) « ${APPROVED_BY} » déjà en base sur la période.`);
    return 1;
  }
  const inserted = await q(INSERT_SQL, [JSON.stringify(toRows(posts, month, newId)), APPROVED_BY]);
  console.log(`\nInséré : ${inserted.length} posts APPROVED (${APPROVED_BY}), publication par le cron publish-social à leur scheduledAt.`);
  return inserted.length === posts.length ? 0 : 1;
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
