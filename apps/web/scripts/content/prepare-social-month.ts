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
 * LOT DE RELANCE v5 (s15, `docs/social/strategie-relance-v5.md`) : 3 réseaux du 12/10/2026
 * au 03/01/2027, grille X 5 / Instagram 5 / LinkedIn 2 (heures de Paris 12:30, 19:30, 08:15).
 *   npx tsx scripts/content/prepare-social-month.ts --lot relance-s15
 *       DRY-RUN : lectures SELECT seulement (API SQL HTTPS Neon), écrit
 *       docs/social/preparation/lot-relance-s15.md (tableau de relecture, textes neufs)
 *       et lot-relance-s15.json (exactement les lignes qui seraient insérées). Rien en base.
 *   npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --insert [--driver=neon-http] [--json fichier]
 *       Régénère le lot de la même commande (mêmes --debut, --fin, --pool, --seed) et refuse si le JSON
 *       n'est pas ce dry-run ligne pour ligne (bornes, graine, posts, replis) ; puis
 *       insère les lignes du JSON relu en APPROVED (approvedBy « thomas-s15 ») via Prisma ;
 *       `--driver=neon-http` = adaptateur HTTP Neon si la connexion TCP est bloquée.
 *       Puis contrôle après insertion : comptes par réseau et par semaine, attendu contre inséré.
 *
 * LOTS SUIVANTS (QA cycle 1, C6) : identifiant libre et bornes de dates (Paris, incluses).
 *   npx tsx scripts/content/prepare-social-month.ts --lot <id> --debut AAAA-MM-JJ --fin AAAA-MM-JJ [--pool fichier]
 *       `--pool` : vannes autorisées (id catalogue ou `slug#rang`), les meilleures d'abord (ordre
 *       du tirage, sans mélange) ; JSON ou texte (1 id par ligne, `# ` = commentaire) ;
 *       `--pool strict` = pool strict de `src/config/social-pool.ts` (lu aussi par le Worker).
 *       `--textes-formats fichier` : textes validés du repli du mix (défaut docs/social/preparation/
 *       textes-formats-valides.json) ; case sans vanne au niveau et sans texte = erreur par créneau et par format.
 *       `--lignes-notees fichier` : lignes d'article notées (défaut docs/social/preparation/lignes-articles-notes.json) ;
 *       les lignes `auNiveau` entrent au relais de LEUR article seulement, même hors `--pool`.
 *       Retour à 90 jours sur un autre réseau que la 1re diffusion, sauf pénurie (avertissement).
 *       approvedBy du lot : « lot-<id> » (« thomas-s15 » pour relance-s15, bornes par défaut 12/10 au 03/01).
 *   npx tsx scripts/content/prepare-social-month.ts --lot <id> --rollback [--confirmer] [--driver=neon-http]
 *       Sans --confirmer : comptes seulement. Avec : posts APPROVED jamais envoyés du lot passés en REJECTED.
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
import { blogArticles } from "../../src/lib/blog-articles";
import { POOL_STRICT } from "../../src/config/social-pool";
import { ANTI_REPETITION_JOURS, LOT_DEBUT, LOT_FIN, LOT_ID, LOT_ID_RE } from "./social-lot-v5-config";
import { buildLotV5, controlerLegendesInstagram, controlerLot, type ArticleLot } from "./social-lot-v5";
import { lireTextesFormats } from "./social-lot-v5-mix";
import { lireLignesNotees } from "./social-lignes-notees";
import { brasHeureParReseau, fichierLot, renderLotMarkdown, type MetaLot } from "./social-lot-v5-export";
import { annulerLot, bornesLot, ecartsFichierLot, insererLot, lireFichierLot, type Driver } from "./social-lot-v5-insert";

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

/** Entrées d'un lot v5 : catalogue validé, articles (base + statiques) et posts antérieurs à son début. */
export async function loadLotInputs(q: SqlQuery, debut: string = LOT_DEBUT, fin: string = LOT_FIN) {
  const pool: CatalogueJoke[] = (await q(
    `select id, content, punchline, category::text as category from "Joke" where "isActive" = true and "copyVerdict" = 'GARDER' order by id`,
  )).map((r) => ({ id: s(r.id), setup: s(r.content), punchline: s(r.punchline), isActive: true, verdict: "GARDER", category: s(r.category) || null }));
  const debutArticles = addDays(debut, -ANTI_REPETITION_JOURS);
  const enBase: ArticleLot[] = (await q(
    `select slug, title, category, content, to_char("publishedAt", 'YYYY-MM-DD') as d,
       (not "isPublished" or "publishedAt" > now()) as a_garder from "BlogArticle"
     where "publishedAt" >= $1::date and "publishedAt" < ($2::date + 1) order by "publishedAt"`,
    [debutArticles, fin],
  )).map((r) => ({ slug: s(r.slug), title: s(r.title), category: s(r.category), content: s(r.content), date: s(r.d), aGarder: r.a_garder === true }));
  const slugs = new Set(enBase.map((a) => a.slug));
  const statiques: ArticleLot[] = blogArticles.filter((a) => a.date >= debutArticles && a.date <= fin && !slugs.has(a.slug))
    .map((a) => ({ slug: a.slug, title: a.title, category: a.category, content: a.content, date: a.date.slice(0, 10) }));
  // Tout l'historique avant le lot : 90 jours pour l'anti-répétition, réseau de 1re diffusion pour le retour (plan v3 §2).
  const recents = (await q(
    `select to_char("scheduledAt", 'YYYY-MM-DD') as d, "sourceId", platform::text as platform,
       coalesce(content, '') || ' ' || array_to_string("threadParts", ' ') as texte from "SocialPost"
     where "scheduledAt" < $1::date and "sourceId" is not null and status::text not in ('REJECTED', 'FAILED')
       and platform::text in ('TWITTER', 'INSTAGRAM', 'LINKEDIN')`,
    [debut],
  )).map((r) => ({ date: s(r.d), sourceId: s(r.sourceId), platform: s(r.platform), texte: s(r.texte) }));
  return { pool, articles: [...enBase, ...statiques].sort((a, b) => a.date.localeCompare(b.date)), recents };
}

/**
 * Fichier `--pool` : identifiants de vannes autorisées, les meilleures d'abord. JSON (tableau de
 * chaînes ou d'objets `{ id }`) ou texte (1 identifiant en tête de ligne ; lignes vides et `# …` ignorées).
 */
export function lirePool(contenu: string, chemin: string): string[] {
  let ids: string[];
  if (chemin.endsWith(".json")) {
    const brut = JSON.parse(contenu) as unknown;
    if (!Array.isArray(brut)) throw new Error(`--pool ${chemin} : tableau JSON attendu.`);
    ids = brut.map((x) => (typeof x === "string" ? x : String((x as { id?: unknown })?.id ?? ""))).map((x) => x.trim());
  } else {
    ids = contenu.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("# ") && l !== "#").map((l) => l.split(/\s+/)[0]);
  }
  ids = ids.filter(Boolean);
  const doublons = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (doublons.length) throw new Error(`--pool ${chemin} : identifiant(s) en double (${[...new Set(doublons)].join(", ")}).`);
  if (ids.length === 0) throw new Error(`--pool ${chemin} : aucun identifiant.`);
  return ids;
}

/**
 * Notes à l'aveugle d'un fichier de pool ou de `src/config/social-pool.ts` : sur une ligne,
 * un identifiant puis « 8,5 / 9,0 » (2 relecteurs) → moyenne. Lignes sans note ignorées.
 */
export function notesDuTexte(contenu: string): Record<string, number> {
  const notes: Record<string, number> = {};
  for (const l of contenu.split(/\r?\n/)) {
    const m = l.match(/^\s*"?([A-Za-z0-9][\w#-]{2,})"?,?.*?(\d+(?:[,.]\d+)?)\s*\/\s*(\d+(?:[,.]\d+)?)/);
    if (m) notes[m[1]] = (Number(m[2].replace(",", ".")) + Number(m[3].replace(",", "."))) / 2;
  }
  return notes;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Arguments d'un lot : identifiant libre, bornes (défaut du lot relance-s15), pool. Erreur = message. */
export function argsLot(argv: string[]): { lot: string; debut: string; fin: string; pool?: string } | string {
  const lot = arg(argv, "--lot") ?? "";
  if (!LOT_ID_RE.test(lot)) return `--lot : identifiant libre en minuscules, chiffres et tirets (2 à 40 caractères), reçu « ${lot} ».`;
  const debut = arg(argv, "--debut") ?? (lot === LOT_ID ? LOT_DEBUT : undefined);
  const fin = arg(argv, "--fin") ?? (lot === LOT_ID ? LOT_FIN : undefined);
  if (!debut || !fin) return `--debut et --fin (AAAA-MM-JJ) obligatoires pour le lot « ${lot} ».`;
  if (!DATE_RE.test(debut) || !DATE_RE.test(fin) || Number.isNaN(Date.parse(debut)) || Number.isNaN(Date.parse(fin))) return "--debut et --fin : dates AAAA-MM-JJ.";
  if (debut > fin) return `--debut (${debut}) après --fin (${fin}).`;
  return { lot, debut, fin, pool: arg(argv, "--pool") };
}

/** Lot d'une commande (lectures SELECT seulement) : même graine et mêmes entrées = mêmes lignes. */
async function genererLot(argv: string[], a: { lot: string; debut: string; fin: string; pool?: string }, meta: MetaLot, dbUrl: string) {
  const seed = arg(argv, "--seed") ?? a.lot;
  // `--pool strict` : pool strict du Worker (src/config/social-pool.ts), sinon fichier.
  const autorisees = a.pool === "strict" ? [...POOL_STRICT] : a.pool ? lirePool(fs.readFileSync(a.pool, "utf-8"), a.pool) : undefined;
  // Notes du pool (paires du test LinkedIn texte / image) : commentaires de social-pool.ts ou lignes du fichier.
  const sourceNotes = a.pool === "strict" ? path.join(process.cwd(), "src", "config", "social-pool.ts") : a.pool;
  const notes = sourceNotes && fs.existsSync(sourceNotes) ? notesDuTexte(fs.readFileSync(sourceNotes, "utf-8")) : {};
  // Repli du mix : textes validés (`--textes-formats`, défaut textes-formats-valides.json), seule source des cases sans vanne.
  const tf = chargerTextesFormats(arg(argv, "--textes-formats") ?? path.join(DOCS_DIR, "textes-formats-valides.json"));
  // Lignes d'article notées au niveau (`--lignes-notees`, défaut lignes-articles-notes.json) : relais de leur article.
  const ln = chargerLignesNotees(arg(argv, "--lignes-notees") ?? path.join(DOCS_DIR, "lignes-articles-notes.json"));
  const inputs = await loadLotInputs(neonHttpQuery(dbUrl), meta.debut, meta.fin);
  const res = buildLotV5({ ...inputs, seed, siteUrl: arg(argv, "--site-url"), lot: a.lot, debut: a.debut, fin: a.fin, autorisees, notes, textesFormats: tf.textes,
    lignesNotees: ln.lignes });
  // « pain » : lot ET posts déjà en base (30 jours tous réseaux).
  const lot = controlerLot(res.posts, inputs.recents);
  // Légendes Instagram : « À envoyer à... », sans pied ni lien (posts et replis).
  const leg = controlerLegendesInstagram(res.posts, res.replis);
  return { seed, autorisees, inputs, res, errors: [...tf.erreurs, ...ln.erreurs, ...res.errors, ...lot.errors, ...leg.errors],
    warnings: [...tf.avertissements, ...ln.avertissements, ...res.warnings, ...lot.warnings, ...leg.warnings] };
}

/** Lignes d'article notées : fichier absent = aucune ligne (avertissement), entrée non conforme = erreur bloquante. */
export function chargerLignesNotees(chemin: string): ReturnType<typeof lireLignesNotees> & { avertissements: string[] } {
  if (!fs.existsSync(chemin)) return { lignes: [], erreurs: [], avertissements: [`Lignes d'article notées : ${chemin} introuvable, aucune ligne au relais.`] };
  return { ...lireLignesNotees(fs.readFileSync(chemin, "utf-8"), chemin), avertissements: [] };
}

/** Fichier des textes du mix : absent = aucun texte (avertissement), entrée non conforme = erreur bloquante. */
export function chargerTextesFormats(chemin: string): ReturnType<typeof lireTextesFormats> & { avertissements: string[] } {
  if (!fs.existsSync(chemin)) return { textes: [], erreurs: [], avertissements: [`Textes du mix : ${chemin} introuvable, aucun texte de repli.`] };
  return { ...lireTextesFormats(fs.readFileSync(chemin, "utf-8"), chemin), avertissements: [] };
}

async function mainLot(argv: string[]): Promise<number> {
  const a = argsLot(argv);
  if (typeof a === "string") {
    console.error(a);
    return 2;
  }
  const meta: MetaLot = { lot: a.lot, debut: a.debut, fin: a.fin };
  const jsonPath = arg(argv, "--json") ?? path.join(DOCS_DIR, `lot-${a.lot}.json`);
  const dbUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("NEON_DATABASE_URL (ou DATABASE_URL) absente.");
    return 2;
  }
  const driver = (arg(argv, "--driver") ?? "tcp") as Driver;
  if (driver !== "tcp" && driver !== "neon-http") {
    console.error("--driver doit valoir tcp ou neon-http.");
    return 2;
  }
  if (argv.includes("--rollback")) {
    const confirmer = argv.includes("--confirmer");
    // Tranche seulement (--debut/--fin ; défaut de relance-s15 = tout le lot) : annuler 1b ne touche jamais 1a.
    const r = await annulerLot(a.lot, driver, dbUrl, confirmer, new Date(), bornesLot(a.debut, a.fin));
    console.log(`Lot ${a.lot}, tranche du ${a.debut} au ${a.fin} (approvedBy « ${r.approvedBy} ») avant : ${JSON.stringify(r.avant)}. APPROVED non envoyés : ${r.aAnnuler}.`);
    if (!confirmer) {
      console.log("Rien n'a été modifié. Relancer avec --confirmer pour passer ces posts en REJECTED.");
      return 0;
    }
    console.log(`Annulés (REJECTED) : ${r.annules}. Après : ${JSON.stringify(r.apres)}. Réinsertion : nouvel identifiant de lot (--lot), les ids dépendent du lot.`);
    return r.annules === r.aAnnuler ? 0 : 1;
  }
  if (argv.includes("--insert")) {
    const f = lireFichierLot(jsonPath);
    if (f.lot !== a.lot) {
      console.error(`Le fichier ${jsonPath} est le lot « ${f.lot} », pas « ${a.lot} ».`);
      return 2;
    }
    // Le fichier doit être le dry-run de CETTE commande (bornes, pool, graine), régénéré à l'instant.
    const g = await genererLot(argv, a, meta, dbUrl);
    const ecarts = g.errors.length ? [`le lot régénéré a ${g.errors.length} erreur(s) bloquante(s)`]
      : ecartsFichierLot(fichierLot(g.res.posts, g.seed, meta, g.res.replis), f);
    if (ecarts.length) {
      for (const e of ecarts) console.error(`REFUS : ${e}`);
      console.error(`Insertion refusée : ${jsonPath} n'est pas le dry-run de cette commande. Relancer la même commande sans --insert, relire, puis --insert.`);
      return 2;
    }
    const r = await insererLot(f, driver, dbUrl);
    console.log(`Inséré : ${r.inseres} posts APPROVED (${f.approvedBy}) depuis ${jsonPath}, pilote ${driver}.`);
    for (const [k, n] of [...r.comptes].sort()) console.log(`  ${k.replace("|", ", semaine du ")} : ${n}`);
    for (const e of r.ecarts) console.error(`ÉCART : ${e}`);
    console.log(r.ecarts.length ? `Contrôle après insertion : ${r.ecarts.length} écart(s), voir --rollback.` : "Contrôle après insertion : conforme (par réseau et par semaine).");
    return r.inseres === f.total && r.ecarts.length === 0 ? 0 : 1;
  }
  const { seed, autorisees, inputs, res, errors, warnings } = await genererLot(argv, a, meta, dbUrl);
  const n = (pf: string) => res.posts.filter((p) => p.platform === pf).length;
  console.log(`Catalogue : ${inputs.pool.length} vannes GARDER${autorisees ? `, pool ${autorisees.length} identifiant(s)` : ""} (stock éligible ${res.stockEligible}), ${inputs.articles.length} article(s), ${inputs.recents.length} post(s) récent(s).`);
  console.log(`Lot ${a.lot} (${a.debut} au ${a.fin}) : ${res.posts.length} posts (X ${n("TWITTER")}, Instagram ${n("INSTAGRAM")}, LinkedIn ${n("LINKEDIN")}), ${res.replis.length} repli(s) en réserve.`);
  const v = res.variantes;
  console.log(`Test LinkedIn texte / image : ${v.eligibles} éligible(s), image ${v.image}, texte ${v.texte}, ${v.paires} paire(s) dont ${v.pairesMemeNote} de même note.`);
  console.log(`Test d'heure A / B : ${brasHeureParReseau(res.posts)}.`);
  for (const e of errors) console.error(`ERREUR : ${e}`);
  const mdPath = arg(argv, "--out") ?? path.join(DOCS_DIR, `lot-${a.lot}.md`);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, renderLotMarkdown(res.posts, warnings, errors, res.stockEligible, seed, meta, res.replis), "utf-8");
  if (errors.length === 0) fs.writeFileSync(jsonPath, `${JSON.stringify(fichierLot(res.posts, seed, meta, res.replis), null, 2)}\n`, "utf-8");
  console.log(`\nDRY-RUN : rien n'a été écrit en base. Relecture : ${mdPath}${errors.length ? " (JSON non écrit : erreurs bloquantes)" : `, lignes : ${jsonPath}`}`);
  return errors.length > 0 ? 1 : 0;
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
  if (arg(argv, "--lot")) return mainLot(argv);
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
