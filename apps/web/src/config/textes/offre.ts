/**
 * Textes de l'offre Premium ajoutés par l'audit parcours s16 (lot C).
 *
 * Règle P0 du projet : tout nouveau texte client se calibre avec Thomas
 * (étalons). Ces versions sont provisoires, simples, tutoyées, sans tiret
 * cadratin. Les chiffres viennent des constantes de prix (config/premium.ts),
 * jamais en dur : changer un prix change le texte.
 */
import {
  ESPACE_INSECABLE,
  formatEuros,
  PREMIUM_ANNUAL_EQUIVALENT_LABEL,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_ANNUAL_SAVINGS_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_PARCOURS,
  PREMIUM_PRICE_LABEL,
  type PremiumPlan,
} from "@/config/premium";

/** Nom unique de l'offre (décision D4, s16) : « Premium » partout. */
export const OFFRE_NOM = "Premium";

/** « 2,99 € TTC par mois » / « 24,99 € TTC par an » (prix de config/premium.ts). */
export function prixTtcLabel(plan: PremiumPlan): string {
  return plan === "annual"
    ? `${formatEuros(PREMIUM_ANNUAL_PRICE_CENTS)} TTC par an`
    : `${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} TTC par mois`;
}

// VALIDÉ à l'aveugle s21, concision v5 (18/10, docs/copy/cta-s21/concision/textes-v5-a.md §0)
/**
 * REASS : réassurance fixe, unique, sous tout bouton plein qui porte un prix (jamais sous un
 * lien ni sous un bouton gratuit). Remplace toutes les anciennes variantes (« Tu as 14 jours
 * pour te faire rembourser… », `lignePrixGarantie`, `FENETRE_GARANTIE`, etc.). Ne promet le
 * remboursement que du premier paiement (docs/legal/remboursement-abonnement-s21.md).
 */
export const REASSURANCE_UNIQUE = `${OFFRE_NOM} : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.`;

// PROVISOIRE s16, étalon à valider
/** Acceptation des CGU sous le bouton de création de compte (reco 9). */
export const CGU_ACCEPTATION = {
  avant: "En créant ton compte, tu acceptes les ",
  lien: "CGU",
  apres: ".",
} as const;

/**
 * Mois offerts par l'annuel, calculés : 10,89 € / 2,99 € = 3,6 mois, donc
 * « plus de 3 mois offerts » (jamais « 4 mois », décision D5). Si l'économie
 * tombait pile sur un nombre entier de mois, on n'écrirait pas « plus de ».
 */
export const ANNUEL_MOIS_OFFERTS = Math.floor(PREMIUM_ANNUAL_SAVINGS_CENTS / PREMIUM_MONTHLY_PRICE_CENTS);
const MOIS_OFFERTS_EXACT = PREMIUM_ANNUAL_SAVINGS_CENTS % PREMIUM_MONTHLY_PRICE_CENTS === 0;

// PROVISOIRE s16, étalon à valider
/** « plus de 3 mois offerts » */
export const ANNUEL_MOIS_OFFERTS_LABEL = `${MOIS_OFFERTS_EXACT ? "" : "plus de "}${ANNUEL_MOIS_OFFERTS} mois offerts`;

// PROVISOIRE s16, étalon à valider
/** « 10,89 € économisés » (profil d'un abonné mensuel, passage à l'annuel ; hors /abonnement depuis la concision v5). */
export const ANNUEL_ECONOMIE_LABEL = `${formatEuros(PREMIUM_ANNUAL_SAVINGS_CENTS)} économisés`;

// PROVISOIRE s16, étalon à valider
/** « plus de 3 mois offerts, 10,89 € économisés par an » (D5 : les deux), profil d'un abonné mensuel. */
export const ANNUEL_AVANTAGE_LABEL = `${ANNUEL_MOIS_OFFERTS_LABEL}, ${ANNUEL_ECONOMIE_LABEL} par an`;

// VALIDÉ s16 (étalon 5b.2) : « Paiement annulé, rien n'a été prélevé. Tu peux réessayer quand tu veux. »
/** Retour de Stripe sans paiement (reco 12), affiché sur /abonnement. */
export const PAIEMENT_ANNULE = {
  titre: "Paiement annulé, rien n'a été prélevé.",
  texte: "Tu peux réessayer quand tu veux.",
} as const;

// PROVISOIRE s16, étalon à valider
/** Badge de la première étape d'un parcours (remplace « Essai gratuit », reco 16). */
export const ETAPE_LIBRE_BADGE = "Lecture libre";

// VALIDÉ à l'aveugle s21, concision v5 (textes-v5-c.md §1)
/** Ligne annuelle de /abonnement, état mensuel : « Ou 24,99 €/an, soit 2,08 € par mois. » */
export const ANNUEL_LIGNE_MENSUEL = `Ou ${PREMIUM_ANNUAL_PRICE_LABEL}, ${PREMIUM_ANNUAL_EQUIVALENT_LABEL}.`;

/** Ligne annuelle, état annuel (remplace la pastille et la ligne mensuelle) : « Soit 2,08 € par mois, plus de 3 mois offerts. » */
export const ANNUEL_LIGNE_ANNUEL = `${PREMIUM_ANNUAL_EQUIVALENT_LABEL.charAt(0).toUpperCase()}${PREMIUM_ANNUAL_EQUIVALENT_LABEL.slice(1)}, ${ANNUEL_MOIS_OFFERTS_LABEL}.`;

const MINUTES_ETAPE = PREMIUM_PARCOURS.map((p) => Number.parseInt(p.timePerWeek, 10)).filter((m) => m > 0);
const MINUTES_MIN = Math.min(...MINUTES_ETAPE);
const MINUTES_MAX = Math.max(...MINUTES_ETAPE);

/** `{D}` : « 15 à 20 minutes », min et max des rythmes des parcours publiés (config/premium.ts). */
export const DUREE_ETAPES = MINUTES_MIN === MINUTES_MAX ? `${MINUTES_MIN} minutes` : `${MINUTES_MIN} à ${MINUTES_MAX} minutes`;

// VALIDÉ à l'aveugle s21, concision v5 (textes-v5-c.md §1, retouche du tour 4)
/**
 * Sous-titre de /abonnement (visiteur et compte connecté) : « Pas d'attente entre les étapes,
 * de 15 à 20 minutes chacune. » Plus de surtitre. Le titre vient du parcours d'origine
 * (`ABONNEMENT_HAUT_PAR_PARCOURS`, cta-pages.ts).
 */
export const ABONNEMENT_HAUT_VISITEUR = {
  sousTitre: `Pas d'attente entre les étapes, ${MINUTES_MIN === MINUTES_MAX ? "" : "de "}${DUREE_ETAPES} chacune.`,
} as const;

// VALIDÉ à l'aveugle s21, concision v5 (textes-v5-b.md §6)
/** Libellé du plein de fin d'étape 1 : « Passer à l'étape 2 · 2,99 €/mois ». */
export const PASSER_ETAPE_2 = `Passer à l'étape 2${ESPACE_INSECABLE}· ${PREMIUM_PRICE_LABEL}`;

/** Fin d'étape 1, variante quiz en cours (`ValidationWall`, `quizPending`) : texte, plein, REASS dessous. */
export const VALIDATION_ETAPE = {
  texte: `Les étapes suivantes s'ouvrent avec ${OFFRE_NOM}.`,
  bouton: PASSER_ETAPE_2,
} as const;

// PROVISOIRE s16, étalon à valider
/** Nom accessible des cartes verrouillées des listes (lecteur d'écran, D4). */
export const CARTE_VERROUILLEE_LABEL = `Contenu ${OFFRE_NOM} : voir l'offre`;

// PROVISOIRE s16 (lot F), hors étalons, étalon à valider
/**
 * /abonnement pour un abonné dont la résiliation est programmée (lien de l'e-mail
 * de résiliation) : pas de nouveau paiement, renvoi vers le profil (réactivation).
 * `date` : « 12 novembre 2026 » ; `null` si la fin n'est pas connue. Lien : `TEXTES_CHECKOUT.lienProfil`.
 */
export const RESILIATION_PROGRAMMEE = {
  texte: (date: string | null) =>
    `${date ? `Ton Premium court jusqu'au ${date}.` : "Ton Premium court jusqu'à la fin de la période déjà payée."} Pour le garder, réactive-le depuis ton profil.`,
} as const;
