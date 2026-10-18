/**
 * Blocs d'appel s21, partie A : éléments globaux, articles, accueil, en-tête.
 *
 * FICHIER UNIQUE des textes de la partie A (règle d'architecture de
 * l'intégration s21) : aucun texte de ces blocs n'est écrit en dur dans un
 * composant. Le remplacement des textes après le tour 5
 * (`docs/copy/cta-s21/tour5/textes-finaux-12.md`) se fait ICI et nulle part
 * ailleurs.
 *
 * Source actuelle : gagnants du tour 4 (`docs/copy/cta-s21/tour4/pack-12-tour4.md`,
 * clés `cles-pack12-tour4.md`, votes `resultats-tour4.md`, points @fullstack
 * `annexe-pack12-tour4.md`). Forme et place : `docs/design/cta-forme-place-s21.md`.
 *
 * Règles : tutoiement, zéro tiret cadratin, UTF-8. Aucun nombre écrit en dur :
 * prix depuis `config/premium.ts` (prix de l'offre Stripe affichée), nombre de
 * parcours depuis `PARCOURS_COUNT` / `PREMIUM_PARCOURS`, annuel seulement si
 * `isAnnualPlanAvailable()` (lu côté serveur, passé en paramètre ici).
 */
import {
  PARCOURS_COUNT,
  PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_PARCOURS,
  PREMIUM_PRICE_LABEL,
  formatEuros,
} from "@/config/premium";
import { REASSURANCE_PAIEMENT } from "@/config/textes/offre";

/**
 * Libellé de la section des articles (menu, pied de page, fil d'Ariane,
 * BreadcrumbList). [CHOIX UTILISATEUR] du 18/10/2026 : « Blog » devient
 * « Articles » ; l'adresse `/blog` et les slugs ne changent pas.
 */
export const LIBELLE_SECTION_ARTICLES = "Articles";

/**
 * B6, bouton d'en-tête (visiteur) : gagnant du tour 4 (A, 2 voix sur 3) « 2,99 €/mois »,
 * construit depuis le prix (espace insécable avant « € », `formatEuros`).
 * Destination : `/abonnement?src=header`. Nom accessible : le libellé visible d'abord
 * (WCAG 2.5.3), puis ce que fait le lien (annexe tour 4 §6 : « Voir les prix de Premium »).
 * « Voir les prix » reste le repli si le test sur le trafic réel le donne gagnant.
 */
export const EN_TETE = {
  bouton: PREMIUM_PRICE_LABEL,
  nomAccessible: `${PREMIUM_PRICE_LABEL} : voir les prix de Premium`,
} as const;

/**
 * B1, encart du milieu des articles (`DemoVanne variante="milieu"`) : gagnant du tour 4
 * (A, 3 voix sur 3). La situation montrée est la fiche OFFERTE du carnet du mois
 * (`lib/carnet.ts`, champs `offerte` et `accroche`) : « Gratuit, sans compte » n'est
 * vrai que pour elle. Pas de « Pourquoi ça marche » ici : la réplique se lit au clic.
 */
export const DEMO_VANNE = {
  /** [S1] */
  surtitre: "Une situation de répartie",
  /** [S2] : `accroche` de la fiche puis ce qu'on te dit. */
  situation: (accroche: string, onTeDit: string) => `${accroche}, et on te lance : « ${onTeDit} »`,
  /** [S3] */
  question: "Tu réponds quoi ?",
  /** [S6] : ouvre la même fiche sur /carnet. */
  bouton: "Voir la réplique",
  /**
   * [S7] : la seconde phrase seulement si le carnet compte d'autres situations
   * (annexe tour 4 §5, point 4).
   */
  note: (autresSituations: boolean) =>
    `Gratuit, sans compte : la réplique, pourquoi elle marche et une sortie polie si ça se tend.${
      autresSituations ? " Les autres situations, nouvelles chaque mois, sont dans Premium, l'abonnement du site." : ""
    }`,
} as const;

/**
 * Lien payant des blocs d'appel (B2, B3) : « Débloquer les 5 parcours, 2,99 €/mois »
 * (correction 1 de Thomas, tour 4). Nombre depuis PARCOURS_COUNT ; repli « tous les
 * parcours » si le compte tombe à 1 ou 0 (annexe tour 4 §2).
 */
export function lienDebloquerParcours(count: number = PARCOURS_COUNT): string {
  const quoi = count >= 2 ? `les ${count} parcours` : "tous les parcours";
  return `Débloquer ${quoi}, ${PREMIUM_PRICE_LABEL}`;
}

/** Minutes par semaine d'un parcours (config/premium.ts, jamais écrites en dur). */
const minutesParSemaine = (slug: string) =>
  Number.parseInt(PREMIUM_PARCOURS.find((p) => p.slug === slug)?.timePerWeek ?? "", 10);

/** « Premium, l'abonnement du site : 2,99 € TTC par mois[, ou 24,99 € TTC par an (2,08 € par mois)]. » */
function prixPremiumTtc(annuelDisponible: boolean): string {
  const mensuel = `${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} TTC par mois`;
  const annuel = `, ou ${formatEuros(PREMIUM_ANNUAL_PRICE_CENTS)} TTC par an (${formatEuros(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS)} par mois)`;
  return `Premium, l'abonnement du site : ${mensuel}${annuelDisponible ? annuel : ""}.`;
}

/**
 * B2, bloc de fin d'article (`ArticleCta`, spec §2.5 variante « fin », sans objet vanne) :
 * gagnant du tour 4 (A, 3 voix sur 3). Un seul plein (étape 1 gratuite), le lien payant
 * dessous, puis la note [S9]. Plus de puces.
 */
export const BLOC_FIN = {
  /**
   * [S6] : bouton plein de l'étape 1, par parcours. Répartie : texte du tour 4 (l'étape 1
   * s'appelle « Tes premières répliques ») ; autres parcours : libellé E5 du lot 2
   * (`etape1GratuiteBouton`), inchangé.
   */
  boutonEtape1: { repartie: "Tester mes premières répliques, gratuit" } as Readonly<Partial<Record<string, string>>>,
  /** Lien payant sous le plein. */
  lienAbonnement: lienDebloquerParcours(),
  /** [S9] : annuel seulement si `isAnnualPlanAvailable()`. */
  note: (annuelDisponible: boolean) => `${prixPremiumTtc(annuelDisponible)} ${REASSURANCE_PAIEMENT}`,
  /**
   * Surcharges par article (prioritaires sur config/blog-cta.ts et encarts-blog-s20.ts).
   * Article n°1 : [S8] titre, [S5'] scène propre au bloc (« cinquante vannes » : l'article
   * en compte cinquante ; à paramétrer si le texte est repris ailleurs), [S9] note.
   */
  parArticle: {
    "meilleures-blagues-droles-2026": {
      titre: "Quand on te chambre et que rien ne sort",
      texte:
        `Tu viens de lire cinquante vannes. Il reste la seconde qui compte, celle où la bonne doit sortir de ta bouche et pas de ton téléphone. Une étape par semaine, ${minutesParSemaine("repartie")} minutes : tes premières répliques, le rythme et les silences, retourner les piques avec le sourire, rebondir quand une vanne tombe à plat. À chaque étape, un défi à tenter.`,
      noteS9: true,
    },
  } as Readonly<Partial<Record<string, { titre?: string; texte?: string; noteS9?: boolean }>>>,
} as const;

/**
 * B18, la lettre en bas d'article (formulaire complet, rang 4) : gagnant du tour 4
 * (A, 3 voix sur 3). Titre et note identiques dans les deux textes du duel ; sous-titre A
 * avec la vanne du numéro 3 (statut VALIDE, mot pour mot). Avant le premier envoi
 * (05/11/2026) on garde cette vanne ; ensuite, afficher la dernière vanne DÉJÀ envoyée.
 * La ligne repliée du milieu ([S36]) n'est PAS posée : elle attend l'accord de Thomas.
 */
export const LETTRE_ARTICLE = {
  titre: "La vanne du mois et pourquoi elle marche",
  phrase: [
    "Un e-mail par mois. Ça donne, par exemple : « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. »",
    "Tu reçois aussi ce qui la fait marcher, puis un exercice en trois étapes pour écrire la tienne, avec son exemple. À la fin, une lecture à suivre et un mot sur Premium, notre abonnement.",
  ],
  reassurance: "Gratuit, sans compte. Désinscription en un clic.",
} as const;
