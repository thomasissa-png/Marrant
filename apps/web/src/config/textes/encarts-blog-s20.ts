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
 * s21 concision v5 (textes-v5-a §3, mot pour mot) : même gabarit pour chaque parcours (titre,
 * une phrase, plein gratuit `GRATUIT_P`, « Sans compte. », lien `OUVRIR`). Répartie compris (QA v4
 * m-2). Textes-trajet-v3 S01 : plus de `GRATUIT_ACCUEIL` en fin d’article, le libellé du parcours partout.
 */
import type { ParcoursSlug } from "@/lib/entrees-parcours";
import { libelleGratuitParcours } from "@/config/textes/cta-articles-accueil";

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

export const TEXTES_PARCOURS_BLOG: Readonly<Record<ParcoursSlug, TextesParcoursBlog>> = {
  repartie: {
    finTitre: "Ces techniques, rode-les avant la prochaine pique",
    finTexte: "Quand on te chambre, tu as une seconde, et ça s’entraîne.",
    finBoutonEtape1: libelleGratuitParcours("repartie"),
  },
  "machine-a-cafe": {
    finTitre: "Sois drôle au bureau sans avoir l’air d’essayer",
    finTexte: "Des vannes courtes, et le bon moment pour les placer.",
    finBoutonEtape1: libelleGratuitParcours("machine-a-cafe"),
  },
  confiance: {
    finTitre: "Ta place dans un groupe qui rit",
    finTexte: "Personne ne te pousse sur scène : ça se joue entre amis.",
    finBoutonEtape1: libelleGratuitParcours("confiance"),
  },
  storytelling: {
    finTitre: "Une anecdote, travaillée jusqu’à ce qu’on te la redemande",
    finTexte: "Ton histoire vraie, resserrée étape après étape.",
    finBoutonEtape1: libelleGratuitParcours("storytelling"),
  },
  boulot: {
    finTitre: "Ta vanne du lundi, sans te griller",
    finTexte: "De la salle de réunion au pot de départ.",
    finBoutonEtape1: libelleGratuitParcours("boulot"),
  },
};

/** Bloc de fin unique : textes du visiteur dans cta-articles-accueil.ts (BLOC_FIN). */
export const TEXTES_BLOC_FIN = {
  ariaLabel: "Aller plus loin",
  /** Abonné Premium : un seul bouton. */
  boutonAbonne: "Continuer mon parcours",
} as const;

/**
 * Surcharges du bloc de fin par article (titre, paragraphe). Article absent :
 * textes de config/blog-cta.ts s'il y en a, sinon ceux du parcours.
 */
export const BLOC_FIN_PAR_ARTICLE: Readonly<Partial<Record<string, { titre?: string; texte?: string }>>> = {
  // s21 : l'article n°1 a ses textes du tour 4 dans cta-articles-accueil.ts (BLOC_FIN.parArticle).
};
