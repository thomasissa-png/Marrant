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
 */
import { PREMIUM_PARCOURS, PREMIUM_PRICE_LABEL } from "@/config/premium";
import type { ParcoursSlug } from "@/lib/entrees-parcours";

/** Encart au fil du texte (après une section H2, vers 35 à 45 % de l'article). */
export interface TexteEncartMilieu {
  /** Petite ligne au-dessus du titre. */
  surtitre: string;
  titre: string;
  texte: string;
  /** Bouton vers l'étape 1 gratuite du parcours. */
  bouton: string;
}

/** Textes propres à un parcours : encart au fil du texte + bloc de fin. */
export interface TextesParcoursBlog {
  encartMilieu: TexteEncartMilieu;
  /** Bloc de fin : titre et paragraphe par défaut (un article peut les surcharger). */
  finTitre: string;
  finTexte: string;
  /** Puces du bloc de fin (0 à 3). */
  finPuces: readonly string[];
  /** Bouton contour du bloc de fin vers l'étape 1 gratuite. */
  finBoutonEtape1: string;
}

/** Durées tirées de config/premium.ts (jamais écrites en dur). */
const offre = (slug: string) => PREMIUM_PARCOURS.find((p) => p.slug === slug);
const semaines = (slug: string) => offre(slug)?.weeks ?? 0;
const minutes = (slug: string) => Number.parseInt(offre(slug)?.timePerWeek ?? "", 10);
const nombreEnLettres = (n: number) => ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit"][n] ?? String(n);
const majuscule = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export const TEXTES_PARCOURS_BLOG: Readonly<Record<ParcoursSlug, TextesParcoursBlog>> = {
  repartie: {
    encartMilieu: {
      surtitre: "Parcours Répartie",
      titre: "Tu trouves la réplique dans le bus du retour ?",
      texte: "Lire des répliques, c'est un début. Le parcours Répartie t'entraîne à les sortir sur le moment, à ton rythme.",
      bouton: "Lire la première étape gratuite",
    },
    finTitre: "Ces techniques, travaille-les dans un parcours guidé",
    // s20 : pas de paragraphe (la phrase de l'étalon 3.2c, contestée à l'aveugle, n'est pas reprise ici) ;
    // les deux puces sont les textes déjà en ligne de l'ancien encart Répartie.
    finTexte: "",
    finPuces: [
      `Une étape par semaine, environ ${minutes("repartie")} minutes`,
      "Des situations que tu connais : le chambrage entre potes, la pique en TD, le raté à rattraper",
    ],
    finBoutonEtape1: "Étape 1 gratuite : Répartie",
  },
  "machine-a-cafe": {
    encartMilieu: {
      surtitre: "Parcours Machine à Café",
      titre: "La pause café mérite mieux que « Ça va ? »",
      texte: `Des vannes courtes, le bon moment pour les placer, et un week-end raconté pour qu'on te demande la suite. En ${minutes("machine-a-cafe")} min par semaine.`,
      bouton: "Étape 1 gratuite : Machine à Café",
    },
    finTitre: "Sois drôle au bureau sans avoir l'air d'essayer",
    finTexte: `Des vannes courtes, le bon moment pour les placer et des anecdotes qu'on écoute jusqu'au bout, ${minutes("machine-a-cafe")} min par semaine.`,
    finPuces: [],
    finBoutonEtape1: "Étape 1 gratuite : Machine à Café",
  },
  confiance: {
    encartMilieu: {
      surtitre: "Parcours Confiance",
      titre: "Pas besoin d'être drôle pour commencer",
      texte: "Observation, autodérision, place en groupe : tu reprends tout à ton rythme, sans personne pour te pousser sur scène.",
      bouton: "Étape 1 gratuite : Confiance",
    },
    finTitre: "Reprends confiance, une conversation à la fois",
    finTexte: "Le parcours Confiance t'entraîne, étape après étape, à trouver ta place dans un groupe qui rit, sans personne pour te pousser sur scène.",
    finPuces: [],
    finBoutonEtape1: "Étape 1 gratuite : Confiance",
  },
  storytelling: {
    encartMilieu: {
      surtitre: "Parcours Storytelling",
      titre: "« Et donc ? » : apprends à ne plus perdre ta table",
      texte: `Coupe, personnages, chute, détour, détail qui revient : ${semaines("storytelling")} semaines sur une seule anecdote vraie, la tienne.`,
      bouton: "Étape 1 gratuite : Storytelling",
    },
    finTitre: "Une anecdote, travaillée jusqu'à ce qu'on te la redemande",
    finTexte: `Le parcours Storytelling te fait retravailler une seule anecdote vraie, d'étape en étape, ${minutes("storytelling")} min par semaine.`,
    finPuces: [],
    finBoutonEtape1: "Étape 1 gratuite : Storytelling",
  },
  boulot: {
    encartMilieu: {
      surtitre: "Parcours Boulot",
      titre: "Sortir une vanne au boulot sans te griller",
      texte: `Tu commences par observer une salle de réunion sans rien dire, et tu finis par un toast. ${majuscule(nombreEnLettres(semaines("boulot")))} semaines, ${minutes("boulot")} minutes par semaine.`,
      bouton: "Étape 1 gratuite : Boulot",
    },
    finTitre: "Ta vanne du lundi, sans te griller",
    finTexte: "Le parcours Boulot t'apprend à la sortir un cran à la fois, de la salle de réunion au toast. Chaque exercice a une version sans risque.",
    finPuces: [],
    finBoutonEtape1: "Étape 1 gratuite : Boulot",
  },
};

/**
 * Les 2 encarts imposés de l'article n°1 (`meilleures-blagues-droles-2026`).
 * Clés référencées par config/blog-encarts.ts (ENCARTS_IMPOSES).
 */
export const ENCARTS_ARTICLE_1 = {
  repartie: {
    surtitre: "Parcours Répartie",
    titre: "Et quand c'est toi qu'on chambre ?",
    texte: "Une vanne se choisit à l'avance. Une réplique se trouve sur le moment, et le parcours Répartie t'y entraîne.",
    bouton: "Lire la première étape gratuite",
  },
  boulot: {
    surtitre: "Parcours Boulot",
    titre: "Drôle le samedi, ton de compte rendu le lundi ?",
    texte: "Ces vannes de bureau, tu peux les sortir. Le parcours Boulot t'apprend à le faire sans cibler personne et sans te griller.",
    bouton: "Étape 1 gratuite : Boulot",
  },
} as const satisfies Record<string, TexteEncartMilieu>;

export type CleEncartArticle1 = keyof typeof ENCARTS_ARTICLE_1;

/** Bloc de fin unique (étape 1 gratuite en contour, puis Premium en principal). */
export const TEXTES_BLOC_FIN = {
  ariaLabel: "Aller plus loin",
  /** Petite ligne au-dessus du titre ; `{parcours}` = nom du parcours, `{semaines}` = durée. */
  surtitre: "Parcours {parcours} · {semaines} semaines",
  boutonPremium: "Accéder aux parcours complets",
  note: `${PREMIUM_PRICE_LABEL}, sans engagement. Cet article reste en lecture libre.`,
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
  // Étalon 3.1 : titre et note gardés (config/blog-cta.ts) ; sa phrase « Les parcours complets… »
  // écartée à l'aveugle (3/3, pluriel incohérent avec un bloc Répartie) : les puces Répartie la remplacent.
  "meilleures-blagues-droles-2026": { texte: "" },
};
