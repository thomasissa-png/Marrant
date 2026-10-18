/**
 * Textes des encarts d'articles de blog (audit conversion s20, lot 1 : « montrer l'offre »).
 *
 * Textes de @copywriter (docs/copy/encarts-montrer-offre-s20.md) validés à l'aveugle :
 * docs/copy/relecture-videos-s20/verdict-encarts-offre-*.md (tours 1 et 2, 2 sur 3).
 *
 * Règles : tutoiement, zéro tiret cadratin, UTF-8, aucun prix écrit en dur
 * (le prix vient de config/premium.ts), aucun chiffre d'audience.
 *
 * Mécanique (placement, parcours par article) : config/blog-encarts.ts.
 *
 * s21 (lot 2, duel 2 validé à l'aveugle 3/3) : tous les boutons vers l'étape 1
 * gratuite disent « Lire la première étape gratuite de {parcours} »
 * (`etape1GratuiteBouton`), au lieu de « Étape 1 gratuite : {parcours} ».
 */
import { PREMIUM_PARCOURS } from "@/config/premium";
import type { ParcoursSlug } from "@/lib/entrees-parcours";
import { etape1GratuiteBouton } from "@/config/textes/entrees-parcours";

/**
 * Textes propres à un parcours : bloc de fin. s21 : l'encart au fil du texte est
 * `DemoVanne` (textes dans cta-articles-accueil.ts) ; anciens textes d'encart supprimés
 * à la fusion des parties A et B.
 */
export interface TextesParcoursBlog {
  /** Bloc de fin : titre et paragraphe par défaut (un article peut les surcharger). */
  finTitre: string;
  finTexte: string;
  /** Bouton contour du bloc de fin vers l'étape 1 gratuite. */
  finBoutonEtape1: string;
}

/** Durées tirées de config/premium.ts (jamais écrites en dur). */
const offre = (slug: string) => PREMIUM_PARCOURS.find((p) => p.slug === slug);
const minutes = (slug: string) => Number.parseInt(offre(slug)?.timePerWeek ?? "", 10);

export const TEXTES_PARCOURS_BLOG: Readonly<Record<ParcoursSlug, TextesParcoursBlog>> = {
  repartie: {
    finTitre: "Ces techniques, travaille-les dans un parcours guidé",
    // s20 : pas de paragraphe (la phrase de l'étalon 3.2c, contestée à l'aveugle, n'est pas reprise ici) ;
    // les deux puces sont les textes déjà en ligne de l'ancien encart Répartie.
    finTexte: "",
    finBoutonEtape1: etape1GratuiteBouton("repartie"),
  },
  "machine-a-cafe": {
    finTitre: "Sois drôle au bureau sans avoir l'air d'essayer",
    finTexte: `Des vannes courtes, le bon moment pour les placer et des anecdotes qu'on écoute jusqu'au bout, ${minutes("machine-a-cafe")} min par semaine.`,
    finBoutonEtape1: etape1GratuiteBouton("machine-a-cafe"),
  },
  confiance: {
    finTitre: "Reprends confiance, une conversation à la fois",
    finTexte: "Le parcours Confiance t'entraîne, étape après étape, à trouver ta place dans un groupe qui rit, sans personne pour te pousser sur scène.",
    finBoutonEtape1: etape1GratuiteBouton("confiance"),
  },
  storytelling: {
    finTitre: "Une anecdote, travaillée jusqu'à ce qu'on te la redemande",
    finTexte: `Le parcours Storytelling te fait retravailler une seule anecdote vraie, d'étape en étape, ${minutes("storytelling")} min par semaine.`,
    finBoutonEtape1: etape1GratuiteBouton("storytelling"),
  },
  boulot: {
    finTitre: "Ta vanne du lundi, sans te griller",
    finTexte: "Le parcours Boulot t'apprend à la sortir un cran à la fois, de la salle de réunion au toast. Chaque exercice a une version sans risque.",
    finBoutonEtape1: etape1GratuiteBouton("boulot"),
  },
};

/**
 * Bloc de fin unique. s21 (B2) : étape 1 gratuite en PLEIN, lien payant et note [S9]
 * dans config/textes/cta-articles-accueil.ts (BLOC_FIN) ; l'ancien bouton « Accéder aux
 * parcours complets » et l'ancienne note de prix sont remplacés.
 */
export const TEXTES_BLOC_FIN = {
  ariaLabel: "Aller plus loin",
  /** Petite ligne au-dessus du titre ; `{parcours}` = nom du parcours, `{semaines}` = durée. */
  surtitre: "Parcours {parcours} · {semaines} semaines",
  /** Abonné Premium : un seul bouton. */
  boutonAbonne: "Continuer mon parcours",
} as const;

/**
 * Surcharges du bloc de fin par article (titre, paragraphe, note). Article absent :
 * textes de config/blog-cta.ts s'il y en a, sinon ceux du parcours.
 */
export const BLOC_FIN_PAR_ARTICLE: Readonly<
  Partial<Record<string, { titre?: string; texte?: string; note?: string }>>
> = {
  // s21 : l'article n°1 a ses textes du tour 4 dans cta-articles-accueil.ts (BLOC_FIN.parArticle).
};
