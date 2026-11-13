/**
 * Textes de « Quoi répondre », de la Bibliothèque, du coin « Humour noir, fait bien », des Lettres et de la
 * page d'une fiche (s24, lot D6 du plan `docs/espace-client/plan-developpement-s24.md`). Aucun texte neuf :
 * - rubriques, blocs, thèmes, « Écouter, repérer », « Comment c'est construit » : maquette validée
 *   `docs/espace-client/etalons/e5/bibliotheque.html` (étalon E5 v8) et architecture v20 (3.1, 6.2) ;
 * - filtres « Où et avec qui ? », « Pour quoi faire ? » et leurs valeurs : architecture v20 3.3 (table des
 *   univers pour « Commerces, voisins, transports ») ;
 * - « Ta situation n'est pas dans la liste ? », « Raconte-la à l'équipe » : architecture v20 2.6 ;
 * - « Le carnet du mois », « La lettre du jeudi 12 novembre » : libellés E5 (11) ; « 5 min » : libellé (29) ;
 *   « Voir », « Fait », « Réessayer » : architecture 2.7 ; « Vu dans la lettre du … » : architecture 2.8 ;
 * - coin : nom, phrase d'entrée et « Entrer » : étalon E6 (`docs/copy/etalon-e6-humour-noir-s24.md` §1) et
 *   architecture 3.12 ; « Sortir » : architecture 3.12 (bouton recommandé, plan lot D6) ;
 * - titres des sections d'une fiche : étalons E1.1, E2.1, E2.2, E3 (`docs/copy/etalons-espace-s24.md`),
 *   E6 §3, architecture 3.1 (« Ce qu'on aurait pu dire ») et 3.11 (étapes d'une séance) ;
 * - bilan : libellés E5 (27) et §5, maquette `mission.html#etat=bilan`.
 * La promesse « l'espace n'affiche jamais ce contenu sans le geste « Entrer » » n'est PAS écrite (porte G6 :
 * le repérage ne couvre pas encore toutes les vannes d'humour noir actives, `lib/espace/humour-noir.ts`).
 * Contrôle automatique : zéro tiret cadratin, zéro émoji (`__tests__/espace/bibliotheque-s24.test.tsx`).
 */
export const TEXTES_QUOI_REPONDRE = {
  titre: "Quoi répondre",
  filtreOu: "Où et avec qui ?",
  filtrePour: "Pour quoi faire ?",
  univers: {
    coloc: "Coloc",
    soiree: "Soirée",
    amis: "Amis",
    famille: "Famille",
    couple: "Couple",
    rencontre: "Rencontre",
    boulot: "Boulot",
    "reunion-entretien": "Réunion et entretien",
    "etudes-fac": "Études et fac",
    "messages-groupes": "Messages et groupes",
    "prise-de-parole": "Prise de parole",
    "commerces-voisins-transports": "Commerces, voisins, transports",
  },
  pourQuoiFaire: {
    desamorcer: "Désamorcer",
    "repondre-chambrage": "Répondre à un chambrage",
    "relancer-conversation": "Relancer une conversation",
    "rattraper-faux-pas": "Rattraper un faux pas",
    "prendre-la-parole": "Prendre la parole",
  },
  carnet: "Le carnet du mois",
  vide: "Ta situation n'est pas dans la liste ?",
  raconte: "Raconte-la à l'équipe",
  reessayer: "Réessayer",
} as const;

export const TEXTES_FICHE_LIGNE = {
  minutes: (n: number) => `${n} min`,
  voir: "Voir",
  fait: "Fait",
} as const;

export const TEXTES_BIBLIOTHEQUE = {
  titre: "Bibliothèque",
  blocVannes: "Vannes, conseils, vidéos",
  themesNom: "Thèmes",
  /** Ordre et noms de la maquette ; pages publiques existantes `/vannes/theme/[slug]` (aucune copie). */
  themes: [
    { slug: "boulot", label: "Boulot" },
    { slug: "couple", label: "Couple" },
    { slug: "soirees", label: "Soirées" },
    { slug: "famille", label: "Famille" },
    { slug: "autoderision", label: "Autodérision" },
    { slug: "dating", label: "Dating" },
    { slug: "gaming", label: "Gaming" },
  ],
  ecouter: "Écouter, repérer",
  blocTechniques: "Vocabulaire et techniques",
  /** Préfixe d'une ligne de fiche, « {type} : {titre} » (maquette). */
  prefixes: {
    construction: "Comment c'est construit",
    vocabulaire: "Vocabulaire",
    formule: "Formules à détourner",
    ecouter: "Écouter, repérer",
  },
} as const;

export const TEXTES_COIN = {
  titre: "Humour noir, fait bien",
  phrase: "Ici, on rit de sujets graves, avec ceux qui te connaissent.",
  entrer: "Entrer",
  sortir: "Sortir",
} as const;

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

export const TEXTES_LETTRES = {
  titre: "Lettres",
  /** « La lettre du jeudi 12 novembre » (libellé 11), date d'envoi à Paris. */
  titreLettre: (jour: { semaine: number; jour: number; mois: number }) =>
    `La lettre du ${JOURS[jour.semaine]} ${jour.jour === 1 ? "1er" : jour.jour} ${MOIS[jour.mois]}`,
  /** Ligne d'une fiche reprise d'une lettre (architecture 2.8). */
  vuDans: (titreLettre: string) => `Vu dans ${titreLettre.charAt(0).toLowerCase()}${titreLettre.slice(1)}`,
} as const;

/** Titres de section d'une fiche (étalons E1 à E3, E6, architecture 3.1 et 3.11). */
export const TEXTES_FICHE = {
  /** Repère au-dessus du titre : libellés vus par l'abonné (architecture 3.1). */
  types: {
    situation: "Quoi répondre",
    construction: "Comment c'est construit",
    vocabulaire: "Vocabulaire",
    formule: "Formules à détourner",
    ecouter: "Écouter, repérer",
    "a-plat": "Quand ça tombe à plat",
    jeu: "Jeux",
    bilan: "Bilan du parcours", // libellé (27)
    seance: "Séance de 20 minutes",
    "humour-noir": "Humour noir, fait bien",
  },
  scene: "La scène",
  commentChoisir: "Comment choisir",
  erreur: "L'erreur que tout le monde fait",
  schema: "Le schéma, en une ligne",
  exemple: "L'exemple",
  commentCestFait: "Comment c'est fait",
  essais: "Trois essais, un seul tient",
  regle: "La règle",
  dejaFaites: "Deux déjà faites",
  aToiDabord: "Trois à toi",
  versionPossible: "Voir une version possible",
  piege: "Le piège",
  limite: "La limite",
  suiteSansDetour: "Une suite qui ne détourne rien",
  enDeuxTemps: "En deux temps : ",
  aNePasConfondre: "À ne pas confondre avec : ",
  definitionComplete: "Définition complète",
  principe: "Le principe",
  siCaNePrendPas: "Si ça ne prend pas",
  ceQuOnAuraitPuDire: "Ce qu'on aurait pu dire",
  etapesSeance: { echauffement: "Échauffement", observation: "Observation", essai: "Essai", bilan: "Bilan" },
  /** Liens vers le catalogue public : nom de la rubrique existante. */
  rubriquesCatalogue: { vannes: "Vannes", conseils: "Conseils", videos: "Vidéos", glossaire: "Glossaire", blog: "Articles", parcours: "Parcours" },
} as const;

/** Bilan du parcours (libellés 27 et §5, maquette `mission.html#etat=bilan`). */
export const TEXTES_BILAN = {
  h1: "Bilan",
  eyebrow: "Bilan du parcours",
  titre: "Refais une situation",
  laquelle: "Laquelle ressortir ici ?",
  pasCelleLa: "Pas celle-là cette fois.",
  deuxiemeTour: (titre: string) => `La fiche « ${titre} » mérite un deuxième tour.`,
  lettres: ["A", "B", "C"],
} as const;
