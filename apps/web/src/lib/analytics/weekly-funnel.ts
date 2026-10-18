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
import {
  fetchUmamiEventDataValues,
  fetchUmamiMetrics,
  fetchUmamiPathMetrics,
  type UmamiConfig,
  type UmamiPoint,
  type UmamiPropertyValue,
} from "./umami";
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
  /**
   * Nouveaux abonnés (s20) : paiements Stripe Checkout terminés dans la semaine
   * (`checkout.session.completed`, un par nouvel abonnement).
   */
  nouveauxAbonnes: number;
  /** Abonnements terminés chez Stripe dans la semaine. */
  resiliations: number;
  /** Abonnements actifs dont la fin est programmée (instantané). */
  resiliationsProgrammees: number;
  abonnesActifs: number;
  /** s21 (page admin) : abonnés actifs par formule (`billingInterval` « month » / « year »). */
  parFormule?: { mensuel: number; annuel: number; inconnu: number };
  mrrCents: number;
};

/** Une ligne de la ventilation par bloc d'entrée (`src` de `checkout-ouvert` / `checkout-echec`). */
export type CheckoutParSource = { src: string; ouverts: number; echecs: number };

export type FunnelDbCounter = (startAt: Date, endAt: Date) => Promise<FunnelDbCounts>;

export type WeeklyFunnel = {
  /** s20 : encarts d'article vus (blog-cta-vu) et cliqués (blog-cta-clic), seuil du lot 1. */
  encartsBlogVus: number | null;
  clicsEncartsBlog: number | null;
  vuesAbonnement: number | null;
  mursVus: number | null;
  clicsAbonnement: number | null;
  echecsInscription: number | null;
  /** s21 (revue v2 m-2) : Stripe Checkout ouvert (`checkout-ouvert`) et échecs (`checkout-echec`). */
  checkoutsOuverts: number | null;
  echecsCheckout: number | null;
  /** Les deux, ventilés par `src` (bloc d'entrée) ; null si aucune des deux répartitions n'est lisible. */
  checkoutParSource: CheckoutParSource[] | null;
  db: FunnelDbCounts | null;
  warnings: string[];
};

const STRIPE_PAYMENT_EVENT = "invoice.payment_succeeded";
const STRIPE_END_EVENT = "customer.subscription.deleted";
const STRIPE_CHECKOUT_EVENT = "checkout.session.completed";

/**
 * Renouvellements (s20) : paiements réussis qui ne sont pas le premier paiement
 * d'un abonnement de la semaine. Jamais négatif (webhook de paiement en retard).
 */
export function renouvellements(db: Pick<FunnelDbCounts, "paiements" | "nouveauxAbonnes">): number {
  return Math.max(0, db.paiements - db.nouveauxAbonnes);
}

/** Lecture Prisma : imports dynamiques (comme le reste du job), jamais au chargement. */
export const prismaFunnelCounter: FunnelDbCounter = async (startAt, endAt) => {
  const { prisma } = await import("@/lib/prisma");
  const { PREMIUM_PRICE_CENTS } = await import("@/lib/stripe");
  const { monthlyRevenueCents } = await import("@/lib/stripe-subscription");
  const range = { gte: startAt, lte: endAt };
  const [comptesCrees, paiements, nouveauxAbonnes, resiliations, resiliationsProgrammees, actifs] = await Promise.all([
    prisma.user.count({ where: { createdAt: range } }),
    prisma.webhookEvent.count({ where: { provider: "stripe", eventType: STRIPE_PAYMENT_EVENT, processedAt: range } }),
    prisma.webhookEvent.count({ where: { provider: "stripe", eventType: STRIPE_CHECKOUT_EVENT, processedAt: range } }),
    prisma.webhookEvent.count({ where: { provider: "stripe", eventType: STRIPE_END_EVENT, processedAt: range } }),
    prisma.subscription.count({ where: { status: "ACTIVE", cancelAtPeriodEnd: true } }),
    prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      select: { billingInterval: true, priceAmountCents: true },
    }),
  ]);
  const mrrCents = actifs.reduce((sum, sub) => sum + monthlyRevenueCents(sub, PREMIUM_PRICE_CENTS), 0);
  return {
    comptesCrees,
    paiements,
    nouveauxAbonnes,
    resiliations,
    resiliationsProgrammees,
    abonnesActifs: actifs.length,
    parFormule: compterParFormule(actifs),
    mrrCents,
  };
};

/** Abonnés actifs par formule ; intervalle absent (pas encore resynchronisé) : « inconnu ». */
export function compterParFormule(actifs: Array<{ billingInterval: string | null }>): {
  mensuel: number;
  annuel: number;
  inconnu: number;
} {
  const r = { mensuel: 0, annuel: 0, inconnu: 0 };
  for (const a of actifs) {
    if (a.billingInterval === "month") r.mensuel += 1;
    else if (a.billingInterval === "year") r.annuel += 1;
    else r.inconnu += 1;
  }
  return r;
}

function viewsOf(points: UmamiPoint[], path: string): number {
  return points.filter((p) => p.x.replace(/\/$/, "") === path).reduce((sum, p) => sum + p.y, 0);
}

function eventCount(points: UmamiPoint[], name: string): number {
  return points.filter((p) => p.x === name).reduce((sum, p) => sum + p.y, 0);
}

/**
 * Fusionne les répartitions `src` des deux événements, triées par ouvertures puis échecs
 * décroissants, puis par nom. Une répartition illisible (null) compte pour zéro.
 */
export function fusionnerCheckoutParSource(
  ouverts: UmamiPropertyValue[] | null,
  echecs: UmamiPropertyValue[] | null,
): CheckoutParSource[] | null {
  if (!ouverts && !echecs) return null;
  const parSrc = new Map<string, CheckoutParSource>();
  const ligne = (src: string) => {
    const cle = src || "inconnu";
    const existante = parSrc.get(cle) ?? { src: cle, ouverts: 0, echecs: 0 };
    parSrc.set(cle, existante);
    return existante;
  };
  for (const v of ouverts ?? []) ligne(v.value).ouverts += v.total;
  for (const v of echecs ?? []) ligne(v.value).echecs += v.total;
  return [...parSrc.values()].sort(
    (a, b) => b.ouverts - a.ouverts || b.echecs - a.echecs || a.src.localeCompare(b.src),
  );
}

const reason = (err: unknown) => (err instanceof Error ? err.message : "erreur inconnue");

/** s21 (page admin) : sans configuration Umami, seules les données de la base sont lues. */
export const UMAMI_ABSENT = "Umami non configuré (UMAMI_API_KEY, UMAMI_WEBSITE_ID)";

export async function buildWeeklyFunnel(
  config: UmamiConfig | null,
  window: { startAt: number; endAt: number },
  countDb: FunnelDbCounter = prismaFunnelCounter,
): Promise<WeeklyFunnel> {
  const warnings: string[] = config ? [] : [UMAMI_ABSENT];
  const umami = <T>(label: string, call: (c: UmamiConfig) => Promise<T>): Promise<T | null> =>
    config
      ? call(config).catch((err) => {
          warnings.push(`${label} : ${reason(err)}`);
          return null;
        })
      : Promise.resolve(null);
  const [paths, events, db, srcOuverts, srcEchecs] = await Promise.all([
    umami("vues /abonnement", (c) => fetchUmamiPathMetrics(c, window.startAt, window.endAt, 10, "/abonnement")),
    umami("événements Umami", (c) => fetchUmamiMetrics(c, window.startAt, window.endAt, "event", 100)),
    countDb(new Date(window.startAt), new Date(window.endAt)).catch((err) => {
      warnings.push(`base : ${reason(err)}`);
      return null;
    }),
    // s21 (revue v2 m-2) : même filtre d'hôte que le reste (appliqué par `umamiGet`).
    umami("checkout-ouvert par source", (c) =>
      fetchUmamiEventDataValues(c, window.startAt, window.endAt, "checkout-ouvert", "src"),
    ),
    umami("checkout-echec par source", (c) =>
      fetchUmamiEventDataValues(c, window.startAt, window.endAt, "checkout-echec", "src"),
    ),
  ]);
  return {
    encartsBlogVus: events ? eventCount(events, "blog-cta-vu") : null,
    clicsEncartsBlog: events ? eventCount(events, "blog-cta-clic") : null,
    vuesAbonnement: paths ? viewsOf(paths, "/abonnement") : null,
    mursVus: events ? eventCount(events, "mur-vu") : null,
    clicsAbonnement: events ? eventCount(events, "abonnement-clic") : null,
    echecsInscription: events ? eventCount(events, "inscription-echec") : null,
    checkoutsOuverts: events ? eventCount(events, "checkout-ouvert") : null,
    echecsCheckout: events ? eventCount(events, "checkout-echec") : null,
    checkoutParSource: fusionnerCheckoutParSource(srcOuverts, srcEchecs),
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

/** « 3 (2 mensuels, 1 annuel) » ; sans ventilation, le nombre seul. */
export function abonnesParFormule(db: FunnelDbCounts | null | undefined): string {
  if (!db) return NA;
  const f = db.parFormule;
  if (!f) return n(db.abonnesActifs);
  const parts = [`${n(f.mensuel)} mensuel${f.mensuel > 1 ? "s" : ""}`, `${n(f.annuel)} annuel${f.annuel > 1 ? "s" : ""}`];
  if (f.inconnu > 0) parts.push(`${n(f.inconnu)} à resynchroniser`);
  return `${n(db.abonnesActifs)} (${parts.join(", ")})`;
}

/** Lignes « libellé, valeur » de l'entonnoir : e-mail du lundi ET page admin (s21). */
export function lignesFunnel(f: WeeklyFunnel): [string, string][] {
  return [
    ["Encarts d'article vus (blog-cta-vu)", n(f.encartsBlogVus)],
    ["Clics sur ces encarts (blog-cta-clic)", n(f.clicsEncartsBlog)],
    ["Murs Premium vus (mur-vu)", n(f.mursVus)],
    ["Vues de /abonnement", n(f.vuesAbonnement)],
    ["Clics vers le paiement (abonnement-clic)", n(f.clicsAbonnement)],
    ["Paiements ouverts chez Stripe (checkout-ouvert)", n(f.checkoutsOuverts)],
    ["Échecs d'ouverture ou retours sans payer (checkout-echec)", n(f.echecsCheckout)],
    ["Comptes créés", n(f.db?.comptesCrees)],
    ["Échecs d'inscription (inscription-echec)", n(f.echecsInscription)],
    ["Nouveaux abonnés (premier paiement)", n(f.db?.nouveauxAbonnes)],
    ["Renouvellements (abonnés déjà là)", n(f.db ? renouvellements(f.db) : null)],
    ["Paiements reçus au total (Stripe)", n(f.db?.paiements)],
    ["Résiliations effectives", n(f.db?.resiliations)],
    ["Résiliations programmées en cours", n(f.db?.resiliationsProgrammees)],
    ["Abonnés actifs (aujourd'hui)", abonnesParFormule(f.db)],
    ["Revenu mensuel récurrent (aujourd'hui)", euros(f.db?.mrrCents)],
  ];
}

/** Section HTML « Funnel de la semaine » (même e-mail du lundi, aucun nouvel envoi). */
export function buildFunnelSectionHtml(f: WeeklyFunnel): string {
  const rows = lignesFunnel(f);
  const body = rows
    .map(([label, value]) => `<tr><td style="${TD}">${label}</td><td style="${TD_NUM}font-weight:600;">${value}</td></tr>`)
    .join("");
  const partial = f.warnings.length
    ? `<p style="font-size:13px;color:#b45309;margin:0 0 8px;">Section partielle : ${escapeHtml(f.warnings.join(" ; "))}.</p>`
    : "";
  return `<h3 style="${H3}">Funnel de la semaine (chiffres absolus)</h3>${partial}
  <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${body}</table>${buildCheckoutParSourceHtml(f.checkoutParSource)}
  <p style="font-size:12px;color:#999;margin:8px 0 0;">Umami pour les vues et les clics, base (webhooks Stripe) pour les comptes, paiements et résiliations. Volumes trop faibles pour des pourcentages. n.d. : donnée non disponible.</p>`;
}

/** s21 (revue v2 m-2) : quel bloc d'entrée mène jusqu'au paiement (`src` des événements checkout). */
function buildCheckoutParSourceHtml(lignes: CheckoutParSource[] | null): string {
  const titre = `<p style="font-size:14px;font-weight:600;margin:16px 0 4px;">Paiement ouvert par bloc d'entrée (src)</p>`;
  if (lignes === null) return `${titre}<p style="font-size:13px;color:#999;margin:0;">${NA}</p>`;
  if (lignes.length === 0) return `${titre}<p style="font-size:13px;color:#999;margin:0;">Aucun paiement ouvert cette semaine.</p>`;
  const head = `<tr><th style="${TD}text-align:left;">src</th><th style="${TD_NUM}">checkout-ouvert</th><th style="${TD_NUM}">checkout-echec</th></tr>`;
  const body = lignes
    .map(
      (l) =>
        `<tr><td style="${TD}">${escapeHtml(l.src)}</td><td style="${TD_NUM}">${n(l.ouverts)}</td><td style="${TD_NUM}">${n(l.echecs)}</td></tr>`,
    )
    .join("");
  return `${titre}<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${head}${body}</table>`;
}
