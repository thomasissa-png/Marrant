/**
 * Sorties du lot de relance v5 (s15) : lignes exactes à insérer (JSON) et tableau de
 * relecture (markdown). Logique pure, sans base.
 */
import type { PreparedPlatform } from "./social-controls";
import { approvedByDuLot, LOT_DEBUT, LOT_FIN, LOT_ID } from "./social-lot-v5-config";
import type { LotPost, Origine } from "./social-lot-v5";

/** Ligne SocialPost telle qu'insérée (`--insert`), champs non listés = défauts Prisma. */
export interface LigneLot {
  id: string;
  platform: PreparedPlatform;
  format: "TWEET" | "IMAGE_QUI_CLAQUE" | "POTE_AU_TAF";
  content: string;
  hook: string;
  cta: null;
  hashtags: string[];
  targetPersona: string;
  sourceType: string;
  sourceId: string;
  threadParts: string[];
  imageUrls: string[];
  /** APPROVED ; REJECTED pour un repli en réserve (activé par la garde articleSlug). */
  status: "APPROVED" | "REJECTED";
  approvedBy: string;
  directorScore: null;
  directorNote: string;
  scheduledAt: string;
}
/** Identité d'un lot : identifiant libre (`--lot`) et bornes (dates de Paris incluses). */
export interface MetaLot { lot: string; debut: string; fin: string }
export const META_LOT_V5: MetaLot = { lot: LOT_ID, debut: LOT_DEBUT, fin: LOT_FIN };

export interface FichierLot {
  lot: string; approvedBy: string; debut: string; fin: string; graine: string; total: number; parReseau: Record<string, number>; posts: LigneLot[];
  /** Replis en réserve des relais d'articles programmés (insérés en REJECTED). */
  replis?: LigneLot[];
}

const FORMAT: Record<PreparedPlatform, LigneLot["format"]> = { TWITTER: "TWEET", INSTAGRAM: "IMAGE_QUI_CLAQUE", LINKEDIN: "POTE_AU_TAF" };
const LABEL: Record<PreparedPlatform, string> = { TWITTER: "X", INSTAGRAM: "Instagram", LINKEDIN: "LinkedIn" };
const JOURS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

function marqueurs(p: LotPost): string {
  if (p.repliDe) return `[repli-de:${p.repliDe}] `;
  return [p.article && `[article:${p.article}]`, p.repli && `[repli:${p.repli}]`, p.datee && `[date:${p.date}]`].filter(Boolean).map((m) => `${m} `).join("");
}

export function versLigne(p: LotPost, lot: string = LOT_ID): LigneLot {
  const premiere = (p.cartes[0] ?? p.content.split("\n")[0]).replace(/\s*\n\s*/g, " ");
  return {
    id: p.id, platform: p.platform, format: FORMAT[p.platform], content: p.content, hook: premiere.slice(0, 80), cta: null, hashtags: [],
    targetPersona: p.persona, sourceType: p.sourceType, sourceId: p.sourceId, threadParts: p.cartes, imageUrls: p.imageUrls,
    status: p.repliDe ? "REJECTED" : "APPROVED", approvedBy: approvedByDuLot(lot), directorScore: null,
    // Marqueurs lus par le Worker (lib/social/garde-article.ts) : garde des relais et reprise.
    directorNote: `${marqueurs(p)}Lot ${lot} (${p.type}, ${p.origine}${p.cle ? ` ${p.cle}` : ""})${p.note ? ` : ${p.note}` : ""}`,
    scheduledAt: p.scheduledAt,
  };
}

export function fichierLot(posts: LotPost[], graine: string, meta: MetaLot = META_LOT_V5, replis: LotPost[] = []): FichierLot {
  const parReseau = Object.fromEntries((["TWITTER", "INSTAGRAM", "LINKEDIN"] as const).map((pf) => [pf, posts.filter((p) => p.platform === pf).length]));
  return { lot: meta.lot, approvedBy: approvedByDuLot(meta.lot), debut: meta.debut, fin: meta.fin, graine, total: posts.length, parReseau,
    posts: posts.map((p) => versLigne(p, meta.lot)), replis: replis.map((p) => versLigne(p, meta.lot)) };
}

/** Segments à faire relire à l'aveugle : ni catalogue, ni article, ni validé, ni formule v5. */
export function textesNeufs(posts: LotPost[]): Array<{ texte: string; dates: string[] }> {
  const m = new Map<string, string[]>();
  for (const p of posts) for (const s of p.segments) if (s.origine === "NEUF") m.set(s.texte, [...(m.get(s.texte) ?? []), `${p.date} ${LABEL[p.platform]}`]);
  return [...m].map(([texte, dates]) => ({ texte, dates }));
}

const cell = (t: string) => t.replace(/\|/g, "/").replace(/\n/g, "<br>");
const frDate = (d: string) => `${JOURS[new Date(`${d}T12:00:00Z`).getUTCDay()]} ${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
const ORIGINE: Record<Origine, string> = { CATALOGUE: "catalogue", ARTICLE: "article", VALIDE: "validé Thomas", FORMULE_V5: "formule v5", NEUF: "NEUF" };

function source(p: LotPost): string {
  const s = [...new Set(p.segments.map((x) => ORIGINE[x.origine]))].join(" + ");
  return `${p.sourceType} \`${p.sourceId}\` (${s})`;
}

export function renderLotMarkdown(posts: LotPost[], warnings: string[], errors: string[], stock: number, graine: string, meta: MetaLot = META_LOT_V5, replis: LotPost[] = []): string {
  const { lot, debut, fin } = meta;
  const n = (pf: PreparedPlatform) => posts.filter((p) => p.platform === pf).length;
  const neufs = textesNeufs(posts);
  const valides = posts.filter((p) => p.origine === "VALIDE");
  const out = [
    `# Lot social « ${lot} » (${frDate(debut)} au ${frDate(fin)}), DRY-RUN`,
    "",
    `> Généré par \`apps/web/scripts/content/prepare-social-month.ts --lot ${lot} --debut ${debut} --fin ${fin}\` (graine « ${graine} »). **Rien n'est inséré en base, rien n'est publié.**`,
    "> Sources : `docs/social/strategie-relance-v5.md` (grille, calendrier §3, R1 à R6, cartes §8), gagnants `duels-resultat-cycle5.md`, 9 posts `validation-thomas-s15.md`, catalogue validé (Joke actives GARDER) et articles programmés (BlogArticle + articles statiques). Aucune génération IA.",
    `> Insertion (plus tard) : \`--lot ${lot} --insert [--driver=neon-http]\` lit \`lot-${lot}.json\` et insère ces lignes en APPROVED (approvedBy « ${approvedByDuLot(lot)} »), puis compte par réseau et par semaine. Annulation : \`--lot ${lot} --rollback --confirmer\`.`,
    "",
    `**Total : ${posts.length} posts** (X : ${n("TWITTER")}, Instagram : ${n("INSTAGRAM")}, LinkedIn : ${n("LINKEDIN")}). Heures de Paris : X 12:30, Instagram 19:30, LinkedIn 08:15. Stock éligible du catalogue au J0 : ${stock} vannes.`,
    "",
    "**R1 non vérifiable par le script** : aucune note à l'aveugle n'existe pour les vannes du catalogue ni pour la plupart des lignes d'article (v5 §1 : « N exact à compter par @copywriter »). Sont exclues : les 5 vannes connues sous 8 et les 7 perdants des duels du cycle 5. Les vannes tirées restent à confirmer à 8 et plus avant insertion.",
    "",
    `Contrôles bloquants passés sur chaque post : zéro tiret cadratin, gros mots, « je » hors « » (R6), longueurs (X 270 comptés par X, lien = 23 ; légende Instagram 80), LinkedIn 3 phrases au plus, cartes (25 / 30 / 35 mots). Sur le lot : anti-répétition 90 jours tous réseaux (posts récents en base compris), « pain » 30 jours, réservées Noël, liens UTM v5, aucun dimanche, 1 relais LinkedIn par semaine au plus. Erreurs bloquantes : **${errors.length}**.`,
    "",
  ];
  if (errors.length) out.push("## Erreurs bloquantes", "", ...errors.map((e) => `- ${e}`), "");
  out.push(`## Textes NEUFS à faire passer à la relecture à l'aveugle (${neufs.length})`, "",
    "Ni repris mot pour mot du catalogue ou d'un article, ni validés par Thomas, ni formule écrite dans la v5.", "");
  neufs.forEach((t) => out.push(`- « ${t.texte} » (${t.dates.length} posts : ${t.dates.join(", ")})`));
  out.push("", `## Posts validés par Thomas placés à leur date (${valides.length})`, "");
  valides.forEach((p) => out.push(`- ${p.cle} : ${frDate(p.date)} ${p.heure}, ${LABEL[p.platform]}`));
  out.push("", "Textes de marque neufs mais déjà validés par Thomas (duels à l'aveugle du cycle 5) : L2, L3.", "");
  if (warnings.length) out.push("## Avertissements", "", ...warnings.map((w) => `- ${w}`), "");
  out.push("## Calendrier complet", "", "| Date | Heure | Réseau | Type | Texte exact | Lien | Source | Cartes |", "|---|---|---|---|---|---|---|---|");
  for (const p of posts) {
    const affichees = p.cartes.length === 5 ? [...p.cartes.slice(0, 3), `${p.cartes[3]} ${p.cartes[4]}`] : p.cartes;
    const cartes = affichees.length ? affichees.map((c, i) => `${i + 1}. ${c}`).join("<br>") : "aucune (texte seul)";
    out.push(`| ${frDate(p.date)} | ${p.heure} | ${LABEL[p.platform]} | ${p.type}${p.cle ? ` (${p.cle})` : ""} | ${cell(p.content)} | ${p.lien ? cell(p.lien) : p.platform === "INSTAGRAM" && /lien en bio/.test(p.content) ? "lien de bio `/liens`" : "aucun"} | ${cell(source(p))}${p.note ? `<br>${cell(p.note)}` : ""} | ${cell(cartes)} |`);
  }
  if (replis.length) {
    out.push("", `## Replis en réserve (${replis.length}), envoyés seulement si l'article relayé n'est pas publié à l'heure`, "",
      "| Date | Réseau | Relais remplacé | Texte exact | Cartes |", "|---|---|---|---|---|");
    for (const r of replis) out.push(`| ${frDate(r.date)} ${r.heure} | ${LABEL[r.platform]} | ${r.repliDe} | ${cell(r.content)} | ${cell(r.cartes.join("<br>") || "aucune")} |`);
  }
  out.push("");
  return out.join("\n");
}
