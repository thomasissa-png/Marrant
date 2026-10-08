/**
 * Offre Premium : valeurs business centralisées (décisions Thomas, 03/10/2026).
 *
 * - Mensuel 2,99 €/mois ; annuel 24,99 €/an (décision Thomas 04/10/2026),
 *   affiché seulement quand le prix Stripe annuel est configuré côté serveur
 *   (`isAnnualPlanAvailable()`, src/lib/premium-plan-availability.ts).
 * - Valeur principale : tous les parcours en entier, première étape offerte.
 * - Contenu mensuel : le carnet de situations de répartie (src/data/carnet/,
 *   page /carnet), ajouté le 03/10/2026 une fois le premier carnet écrit.
 *
 * Les rythmes des parcours sont vérifiés contre docs/content/parcours-seed.json
 * par un test (src/__tests__/lib/premium-offer.test.ts).
 */

/**
 * Espace insécable (U+00A0) entre le montant et « € » : le symbole ne passe
 * jamais seul à la ligne (s16, lot E). Caractère invisible, d'où l'échappement.
 */
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";

export const ESPACE_INSECABLE = " ";

/** Format français : 299 → « 2,99 € » (virgule, espace insécable). */
export function formatEuros(cents: number): string {
  const euros = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return `${euros},${rest}${ESPACE_INSECABLE}€`;
}

/** Prix affiché du mensuel (le prix facturé est celui de STRIPE_PREMIUM_PRICE_ID). */
export const PREMIUM_MONTHLY_PRICE_CENTS = 299;
/** Prix affiché de l'annuel (le prix facturé est celui de STRIPE_PREMIUM_ANNUAL_PRICE_ID). */
export const PREMIUM_ANNUAL_PRICE_CENTS = 2499;

/** 24,99 / 12 = 2,0825 € : « 2,08 € par mois » (centime inférieur, pas de surpromesse). */
export const PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS = Math.floor(PREMIUM_ANNUAL_PRICE_CENTS / 12);

/** 2,99 × 12 = 35,88 € ; 35,88 − 24,99 = 10,89 € économisés par an. */
export const PREMIUM_ANNUAL_SAVINGS_CENTS = PREMIUM_MONTHLY_PRICE_CENTS * 12 - PREMIUM_ANNUAL_PRICE_CENTS;

/** « 2,99 €/mois » */
export const PREMIUM_PRICE_LABEL = `${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)}/mois`;
/** « 24,99 €/an » */
export const PREMIUM_ANNUAL_PRICE_LABEL = `${formatEuros(PREMIUM_ANNUAL_PRICE_CENTS)}/an`;
/** « soit 2,08 € par mois » */
export const PREMIUM_ANNUAL_EQUIVALENT_LABEL = `soit ${formatEuros(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS)} par mois`;
/** « 10,89 € économisés par an » */
export const PREMIUM_ANNUAL_SAVINGS_LABEL = `${formatEuros(PREMIUM_ANNUAL_SAVINGS_CENTS)} économisés par an`;
/** « 24,99 €/an, soit 2,08 € par mois (10,89 € économisés par an) » */
export const PREMIUM_ANNUAL_SUMMARY = `${PREMIUM_ANNUAL_PRICE_LABEL}, ${PREMIUM_ANNUAL_EQUIVALENT_LABEL} (${PREMIUM_ANNUAL_SAVINGS_LABEL})`;

/** Formules Premium. Mensuel par défaut partout (checkout sans paramètre compris). */
export const PREMIUM_PLANS = ["monthly", "annual"] as const;
export type PremiumPlan = (typeof PREMIUM_PLANS)[number];

export function isPremiumPlan(value: unknown): value is PremiumPlan {
  return typeof value === "string" && (PREMIUM_PLANS as readonly string[]).includes(value);
}

export interface PremiumParcoursOffer {
  slug: string;
  name: string;
  timePerWeek: string;
  /** Durée en semaines = nombre d'étapes du parcours (une étape par semaine). */
  weeks: number;
}

/**
 * Copie légère du seed (le JSON complet ne doit pas partir dans le bundle client).
 * Slugs, rythmes et nombre de semaines vérifiés contre le seed par un test.
 */
export const PREMIUM_PARCOURS: readonly PremiumParcoursOffer[] = [
  { slug: "machine-a-cafe", name: "Machine à Café", timePerWeek: "15 min/semaine", weeks: 3 },
  { slug: "repartie", name: "Répartie", timePerWeek: "20 min/semaine", weeks: 4 },
  { slug: "confiance", name: "Confiance", timePerWeek: "20 min/semaine", weeks: 6 },
  // s18 : Storytelling n'entre dans l'offre (et dans PARCOURS_COUNT) qu'une fois publié.
  ...(STORYTELLING_PUBLIE
    ? [{ slug: "storytelling", name: "Storytelling", timePerWeek: "20 min/semaine", weeks: 6 }]
    : []),
];

/** Nombre de parcours affiché partout (« les 3 parcours en entier »). */
export const PARCOURS_COUNT = PREMIUM_PARCOURS.length;

export type ParcoursSlug = "machine-a-cafe" | "repartie" | "confiance";

/** Durée (en semaines) d'un parcours, source unique des « N semaines » affichés. */
export function parcoursWeeks(slug: ParcoursSlug): number {
  const parcours = PREMIUM_PARCOURS.find((p) => p.slug === slug);
  if (!parcours) throw new Error(`Parcours inconnu : ${slug}`);
  return parcours.weeks;
}

/** Parcours le plus court et le plus long (« de 3 à 6 semaines »). */
export const PARCOURS_MIN_WEEKS = Math.min(...PREMIUM_PARCOURS.map((p) => p.weeks));
export const PARCOURS_MAX_WEEKS = Math.max(...PREMIUM_PARCOURS.map((p) => p.weeks));

/**
 * Limites sans abonnement (visiteur ou compte non abonné) : SOURCE UNIQUE. Appliquées par /api/jokes,
 * /api/tips et /api/videos, et reprises par tous les textes publics
 * (abonnement, CTA blog, avantages, llms.txt). Changer une valeur ici change
 * la limite réelle ET le texte affiché.
 */
export const FREE_JOKE_LIMIT = 10;
export const FREE_TIP_LIMIT = 3;
export const FREE_VIDEO_LIMIT = 3;

/** « 10 vannes, 3 conseils, 3 vidéos » : énumération des limites gratuites. */
export const FREE_CATALOGUE_LIMITS_LABEL = `${FREE_JOKE_LIMIT} vannes, ${FREE_TIP_LIMIT} conseils, ${FREE_VIDEO_LIMIT} vidéos`;

/** Avantage « carnet mensuel » : libellé unique (avantages, paywall, JSON-LD, llms.txt). */
export const PREMIUM_CARNET_BENEFIT =
  "le carnet mensuel de situations de répartie (nouveau chaque mois)";

/** Destination par défaut après paiement quand aucune intention n'a été mémorisée. */
export const PREMIUM_DEFAULT_RETURN = "/parcours";

/** Paramètre ajouté à la destination après paiement : déclenche le message de bienvenue. */
export const PREMIUM_WELCOME_PARAM = "premium";
export const PREMIUM_WELCOME_VALUE = "bienvenue";
