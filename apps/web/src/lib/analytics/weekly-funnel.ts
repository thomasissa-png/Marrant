/**
 * Funnel visiteur → Premium du rapport du lundi (audit parcours s16, reco 17).
 *
 * Chiffres ABSOLUS sur la semaine du rapport (le trafic est trop faible pour
 * lire des pourcentages, data-analyst s16 C13) : vues de /abonnement et
 * événements du tunnel (Umami), comptes créés, paiements, résiliations,
 * abonnés actifs et revenu mensuel récurrent (base, alimentée par Stripe).
 * Ne lève jamais : une source illisible donne « n.d. » et un avertissement,
 * le reste du rapport part quand même.
 */
import { fetchUmamiMetrics, fetchUmamiPathMetrics, type UmamiConfig, type UmamiPoint } from "./umami";
import { escapeHtml } from "./weekly-visits-email";

/**
 * Fin du compte gratuit (s15, déployé le 06/10/2026 à 07:45 heure de Paris) :
 * les comptes FREE créés avant sont les 11 anciens comptes gratuits, exclus
 * des taux de conversion (ils n'ont jamais été créés pour s'abonner).
 */
export const LEGACY_FREE_CUTOFF = new Date("2026-10-06T05:45:00Z");

/** Chiffres lus en base pour la semaine (injectés : Prisma en production). */
export type FunnelDbCounts = {
  comptesCrees: number;
  /** Paiements Stripe réussis (premiers paiements et renouvellements). */
  paiements: number;
  /** Abonnements terminés chez Stripe dans la semaine. */
  resiliations: number;
  /** Abonnements actifs dont la fin est programmée (instantané). */
  resiliationsProgrammees: number;
  abonnesActifs: number;
  mrrCents: number;
};

export type FunnelDbCounter = (startAt: Date, endAt: Date) => Promise<FunnelDbCounts>;

export type WeeklyFunnel = {
  vuesAbonnement: number | null;
  mursVus: number | null;
  clicsAbonnement: number | null;
  echecsInscription: number | null;
  db: FunnelDbCounts | null;
  warnings: string[];
};

const STRIPE_PAYMENT_EVENT = "invoice.payment_succeeded";
const STRIPE_END_EVENT = "customer.subscription.deleted";

/** Lecture Prisma : imports dynamiques (comme le reste du job), jamais au chargement. */
export const prismaFunnelCounter: FunnelDbCounter = async (startAt, endAt) => {
  const { prisma } = await import("@/lib/prisma");
  const { PREMIUM_PRICE_CENTS } = await import("@/lib/stripe");
  const { monthlyRevenueCents } = await import("@/lib/stripe-subscription");
  const range = { gte: startAt, lte: endAt };
  const [comptesCrees, paiements, resiliations, resiliationsProgrammees, actifs] = await Promise.all([
    prisma.user.count({ where: { createdAt: range } }),
    prisma.webhookEvent.count({ where: { provider: "stripe", eventType: STRIPE_PAYMENT_EVENT, processedAt: range } }),
    prisma.webhookEvent.count({ where: { provider: "stripe", eventType: STRIPE_END_EVENT, processedAt: range } }),
    prisma.subscription.count({ where: { status: "ACTIVE", cancelAtPeriodEnd: true } }),
    prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      select: { billingInterval: true, priceAmountCents: true },
    }),
  ]);
  const mrrCents = actifs.reduce((sum, sub) => sum + monthlyRevenueCents(sub, PREMIUM_PRICE_CENTS), 0);
  return { comptesCrees, paiements, resiliations, resiliationsProgrammees, abonnesActifs: actifs.length, mrrCents };
};

function viewsOf(points: UmamiPoint[], path: string): number {
  return points.filter((p) => p.x.replace(/\/$/, "") === path).reduce((sum, p) => sum + p.y, 0);
}

function eventCount(points: UmamiPoint[], name: string): number {
  return points.filter((p) => p.x === name).reduce((sum, p) => sum + p.y, 0);
}

const reason = (err: unknown) => (err instanceof Error ? err.message : "erreur inconnue");

export async function buildWeeklyFunnel(
  config: UmamiConfig,
  window: { startAt: number; endAt: number },
  countDb: FunnelDbCounter = prismaFunnelCounter,
): Promise<WeeklyFunnel> {
  const warnings: string[] = [];
  const [paths, events, db] = await Promise.all([
    fetchUmamiPathMetrics(config, window.startAt, window.endAt, 10, "/abonnement").catch((err) => {
      warnings.push(`vues /abonnement : ${reason(err)}`);
      return null;
    }),
    fetchUmamiMetrics(config, window.startAt, window.endAt, "event", 100).catch((err) => {
      warnings.push(`événements Umami : ${reason(err)}`);
      return null;
    }),
    countDb(new Date(window.startAt), new Date(window.endAt)).catch((err) => {
      warnings.push(`base : ${reason(err)}`);
      return null;
    }),
  ]);
  return {
    vuesAbonnement: paths ? viewsOf(paths, "/abonnement") : null,
    mursVus: events ? eventCount(events, "mur-vu") : null,
    clicsAbonnement: events ? eventCount(events, "abonnement-clic") : null,
    echecsInscription: events ? eventCount(events, "inscription-echec") : null,
    db,
    warnings,
  };
}

/** Taux de conversion (%) hors anciens comptes gratuits, une décimale, en texte. */
export function conversionHorsAnciensComptes(premiumUsers: number, totalUsers: number, legacyFreeUsers: number): string {
  const base = totalUsers - legacyFreeUsers;
  return base > 0 ? ((premiumUsers / base) * 100).toFixed(1) : "0.0";
}

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
const TD = "padding:8px 6px;border-bottom:1px solid #eee;";
const TD_NUM = `${TD}text-align:right;white-space:nowrap;`;
const H3 = "font-size:16px;margin:24px 0 8px;color:#7c3aed;";
const NA = "n.d.";

const n = (v: number | null | undefined) => (v === null || v === undefined ? NA : nf.format(v));
const euros = (cents: number | null | undefined) =>
  cents === null || cents === undefined ? NA : `${nf.format(Math.round(cents) / 100)} €`;

/** Section HTML « Funnel de la semaine » (même e-mail du lundi, aucun nouvel envoi). */
export function buildFunnelSectionHtml(f: WeeklyFunnel): string {
  const rows: [string, string][] = [
    ["Murs Premium vus (mur-vu)", n(f.mursVus)],
    ["Vues de /abonnement", n(f.vuesAbonnement)],
    ["Clics vers le paiement (abonnement-clic)", n(f.clicsAbonnement)],
    ["Comptes créés", n(f.db?.comptesCrees)],
    ["Échecs d'inscription (inscription-echec)", n(f.echecsInscription)],
    ["Paiements reçus (Stripe)", n(f.db?.paiements)],
    ["Résiliations effectives", n(f.db?.resiliations)],
    ["Résiliations programmées en cours", n(f.db?.resiliationsProgrammees)],
    ["Abonnés actifs (aujourd'hui)", n(f.db?.abonnesActifs)],
    ["Revenu mensuel récurrent (aujourd'hui)", euros(f.db?.mrrCents)],
  ];
  const body = rows
    .map(([label, value]) => `<tr><td style="${TD}">${label}</td><td style="${TD_NUM}font-weight:600;">${value}</td></tr>`)
    .join("");
  const partial = f.warnings.length
    ? `<p style="font-size:13px;color:#b45309;margin:0 0 8px;">Section partielle : ${escapeHtml(f.warnings.join(" ; "))}.</p>`
    : "";
  return `<h3 style="${H3}">Funnel de la semaine (chiffres absolus)</h3>${partial}
  <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${body}</table>
  <p style="font-size:12px;color:#999;margin:8px 0 0;">Umami pour les vues et les clics, base (webhooks Stripe) pour les comptes, paiements et résiliations. Volumes trop faibles pour des pourcentages. n.d. : donnée non disponible.</p>`;
}
