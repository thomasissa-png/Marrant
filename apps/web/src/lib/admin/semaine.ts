/**
 * Page admin, onglet « Semaine » (s21, 18/10) : les MÊMES fonctions et les MÊMES
 * lectures que le rapport du lundi (`weekly-visits-job.ts`), sur la même semaine.
 *
 *  - `rapport` (défaut) : semaine de l'e-mail du dernier lundi (lundi au dimanche).
 *  - `glissante` : les 7 derniers jours complets (comme si le rapport partait maintenant).
 * Ajouts propres à l'admin (lectures simples, aucun recalcul d'un chiffre du
 * rapport) : contenu du jour présent, abonnements impayés, alertes dérivées.
 * Chaque section est indépendante : une source en panne n'empêche pas les autres.
 */
import { getUmamiConfig } from "@/lib/analytics/umami";
import { computeReportPeriods, dernierRapportDuLundi } from "@/lib/analytics/weekly-visits-period";
import { buildWeeklyVisitsReport, type WeeklyVisitsReport } from "@/lib/analytics/weekly-visits-report";
import { prismaBlogArticles, prismaConversions } from "@/lib/analytics/weekly-visits-job";
import { buildWeeklyFunnel, lignesFunnel, type WeeklyFunnel } from "@/lib/analytics/weekly-funnel";
import { buildWeeklyParcours, lignesParcours, type WeeklyParcours } from "@/lib/analytics/weekly-parcours";
import { prismaStock } from "@/lib/analytics/weekly-stock";
import { chargerLettreResume, libelleNumero, type LettreResume } from "@/lib/analytics/weekly-lettre";
import type { StockCoverage } from "@/lib/scheduler/prepared-content";
import type { RapportPublication } from "@/lib/social/publication-report";

export type ModeSemaine = "rapport" | "glissante";

export type AlerteAdmin = { niveau: "rouge" | "orange"; texte: string };

export type StockAdmin =
  | { etat: "ok"; coverage: StockCoverage }
  | { etat: "generation-ia" }
  | { etat: "illisible" };

export type SemaineAdmin = {
  genereLe: string;
  mode: ModeSemaine;
  periode: { label: string; startAt: number; endAt: number; precedente: string };
  umamiConfigure: boolean;
  visites: WeeklyVisitsReport | null;
  visitesErreur: string | null;
  funnel: WeeklyFunnel;
  parcours: WeeklyParcours;
  /** Lignes de l'e-mail du lundi, construites par les mêmes fonctions (texte brut). */
  lignes: { funnel: [string, string][]; parcours: [string, string[]][] };
  stock: StockAdmin;
  lettre: LettreResume;
  social: RapportPublication | null;
  /** Contenu du jour (UTC) : null = aucun, sinon ce qui manque. */
  contenuDuJour: { vanne: boolean; conseil: boolean; video: boolean } | null | "illisible";
  impayes: number | null;
  alertes: AlerteAdmin[];
};

const message = (err: unknown) => (err instanceof Error ? err.message : "erreur inconnue");

async function lireStock(): Promise<StockAdmin> {
  try {
    const coverage = await prismaStock();
    return coverage ? { etat: "ok", coverage } : { etat: "generation-ia" };
  } catch {
    return { etat: "illisible" };
  }
}

async function lireSocial(startAt: number, endAt: number, now: Date): Promise<RapportPublication | null> {
  try {
    const { chargerRapport, jourParis } = await import("@/lib/social/publication-report");
    return await chargerRapport(jourParis(new Date(startAt)), jourParis(new Date(endAt)), now);
  } catch {
    return null;
  }
}

async function lireEtatDuJour(now: Date) {
  const { prisma } = await import("@/lib/prisma");
  const jour = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const [contenu, impayes] = await Promise.all([
    prisma.dailyContent
      .findFirst({
        where: { date: { gte: jour, lt: new Date(jour.getTime() + 86_400_000) } },
        select: { jokeId: true, tipId: true, videoId: true },
      })
      .then((c) => (c ? { vanne: !c.jokeId, conseil: !c.tipId, video: !c.videoId } : null))
      .catch(() => "illisible" as const),
    prisma.subscription.count({ where: { status: "PAST_DUE" } }).catch(() => null),
  ]);
  return { contenu, impayes };
}

const jours = (n: number | null) => (n === null ? "?" : `${n} jour${n > 1 ? "s" : ""}`);

/** Alertes dérivées des sections (aucun nouveau calcul). */
export function alertesSemaine(s: Omit<SemaineAdmin, "alertes">, now: Date): AlerteAdmin[] {
  const a: AlerteAdmin[] = [];
  if (s.contenuDuJour === null) a.push({ niveau: "rouge", texte: "Aucun contenu du jour aujourd'hui : stock vide ou tâche du matin en échec (voir /api/health)." });
  else if (s.contenuDuJour === "illisible") a.push({ niveau: "orange", texte: "Contenu du jour illisible (base)." });
  else if (s.contenuDuJour.vanne || s.contenuDuJour.conseil) a.push({ niveau: "rouge", texte: "Contenu du jour incomplet : vanne ou conseil manquant." });
  if (s.stock.etat === "illisible") a.push({ niveau: "orange", texte: "Stock du contenu du jour illisible (base)." });
  if (s.stock.etat === "ok" && s.stock.coverage.status === "stale") {
    const c = s.stock.coverage;
    a.push({ niveau: "orange", texte: `Nouveau lot à préparer : ${jours(c.jokeDaysLeft)} de vannes et ${jours(c.tipDaysLeft)} de conseils jamais utilisés (seuil ${c.minDays} jours).` });
  }
  if (s.impayes) a.push({ niveau: "rouge", texte: `${s.impayes} abonnement(s) impayé(s) chez Stripe.` });
  if (s.lettre.etat === "ok" && s.lettre.numeros) {
    const p = s.lettre.numeros.prochain;
    const avant = p ? new Date(p.envoiPrevu).getTime() - now.getTime() : null;
    if (p && avant !== null && avant < 0) a.push({ niveau: "rouge", texte: `Lettre : numéro ${libelleNumero(p)} pas encore parti.` });
    else if (p && p.statut === "BROUILLON" && avant !== null && avant < 7 * 86_400_000) a.push({ niveau: "orange", texte: `Lettre : numéro ${libelleNumero(p)} à valider.` });
    const echecs = s.lettre.numeros.envoyes[0]?.echecs ?? 0;
    if (echecs > 0) a.push({ niveau: "orange", texte: `Lettre : ${echecs} échec(s) d'envoi sur le dernier numéro.` });
  }
  if (s.social && s.social.ecartTotal > 0) a.push({ niveau: "orange", texte: `Réseaux sociaux : ${s.social.ecartTotal} post(s) prévu(s) non confirmé(s) sur la semaine.` });
  return a;
}

export async function chargerSemaine(now: Date = new Date(), mode: ModeSemaine = "rapport"): Promise<SemaineAdmin> {
  const ancre = mode === "rapport" ? dernierRapportDuLundi(now) : now;
  const periods = computeReportPeriods(ancre);
  const fenetre = { startAt: periods.current.startAt, endAt: periods.current.endAt };
  const config = getUmamiConfig();

  const [visites, funnel, parcours, stock, lettre, social, jour] = await Promise.all([
    config
      ? buildWeeklyVisitsReport(ancre, config, prismaConversions, prismaBlogArticles)
          .then((r) => ({ r, err: null }))
          .catch((err) => ({ r: null, err: `Umami : ${message(err)}` }))
      : Promise.resolve({ r: null, err: "Umami non configuré (UMAMI_API_KEY, UMAMI_WEBSITE_ID)" }),
    buildWeeklyFunnel(config, fenetre),
    buildWeeklyParcours(config, fenetre),
    lireStock(),
    chargerLettreResume(fenetre, now),
    lireSocial(fenetre.startAt, fenetre.endAt, now),
    lireEtatDuJour(now),
  ]);

  const base: Omit<SemaineAdmin, "alertes"> = {
    genereLe: now.toISOString(),
    mode,
    periode: { label: periods.current.label, ...fenetre, precedente: periods.previous.label },
    umamiConfigure: config !== null,
    visites: visites.r,
    visitesErreur: visites.err,
    funnel,
    parcours,
    lignes: { funnel: lignesFunnel(funnel), parcours: lignesParcours(parcours) },
    stock,
    lettre,
    social,
    contenuDuJour: jour.contenu,
    impayes: jour.impayes,
  };
  return { ...base, alertes: alertesSemaine(base, now) };
}
