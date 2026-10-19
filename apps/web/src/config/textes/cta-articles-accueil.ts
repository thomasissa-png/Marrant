/**
 * Blocs d'appel s21, partie A : éléments globaux, articles, accueil, en-tête.
 *
 * FICHIER UNIQUE des textes de la partie A : aucun texte de ces blocs n'est écrit en dur
 * dans un composant.
 *
 * Source : textes de la concision VALIDÉS à l'aveugle le 18/10/2026, version v5, mot pour mot
 * (`docs/copy/cta-s21/concision/textes-v5-a.md`, conventions §0 : REASS, OUVRIR, libellés uniques).
 *
 * Règles : tutoiement, zéro tiret cadratin, UTF-8. Aucun nombre écrit en dur : prix depuis
 * `config/premium.ts`, nombre de parcours depuis `PARCOURS_COUNT` / `PREMIUM_PARCOURS`,
 * titres d'étapes depuis `config/parcours-etapes.ts` (copie du seed vérifiée par un test),
 * annuel seulement si `isAnnualPlanAvailable()` (lu côté serveur, passé en paramètre ici).
 */
import {
  ESPACE_INSECABLE,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_PRICE_LABEL,
  formatEuros,
} from "@/config/premium";
import { OFFRE_NOM } from "@/config/textes/offre";
import { libelleSabonner, PHRASE_OBJET_CONNECTE } from "@/config/textes/abonnement-vente";
import { PARCOURS_NOMS, type ParcoursSlug } from "@/lib/entrees-parcours";

/**
 * Libellé de la section des articles (menu, pied de page, fil d'Ariane,
 * BreadcrumbList). [CHOIX UTILISATEUR] du 18/10/2026 : « Blog » devient
 * « Articles » ; l'adresse `/blog` et les slugs ne changent pas.
 */
export const LIBELLE_SECTION_ARTICLES = "Articles";

// ─── Briques communes (nombres lus à la source) ─────────────────────────────

/** « · » des libellés d'ouverture : espace insécable avant, le prix passe à la ligne avec lui. */
const POINT_MEDIAN = `${ESPACE_INSECABLE}· `;

/**
 * Porte générique vers /abonnement : « Tout ouvrir · 2,99 €/mois » (arbitrage du 19/10,
 * textes-trajet-v1 : Premium n'est pas que les parcours ; remplace l'ancien libellé qui ne nommait que les parcours).
 * Les portes contextuelles (« Voir la suite des vannes »…) gardent leur libellé. Un clic qui mène
 * au compte ou à Stripe dit l'acte : `libelleSabonner` (abonnement-vente.ts).
 */
export function libelleToutOuvrir(prix: string = PREMIUM_PRICE_LABEL): string {
  return `Tout ouvrir${POINT_MEDIAN}${prix}`;
}

/** `GRATUIT_ACCUEIL` : haut d'accueil, carte d'accueil, fin d'article générique (Répartie). */
export const GRATUIT_ACCUEIL = "Tester mes premières répliques, gratuit";

/** `GRATUIT_P` : « Tester l'étape 1 de {P}, gratuite », partout où le parcours est connu. */
export const libelleGratuitParcours = (slug: ParcoursSlug): string => `Tester l’étape 1 de ${PARCOURS_NOMS[slug]}, gratuite`;

/** « Sans compte. » : sous les pleins gratuits des surfaces froides (accueil, fin d'article, quiz). */
export const SANS_COMPTE = "Sans compte.";

// ─── En-tête ────────────────────────────────────────────────────────────────

/**
 * « Premium · 2,99 €/mois » vers `/abonnement?src=header`. `boutonCourt` : repli « Premium » de
 * textes-trajet-v1 §2 (trajet de conversion s21), car « Premium · 2,99 € » ne tient pas à côté du logo
 * et du menu (mesuré sur /conseils : page de 330 px à 320 px de large, 377 px à 360 et à 375 ; ordinateur
 * de 1 024 à 1 279 px : 1 055 px pour 1 024). Un prix sans objet n'est pas un libellé ; le prix est dans
 * le premier écran de /abonnement. Nom accessible : commence par le texte visible (WCAG 2.5.3).
 */
export const EN_TETE = {
  bouton: `${OFFRE_NOM}${POINT_MEDIAN}${PREMIUM_PRICE_LABEL}`,
  boutonCourt: OFFRE_NOM,
  nomAccessible: `${OFFRE_NOM}, ${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} par mois : voir l’offre`,
} as const;

// ─── Encart du milieu des articles ──────────────────────────────────────────

/**
 * `DemoVanne variante="milieu"`. La situation montrée est la fiche OFFERTE du carnet du mois
 * (`lib/carnet.ts`, champs `offerte` et `accroche`) : « offerte ce mois-ci » n'est vrai que pour elle.
 */
export const DEMO_VANNE = {
  surtitre: "Situation offerte ce mois-ci",
  /** Scène (donnée du carnet) : `accroche` de la fiche puis ce qu'on te dit. */
  situation: (accroche: string, onTeDit: string) => `${accroche}, et on te lance : « ${onTeDit} »`,
  question: "Tu réponds quoi ?",
  /** Ouvre la même fiche sur /carnet. */
  bouton: "Voir la réplique",
} as const;

// ─── Bloc de fin d'article ──────────────────────────────────────────────────

/**
 * `ArticleCta` (variante « fin ») : titre, une phrase, un plein gratuit, « Sans compte. », puis
 * le lien `OUVRIR`. Rien sous le lien (le prix et la garantie vivent sur /abonnement).
 */
export const BLOC_FIN = {
  /**
   * Plein gratuit quand le parcours de l'article n'est pas connu (ni table par slug, ni cluster) :
   * `GRATUIT_ACCUEIL`. Parcours connu : `GRATUIT_P` (`TEXTES_PARCOURS_BLOG[slug].finBoutonEtape1`),
   * Répartie compris (QA v4 m-2, règle du libellé unique §0). L'article n°1 garde le sien (`parArticle`).
   */
  boutonSansParcours: GRATUIT_ACCUEIL,
  noteSansCompte: SANS_COMPTE,
  /** Lien payant sous le plein : porte générique « Tout ouvrir ». */
  lienAbonnement: libelleToutOuvrir(),
  /** Surcharges par article (prioritaires sur config/blog-cta.ts et encarts-blog-s20.ts). */
  parArticle: {
    "meilleures-blagues-droles-2026": {
      titre: "La vanne dans ta bouche, pas dans ton téléphone",
      texte: "La placer à voix haute, ça s’entraîne.",
      /** Article n°1 validé (textes-v5-a §3) : libellé générique. */
      bouton: GRATUIT_ACCUEIL,
    },
  } as Readonly<Partial<Record<string, { titre?: string; texte?: string; bouton?: string }>>>,
} as const;

// ─── La lettre par e-mail en bas d'article ──────────────────────────────────

/** Formulaire en bas d'article, après le bloc de fin (bouton discret : `lettre-s21.ts`). */
export const LETTRE_ARTICLE = {
  titre: "Une vanne décryptée, chaque mois",
  phrase: ["Gratuite, par e-mail, avec un exercice."],
} as const;

// ─── Haut de l'accueil ──────────────────────────────────────────────────────

/** Titre (en dur dans hero-section.tsx), une phrase, une preuve, un plein gratuit, « Sans compte. ». */
export const ACCUEIL_HAUT = {
  intro: "Des vannes et des exercices pour répondre quand on te chambre.",
  /** Chiffre fixe validé par Thomas (29/09/2026). */
  preuve: `1${ESPACE_INSECABLE}500+ inscrits bossent leur humour.`,
  bouton: GRATUIT_ACCUEIL,
  note: SANS_COMPTE,
} as const;

// ─── Carte Premium de l'accueil ─────────────────────────────────────────────

/**
 * Visiteur : porte « Tout ouvrir » vers /abonnement?src=accueil-premium. Compte connecté sans
 * abonnement (paiement direct, trajet de conversion s21) : « S'abonner » et la phrase d'objet,
 * car il paie sans avoir lu l'offre. REASS sous le plein, puis le lien gratuit (étape 1 de Répartie).
 */
export const CARTE_PREMIUM = {
  titre: "Et si ton « j’aurais dû dire » devenait un « j’ai dit » ?",
  /** Phrase avant le bouton, visiteur. */
  phrase: "De la coloc à l’afterwork, de quoi répondre partout.",
  /** Phrase avant le bouton, compte connecté sans abonnement. */
  phraseConnecte: PHRASE_OBJET_CONNECTE,
  bouton: libelleToutOuvrir(),
  boutonConnecte: libelleSabonner(),
  contour: GRATUIT_ACCUEIL,
} as const;
