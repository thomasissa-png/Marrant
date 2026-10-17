/**
 * Textes de l'offre Premium ajoutés par l'audit parcours s16 (lot C).
 *
 * Règle P0 du projet : tout nouveau texte client se calibre avec Thomas
 * (étalons). Ces versions sont provisoires, simples, tutoyées, sans tiret
 * cadratin. Les chiffres viennent des constantes de prix (config/premium.ts),
 * jamais en dur : changer un prix change le texte.
 */
import {
  formatEuros,
  PARCOURS_COUNT,
  PREMIUM_ANNUAL_EQUIVALENT_LABEL,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_ANNUAL_SAVINGS_CENTS,
  PREMIUM_ANNUAL_SAVINGS_LABEL,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_PARCOURS,
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

// VALIDÉ à l'aveugle s21 (lot 2 tour 3, 3/3 au niveau ; formule @legal A)
/**
 * Réassurance sous le bouton de paiement quand le prix TTC est déjà affiché en
 * gros juste au-dessus (« 2,99 € TTC / mois ») : elle ne redit pas le prix et
 * ne promet le remboursement que du premier paiement, sur demande dans les
 * 14 jours (docs/legal/remboursement-abonnement-s21.md). Même texte en mensuel
 * et en annuel.
 */
export const REASSURANCE_PAIEMENT =
  "Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux.";

// VALIDÉ à l'aveugle s21 (duel /register, 3/3 au niveau)
/**
 * Réassurance sous le formulaire de /register : le prix TTC est déjà rappelé
 * en haut de la page (« Premium, 2,99 € TTC par mois, annulable à tout
 * moment. »), donc ni prix ni résiliation ici, seulement le remboursement du
 * premier paiement (docs/copy/lot2-s21/pack-relecture-register.md).
 */
export const REMBOURSEMENT_PREMIER_PAIEMENT = "Tu as 14 jours pour te faire rembourser ton premier paiement.";

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
/** « 10,89 € économisés » */
export const ANNUEL_ECONOMIE_LABEL = `${formatEuros(PREMIUM_ANNUAL_SAVINGS_CENTS)} économisés`;

// PROVISOIRE s16, étalon à valider
/** « plus de 3 mois offerts, 10,89 € économisés par an » (D5 : les deux). */
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

// VALIDÉ à l'aveugle s21 (lot 2, duel 1, tour 1 : 3/3 au niveau ; docs/copy/lot2-boutons-abonnement-s21.md §4.1)
/**
 * Mur (contenu verrouillé, emplacement E4) : forme longue sur les boutons
 * (fiches, bas de liste, étapes de parcours, favoris), forme courte sur les
 * liens et les cartes. Le bouton mène à une page qui détaille l'offre : il ne
 * débloque rien tout de suite.
 */
export const MUR_PREMIUM_BOUTON = `Voir ce que contient ${OFFRE_NOM}`;
export const MUR_PREMIUM_LIEN = `Voir ${OFFRE_NOM}`;

// VALIDÉ à l'aveugle s21 (lot 2, haut de /abonnement, tour 3 : 3/3 au niveau)
/**
 * Ligne sous le prix mensuel de /abonnement, affichée dès l'état par défaut si
 * l'annuel est disponible : « Ou 24,99 €/an, soit 2,08 € par mois et 10,89 €
 * économisés par an. » Tout vient de config/premium.ts ; « plus de 3 mois
 * offerts » n'est dit qu'une fois, sur la pastille « Annuel ».
 */
export const ANNUEL_LIGNE_MENSUEL = `Ou ${PREMIUM_ANNUAL_PRICE_LABEL}, ${PREMIUM_ANNUAL_EQUIVALENT_LABEL} et ${PREMIUM_ANNUAL_SAVINGS_LABEL}.`;

/** « 15 à 20 minutes » : bornes lues dans les rythmes des parcours publiés ([CHOIX 29/09]). */
function dureeParcoursLabel(): string {
  const minutes = PREMIUM_PARCOURS.map((p) => Number.parseInt(p.timePerWeek, 10)).filter((m) => m > 0);
  const min = Math.min(...minutes);
  const max = Math.max(...minutes);
  return min === max ? `${min} minutes` : `${min} à ${max} minutes selon le parcours`;
}

// VALIDÉ à l'aveugle s21 (lot 2, haut de /abonnement, tour 3 : 3/3 au niveau)
/**
 * Haut de /abonnement pour un visiteur. Le H1 reste « Accéder aux parcours
 * complets » tant que Thomas n'a pas tranché (§7 point 2 du lot 2).
 */
export const ABONNEMENT_HAUT_VISITEUR = {
  surtitre: "C'est pour toi si tu restes muet quand on te chambre.",
  sousTitre: `${PARCOURS_COUNT} parcours pour t'entraîner, une étape par semaine, ${dureeParcoursLabel()}. La première étape de chacun reste en lecture libre.`,
} as const;

// PROVISOIRE s16, étalon à valider
/** Mur de l'étape 2 et suivantes d'un parcours (D4 : « Premium »). */
export function etapeVerrouilleeTexte(prixLabel: string): string {
  return `Cette étape fait partie de ${OFFRE_NOM}. La première étape est offerte, les suivantes viennent avec l'abonnement à ${prixLabel}, sans engagement.`;
}

// PROVISOIRE s16, étalon à valider
/** Étape 1 vue par un non-abonné (déclinaison de l'étalon 4.1 avec « Premium », D4). */
export const VALIDATION_ETAPE = {
  texte: `Valider l'étape fait partie de ${OFFRE_NOM}.`,
  // s21 : libellé du mur (lot 2, duel 1 validé), au lieu de « Voir l'offre Premium ».
  bouton: MUR_PREMIUM_BOUTON,
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
