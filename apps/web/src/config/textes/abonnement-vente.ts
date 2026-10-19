/**
 * Page de vente /abonnement, trajet de conversion s21 : SOURCE UNIQUE des textes de la page
 * (accroche, haut de page, avantages, formules, bouton, tableau, carnet, page d'attente).
 *
 * Source : `docs/copy/conversion-s21/textes-trajet-v1.md` (§1, §4) et ses « Arbitrages de
 * l'orchestrateur » (19/10), mot pour mot ; étalon A choisi par Thomas. Aucun nombre en dur :
 * prix, limites gratuites, nombre de parcours et étape gratuite lus à leur source.
 * Tout ce qui nomme la lettre hebdomadaire passe par `LETTRE_HEBDO_PROMESSE`.
 */
import {
  ESPACE_INSECABLE,
  FREE_JOKE_LIMIT,
  FREE_TIP_LIMIT,
  FREE_VIDEO_LIMIT,
  PARCOURS_COUNT,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_PRICE_LABEL,
  type PremiumPlan,
} from "@/config/premium";
import { LAST_FREE_PARCOURS_STEP } from "@/lib/parcours-access";
import { OFFRE_NOM } from "@/config/textes/offre";

/** Ordinal en lettres (« dixième ») pour les petites limites ; repli « 12e ». */
const ORDINAUX: Readonly<Record<number, string>> = {
  1: "première",
  2: "deuxième",
  3: "troisième",
  4: "quatrième",
  5: "cinquième",
  6: "sixième",
  7: "septième",
  8: "huitième",
  9: "neuvième",
  10: "dixième",
  15: "quinzième",
  20: "vingtième",
};
export const ordinal = (n: number): string => ORDINAUX[n] ?? `${n}e`;

/** « S'abonner · 2,99 €/mois » / « S'abonner · 24,99 €/an » : verbe d'achat (le clic mène au compte ou à Stripe). */
export const libelleSabonner = (plan: PremiumPlan = "monthly"): string =>
  `S’abonner${ESPACE_INSECABLE}· ${plan === "annual" ? PREMIUM_ANNUAL_PRICE_LABEL : PREMIUM_PRICE_LABEL}`;

/** Phrase d'objet des comptes connectés qui vont à Stripe sans avoir lu l'offre (accueil, profil). */
export const PHRASE_OBJET_CONNECTE = `${OFFRE_NOM} ouvre tout : le catalogue, les ${PARCOURS_COUNT} parcours, un carnet de répartie par mois.`;

/**
 * Accroche selon l'origine du clic (au-dessus du titre, reprend les mots du bouton cliqué).
 * Choix de l'accroche : `lib/abonnement-accroche.ts`. « Pour tout ouvrir » : porte générique
 * « Tout ouvrir · 2,99 €/mois » (arbitrage du 19/10, textes-trajet-v1 §3).
 */
export const ACCROCHES = {
  murVannes: "Pour la suite des vannes",
  murConseils: "Pour la suite des conseils",
  murVideos: "Pour la suite des vidéos",
  exerciceVanne: "Pour écrire ta vanne",
  exerciceConseil: "Pour essayer ce conseil",
  exerciceVideo: "Pour décrypter cette vidéo",
  carnet: "Pour tout le carnet",
  suiteParcours: (parcours: string) => `Pour la suite de ${parcours}`,
  tonParcours: (parcours: string) => `Pour ton parcours : ${parcours}`,
  recherche: "Pour tout voir",
  favoris: "Pour garder tes favoris",
  generique: "Pour tout ouvrir",
} as const;

/** B1 : titre, sous-titre (étalon A), preuve. */
export const ABONNEMENT_HAUT = {
  titre: `${OFFRE_NOM} ouvre tout Deviens Marrant`,
  /** « dixième » = rang de la dernière vanne gratuite de la liste (`FREE_JOKE_LIMIT`). */
  sousTitre: `Les listes ne s’arrêtent plus à la ${ordinal(FREE_JOKE_LIMIT)} vanne, les parcours vont au bout.`,
  preuve: `1${ESPACE_INSECABLE}500+ inscrits bossent leur humour.`,
} as const;

/* B2 : les avantages vivent dans `config/textes/avantages-premium.ts` (source unique). */

/** B2 : cartes de formule. */
export const FORMULES = {
  legende: "Choisis ta formule",
  mensuel: "Mensuel",
  annuel: "Annuel",
  suffixeMensuel: "TTC / mois",
  suffixeAnnuel: "TTC / an",
} as const;

/** B2 et B6 : bouton, ligne de suite, « Déjà un compte ? ». */
export const ABONNEMENT_ACHAT = {
  bouton: libelleSabonner,
  chargement: "On t’emmène au paiement…",
  suiteVisiteur: "Tu crées ton compte, puis tu paies par carte.",
  suiteConnecte: "Paiement sécurisé par Stripe",
  dejaCompte: "Déjà un compte ?",
  connecteToi: "Connecte-toi",
  nomCarte: `Offre ${OFFRE_NOM}`,
} as const;

/** B3 : tableau Gratuit / Premium. `cle` sert à la mise en avant selon l'origine du clic. */
export type LigneTableauCle = "listes" | "parcours" | "carnet" | "lettre" | "exercices" | "progression" | "favoris" | "quiz";
export interface LigneTableau {
  cle: LigneTableauCle;
  libelle: string;
  /** `true` = ✓ (texte masqué « inclus »), `false` = « Non », sinon le texte de la cellule. */
  gratuit: string | boolean;
  premium: string | boolean;
}

export const TABLEAU = {
  titre: `Gratuit et ${OFFRE_NOM}, côte à côte`,
  colonneLibelle: "Ce qui change",
  colonneGratuit: "Gratuit",
  colonnePremium: OFFRE_NOM,
  inclus: "inclus",
  non: "Non",
} as const;

/** Les lignes, dans l'ordre ; `carnetGratuit` = `CARNET_FREE_FICHES` (lib/carnet, lu côté serveur). */
export function lignesTableau({ carnet, carnetGratuit, lettre }: { carnet: boolean; carnetGratuit: number; lettre: boolean }): LigneTableau[] {
  return [
    { cle: "listes", libelle: "Listes : vannes, conseils, vidéos", gratuit: `${FREE_JOKE_LIMIT}, ${FREE_TIP_LIMIT} et ${FREE_VIDEO_LIMIT}`, premium: "Sans limite" },
    { cle: "parcours", libelle: "Parcours", gratuit: `Étape ${LAST_FREE_PARCOURS_STEP} de chacun`, premium: `Les ${PARCOURS_COUNT}, en entier` },
    ...(carnet
      ? [{ cle: "carnet" as const, libelle: "Carnet de répartie", gratuit: `${carnetGratuit} situation${carnetGratuit > 1 ? "s" : ""}`, premium: "Toutes les situations" }]
      : []),
    ...(lettre ? [{ cle: "lettre" as const, libelle: "Lettre par e-mail", gratuit: "1 par mois", premium: "Chaque semaine, si tu la veux" }] : []),
    { cle: "exercices", libelle: "Exercices des fiches", gratuit: false, premium: true },
    { cle: "progression", libelle: "Progression et série", gratuit: false, premium: true },
    { cle: "favoris", libelle: "Favoris", gratuit: false, premium: true },
    { cle: "quiz", libelle: "Quiz et vanne du jour", gratuit: true, premium: true },
  ];
}

/** B4 : amorce et ligne du reste autour de la fiche offerte du carnet. */
export const CARNET_VENTE = {
  amorce: "Un exemple de ce qui s’ajoute chaque mois.",
  reste: (n: number) => `Il en reste ${n}, toutes ouvertes avec ${OFFRE_NOM}.`,
} as const;

/** B5 : ligne sous le lien de l'étape 1 gratuite. */
export const PAS_ENCORE_SUR_SANS_COMPTE = "Sans compte.";

/** Page d'attente après inscription ou connexion (`auto=1`), à la place de la page de vente. */
export const ATTENTE_PAIEMENT = {
  titre: "Te voilà connecté.",
  texte: "On t’emmène au paiement…",
} as const;

/** Retour après paiement (`PremiumWelcome`) ; `lettre` seulement si la promesse est active. */
export const BIENVENUE_PREMIUM = {
  texte: "Tout est ouvert : les listes, les parcours, le carnet du mois. Reprends là où tu t’étais arrêté.",
  lettre: "Ta lettre de chaque semaine s’active depuis ton profil.",
} as const;
