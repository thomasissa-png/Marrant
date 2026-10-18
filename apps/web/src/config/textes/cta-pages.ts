/**
 * Blocs d'appel s21, partie B : murs des listes (B7), fiches vanne, conseil et
 * vidéo (B8 à B10), fenêtre Premium (B11), quiz d'humour (B12), quiz
 * d'orientation (B13), fin d'étape 1 (B14), /parcours (B15), /abonnement (B16)
 * et /register (B17).
 *
 * SOURCE UNIQUE des textes de ces blocs : aucun texte en dur dans les composants.
 *
 * Source : textes finaux VALIDÉS du 18/10/2026 (`docs/copy/cta-s21/textes-finaux-valides.md`) :
 * B7, B8, B9, B11, B13 à B17 inchangés depuis le tour 13 ; B10 `[S15]` du tour 21 ; B12 du tour 17.
 *
 * Les nombres viennent de leur source : PARCOURS_COUNT et PREMIUM_PARCOURS
 * (config/premium.ts), titres d'étapes et lignes de carte (config/parcours-etapes.ts,
 * copie du seed vérifiée par un test), prix de l'offre (config/premium.ts, mêmes
 * montants que Stripe), annuel seulement si `isAnnualPlanAvailable()` (passé en
 * paramètre `annuel` : lu côté serveur, jamais deviné côté client).
 * « · » des boutons : espace insécable avant, le prix passe à la ligne avec lui.
 */
import {
  ESPACE_INSECABLE,
  formatEuros,
  FREE_JOKE_LIMIT,
  FREE_TIP_LIMIT,
  FREE_VIDEO_LIMIT,
  PARCOURS_COUNT,
  PARCOURS_MAX_WEEKS,
  PARCOURS_MIN_WEEKS,
  PREMIUM_ANNUAL_EQUIVALENT_LABEL,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_PARCOURS,
  PREMIUM_PRICE_LABEL,
  type PremiumPlan,
} from "@/config/premium";
import { ligneCarte, minusculeInitiale, PARCOURS_ETAPES, titreEtape } from "@/config/parcours-etapes";
import {
  CARTE_PREMIUM,
  colocAfterworkVrai,
  DUREE_ETAPES,
  libelleOuvrirParcours,
  libelleOuvrirUnParcours,
} from "@/config/textes/cta-articles-accueil";
import type { HumorProfileType } from "@/components/quiz/quiz-data";
import { PARCOURS_NOMS, type ParcoursSlug } from "@/lib/entrees-parcours";
import { listeFr } from "@/lib/liste-fr";

// ─── Briques communes (nombres lus à la source) ─────────────────────────────

const MENSUEL_TTC = `${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} TTC par mois`;
const ANNUEL_TTC = `${formatEuros(PREMIUM_ANNUAL_PRICE_CENTS)} TTC par an`;
const GARANTIE = "Tu as 14 jours pour te faire rembourser ton premier paiement.";

/** `{AUTRES}` = PARCOURS_COUNT - 1. */
const AUTRES = PARCOURS_COUNT - 1;

/** `{D}` : minutes par semaine d'un parcours (« 20 min/semaine » → 20). */
function minutesParcours(slug: ParcoursSlug): number {
  const p = PREMIUM_PARCOURS.find((x) => x.slug === slug);
  return p ? Number.parseInt(p.timePerWeek, 10) : 20;
}

/** `{N}` : nombre d'étapes d'un parcours. */
function etapesParcours(slug: ParcoursSlug): number {
  return PREMIUM_PARCOURS.find((x) => x.slug === slug)?.weeks ?? PARCOURS_ETAPES[slug].titres.length;
}

/** « 2 à 4 », ou « 2 et 3 » pour un parcours de 3 étapes. */
function etapesPayantes(slug: ParcoursSlug): string {
  const n = etapesParcours(slug);
  return n === 3 ? "2 et 3" : `2 à ${n}`;
}

/** Formule de résiliation : « en ligne » (LP-A, blocs validés B7 et B14) ou « depuis ton profil » (LP-A2, B8 à B10). */
export type FormuleResiliation = "en-ligne" | "profil";

/**
 * LP-A / LP-M (B7 `[S26]`, B14 `[S16]`) et LP-A2 / LP-M2 (B8 à B10 `[S16]`). La demi-ligne
 * annuelle n'existe que si l'offre annuelle est disponible.
 */
export function lignePrixGarantie(annuel: boolean, formule: FormuleResiliation = "en-ligne"): string {
  const prix = annuel ? `${MENSUEL_TTC}, ou ${ANNUEL_TTC} (${PREMIUM_ANNUAL_EQUIVALENT_LABEL}).` : `${MENSUEL_TTC}.`;
  const resiliation = formule === "profil" ? "Résiliable depuis ton profil quand tu veux." : "Résiliable en ligne quand tu veux.";
  return `${prix} ${resiliation} ${GARANTIE}`;
}

// ─── B7. Murs des listes /vannes, /conseils, /videos (validé) ───────────────

export type ListeMur = "vannes" | "conseils" | "videos";

/** Parcours de l'étape gratuite proposée en contour sous les murs. */
export const MUR_PARCOURS: ParcoursSlug = "repartie";

const AVEC_PREMIUM_FIN = `${PARCOURS_COUNT} parcours pour t'entraîner, une étape par semaine (de ${DUREE_ETAPES})`;

export const MUR_LISTE: Readonly<
  Record<
    ListeMur,
    {
      /** [S21] après la dernière carte gratuite. */
      limite: string;
      /** [S22] phrase entière, lien vers /abonnement, toujours lue après [S21]. */
      filtres: string;
      /** [S23] titre de la carte. */
      titre: string;
      /** [S24] ce qu'il y a derrière, en usage. */
      texte: string;
      /** Plein vers /abonnement?src=mur-<liste>. */
      bouton: string;
      /** [S25] contour vers l'étape 1, gabarit (a) « Étape 1 de {P}, gratuite : … ». */
      contour: (slug: ParcoursSlug) => string;
    }
  >
> = {
  vannes: {
    limite: `Voilà les ${FREE_JOKE_LIMIT} premières vannes. La suite est juste en dessous, dans Premium.`,
    filtres: "Tu y trouves aussi le filtre par catégorie, pour aller droit à celles qu'il te faut.",
    titre: "Et si la prochaine vanne qui fait rire la table était la tienne ?",
    texte: `Avec Premium : toute la liste, l'exercice « À toi de jouer » sous chaque vanne pour écrire la tienne, tes favoris, et ${AVEC_PREMIUM_FIN}.`,
    bouton: "Voir la suite des vannes avec Premium",
    contour: (slug) => `Étape 1 de ${PARCOURS_NOMS[slug]}, gratuite : 5 vannes et un défi`,
  },
  conseils: {
    limite: `Voilà les ${FREE_TIP_LIMIT} premiers conseils. La suite est juste en dessous, dans Premium.`,
    filtres: "Tu y trouves aussi les filtres par niveau et par catégorie, pour aller droit à ceux qu'il te faut.",
    titre: "Et si la bonne réplique sortait sur le moment, pas trois heures après ?",
    texte: `Avec Premium : toute la liste, l'exercice « À toi de jouer » de chaque conseil pour l'essayer, tes favoris, et ${AVEC_PREMIUM_FIN}.`,
    bouton: "Voir la suite des conseils avec Premium",
    contour: (slug) => `Étape 1 de ${PARCOURS_NOMS[slug]}, gratuite : un conseil et un défi`,
  },
  videos: {
    limite: `Voilà les ${FREE_VIDEO_LIMIT} premières vidéos. La suite est juste en dessous, dans Premium.`,
    filtres: "Tu y trouves aussi les filtres par niveau et par catégorie, pour aller droit à celles qu'il te faut.",
    titre: "Tu les regardes pour rire. Et si tu les regardais pour faire rire ?",
    texte: `Avec Premium : toute la liste, les points clés et l'exercice de chaque vidéo, tes favoris, et ${AVEC_PREMIUM_FIN}.`,
    bouton: "Voir la suite des vidéos avec Premium",
    contour: (slug) => `Étape 1 de ${PARCOURS_NOMS[slug]}, gratuite : 2 vidéos et un défi`,
  },
};

/** Lien court sur les cartes verrouillées (même destination que le plein). */
export const MUR_CARTE_LIEN = "Voir Premium";

// ─── B8 à B10. Fiches vanne, conseil, vidéo ─────────────────────────────────

export type FicheType = "vanne" | "conseil" | "video";

export const BLOC_EXERCICE: Readonly<
  Record<
    FicheType,
    {
      /** [S14] */
      titre: string;
      /** [S15] en une seule `<p>`. */
      texte: string;
      bouton: string;
      /** [S25] contour, gabarit (b) « Gratuit : …, étape 1 de {P} ». */
      contour: (slug: ParcoursSlug) => string;
      toutVoir: string;
      toutVoirHref: string;
    }
  >
> = {
  vanne: {
    titre: "Et si demain, c'était la tienne qu'on se répétait ?",
    texte: `La mécanique, tu l'as. Reste à écrire ta version, celle que tu auras envie de sortir à la prochaine soirée. L'exercice « À toi de jouer » est fait pour ça : une consigne, un exemple, la même technique que cette vanne. Il est dans Premium, l'abonnement du site, qui ouvre aussi les ${PARCOURS_COUNT} parcours en entier. Et tes favoris te gardent celle-ci sous la main.`,
    bouton: "Écrire la mienne avec Premium",
    contour: (slug) => `Gratuit : 5 vannes et un défi, étape 1 de ${PARCOURS_NOMS[slug]}`,
    toutVoir: "Voir d'autres vannes",
    toutVoirHref: "/vannes",
  },
  conseil: {
    titre: "Essaie-le avant le soir où il te servira",
    texte: `À froid, rater ne coûte rien : c'est tout l'intérêt de l'exercice « À toi de jouer ». Une consigne pour démarrer, un exemple à réutiliser le moment venu. Il est dans Premium, l'abonnement du site, qui ouvre aussi les ${PARCOURS_COUNT} parcours en entier. Et tes favoris te gardent ce conseil sous la main.`,
    bouton: "Essayer ce conseil avec Premium",
    contour: (slug) => `Gratuit : un défi à tenter et 5 vannes, étape 1 de ${PARCOURS_NOMS[slug]}`,
    toutVoir: "Voir d'autres conseils",
    toutVoirHref: "/conseils",
  },
  // B10 : `[S15]` du tour 21. « , de la coloc à l'afterwork » : même condition que OUVRIR_ACCUEIL.
  video: {
    titre: "Faire rire une salle, c'est son métier. Toi, une table te suffit",
    texte: `Et ça s'entraîne, à petites doses. Avec Premium, l'abonnement du site, tu as les points clés de cette vidéo et son exercice : de quoi la revoir pour faire rire, plus seulement pour rire. Les ${PARCOURS_COUNT} parcours s'ouvrent aussi en entier${colocAfterworkVrai() ? ", de la coloc à l'afterwork" : ""} : ${DUREE_ETAPES} par semaine, un défi à chaque étape.`,
    bouton: "Décrypter cette vidéo avec Premium",
    contour: (slug) => `Gratuit : 2 vidéos et un défi, étape 1 de ${PARCOURS_NOMS[slug]}`,
    toutVoir: "Voir d'autres vidéos",
    toutVoirHref: "/videos",
  },
};

/** Titre du bloc pour un abonné (l'exercice s'affiche, aucun bouton). */
export const BLOC_EXERCICE_ABONNE_TITRE = "À toi de jouer";

// ─── B11. Fenêtre Premium, par geste (validé) ───────────────────────────────

/** Geste qui ouvre la fenêtre. `carte` = carte floutée d'une liste. */
export type GesteFenetre = "favori" | "vote" | "carte";

export interface TexteFenetre {
  titre: string;
  intro: string;
  /** Intro pour un compte connecté (s21 QA v3 m-2) : sans « Deux étapes… », il va droit au paiement. */
  introCompte: string;
  /** [S27] avantage du geste, 90 caractères au plus (deux lignes à 375 px). */
  avantage: string;
  bouton: string;
}

/** Intro composée : deux phrases communes + `{OBJET}` ; la première est pour le visiteur seulement. */
const introFenetre = (objet: string): Pick<TexteFenetre, "intro" | "introCompte"> => {
  const introCompte = `Et si tu fermes, ${objet} reste là.`;
  return { intro: `Deux étapes : ton compte, puis le paiement sécurisé. ${introCompte}`, introCompte };
};

const AVANTAGE_FAVORI = `Avec Premium : tes favoris, l'exercice de chaque fiche et les ${PARCOURS_COUNT} parcours en entier.`;

const VOTE_FENETRE: TexteFenetre = {
  titre: "Pour voter, il ne te manque que Premium",
  ...introFenetre("la page"),
  avantage: `Avec Premium : ton vote, tes favoris et les ${PARCOURS_COUNT} parcours en entier.`,
  bouton: "Je m'abonne et je vote",
};

const carte = (avantage: string): TexteFenetre => ({
  titre: "Le reste de la liste est juste derrière",
  ...introFenetre("la liste"),
  avantage,
  bouton: "Je m'abonne et j'ouvre toute la liste",
});

/** Un titre, une intro, un avantage et un bouton par geste, déclinés pour vanne, conseil et vidéo. */
export const FENETRE_PREMIUM: Readonly<Record<GesteFenetre, Readonly<Record<FicheType, TexteFenetre>>>> = {
  favori: {
    vanne: {
      titre: "Garde-la pour le soir où tu en auras besoin",
      ...introFenetre("la vanne"),
      avantage: AVANTAGE_FAVORI,
      bouton: "Je m'abonne et je la garde",
    },
    conseil: {
      titre: "Garde-le pour le soir où tu en auras besoin",
      ...introFenetre("le conseil"),
      avantage: AVANTAGE_FAVORI,
      bouton: "Je m'abonne et je le garde",
    },
    video: {
      titre: "Garde-la sous le coude",
      ...introFenetre("la vidéo"),
      avantage: AVANTAGE_FAVORI,
      bouton: "Je m'abonne et je la garde",
    },
  },
  vote: { vanne: VOTE_FENETRE, conseil: VOTE_FENETRE, video: VOTE_FENETRE },
  carte: {
    vanne: carte(`Avec Premium : toute la liste, un exercice par vanne, le filtre et les ${PARCOURS_COUNT} parcours.`),
    conseil: carte(`Avec Premium : toute la liste, un exercice par conseil, les filtres et les ${PARCOURS_COUNT} parcours.`),
    video: carte(`Avec Premium : toute la liste, points clés et exercice par vidéo, et les ${PARCOURS_COUNT} parcours.`),
  },
};

/** Ligne de prix de la fenêtre (« 2,99 € TTC / mois ») : montant en gros, suffixe en petit. */
export const FENETRE_PRIX = { montant: formatEuros(PREMIUM_MONTHLY_PRICE_CENTS), suffixe: "TTC / mois" } as const;

/** Bouton pendant l'ouverture du paiement (compte connecté). */
export const FENETRE_CHARGEMENT = "On t'emmène au paiement…";

/** Ligne de garantie finale de la fenêtre (inchangée). */
export const FENETRE_GARANTIE =
  "Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux.";

/** [S28] lien discret vers l'étape 1 gratuite. */
export const fenetreLienEtape1 = (slug: ParcoursSlug): string =>
  `Ou lire d'abord l'étape 1 du parcours ${PARCOURS_NOMS[slug]} (gratuite, sans compte)`;

// ─── B12. Résultat du quiz d'humour (version du tour 17, validée) ───────────

/**
 * `{PHRASE_PROFIL}` : par profil, le parcours de la table, le rang du module cité et la phrase.
 * Le titre (`{ETAPE_PROFIL}`) se lit dans la donnée, le rang s'écrit « 2e », « 3e ».
 */
const PHRASES_PROFIL: Readonly<
  Partial<Record<HumorProfileType, { parcours: ParcoursSlug; rang: number; phrase: (etape: string, rang: string, p: string) => string }>>
> = {
  OBSERVATEUR: {
    parcours: "confiance",
    rang: 3,
    phrase: (e, r, p) => `Ce que tu remarques et que personne ne voit a son étape : « ${e} », la ${r} de ${p}.`,
  },
  STORYTELLER: {
    parcours: "storytelling",
    rang: 4,
    phrase: (e, r, p) => `Les autres attendent la suite, et ta chute a son étape : « ${e} », la ${r} de ${p}.`,
  },
  ABSURDE: {
    parcours: "machine-a-cafe",
    rang: 2,
    phrase: (e, r, p) =>
      `Tes idées, personne ne les voit venir. Le moment de les lancer a son étape : « ${e} », la ${r} de ${p}, où tu écoutes un groupe comme un morceau pour repérer où il y a de la place pour toi.`,
  },
  PUNCHLINEUR: {
    parcours: "repartie",
    rang: 2,
    phrase: (e, r, p) => `La seconde où la table se tait avant de rire a son étape : « ${e} », la ${r} de ${p}.`,
  },
  TAQUIN: {
    parcours: "repartie",
    rang: 3,
    phrase: (e, r, p) => `Les balles que tu renvoies ont leur étape : « ${e} », la ${r} de ${p}.`,
  },
};

/**
 * `{PHRASE_PROFIL}` ou `null` (repli) : clé (profil, parcours) absente de la table, parcours
 * non publié ou module cité introuvable. Jamais de titre inventé.
 */
export function phraseProfil(profil: HumorProfileType, slug: ParcoursSlug): string | null {
  const ligne = PHRASES_PROFIL[profil];
  if (!ligne || ligne.parcours !== slug || !PREMIUM_PARCOURS.some((p) => p.slug === slug)) return null;
  const etape = titreEtape(slug, ligne.rang);
  if (!etape || ligne.rang > etapesParcours(slug)) return null;
  return ligne.phrase(etape, `${ligne.rang}e`, PARCOURS_NOMS[slug]);
}

export const QUIZ_HUMOUR_CTA = {
  /** Phrase d'étape 1, avec `{TITRE1}` lu dans la donnée. */
  phrase: (slug: ParcoursSlug) => {
    const titre1 = titreEtape(slug, 1);
    const etape1 = titre1 ? `l'étape 1 de ${PARCOURS_NOMS[slug]}, « ${titre1} »,` : `l'étape 1 de ${PARCOURS_NOMS[slug]}`;
    return `Ta force, tu viens de la lire. Reste à t'en servir : ${etape1} se lit tout de suite, sans compte. Dedans, un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz.`;
  },
  /** Plein vers l'étape 1 du parcours conseillé. */
  bouton: (slug: ParcoursSlug) => `Commencer mon parcours ${PARCOURS_NOMS[slug]}, étape 1 gratuite`,
  /** Lien `OUVRIR_P` vers /abonnement (retour au parcours conseillé). */
  lien: (slug: ParcoursSlug) => libelleOuvrirUnParcours(slug),
  /**
   * Ligne Premium, rendue dans un seul paragraphe : `profil` (sur sa propre ligne) puis
   * `suite` = `{LP_B12_A}` ou `{LP_B12_M}` puis `{GARANTIE_B12}`. Sans phrase de profil :
   * « les {N} étapes de {P} ».
   */
  premium: (profil: HumorProfileType, slug: ParcoursSlug, annuel: boolean) => {
    const phrase = phraseProfil(profil, slug);
    const etapes = phrase
      ? `les ${etapesParcours(slug)} étapes`
      : `les ${etapesParcours(slug)} étapes de ${PARCOURS_NOMS[slug]}`;
    const prix = annuel ? `${MENSUEL_TTC}, ou ${ANNUEL_TTC} (${PREMIUM_ANNUAL_EQUIVALENT_LABEL})` : MENSUEL_TTC;
    const suite = `Premium ouvre d'un coup ${etapes} (${minutesParcours(slug)} minutes chacune) et les ${AUTRES} autres parcours : ${prix}. Tu résilies depuis ton profil quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.`;
    return { profil: phrase, suite };
  },
} as const;

// ─── B13. Quiz d'orientation, membre sans abonnement (validé) ───────────────

/**
 * `{PROGRAMME}` : rangs des étapes citées (jusqu'à 3), titres lus dans la donnée. Forme
 * courte d'un titre seulement si le titre de la donnée est encore celui-là (sinon le titre
 * de la donnée, initiale en minuscule : le texte suit la donnée).
 */
const PROGRAMME: Readonly<Record<ParcoursSlug, readonly number[]>> = {
  repartie: [2, 3, 4],
  "machine-a-cafe": [2, 3],
  confiance: [2, 3, 4],
  storytelling: [2, 4, 5],
  boulot: [2, 3, 6],
};
const FORMES_COURTES: Readonly<Record<string, string>> = {
  "Un PS drôle, sans finir en capture d'écran": "un PS drôle sans finir en capture d'écran",
  "Le couloir : quinze secondes": "le couloir en quinze secondes",
  "Un toast de soixante secondes, une seule vanne": "un toast de soixante secondes",
};

function programme(slug: ParcoursSlug): { titres: string[]; complet: boolean } {
  const titres = PROGRAMME[slug]
    .map((rang) => titreEtape(slug, rang))
    .filter((t): t is string => t !== null)
    .map((t) => FORMES_COURTES[t] ?? minusculeInitiale(t));
  return { titres, complet: titres.length === etapesParcours(slug) - 1 };
}

export const QUIZ_ORIENTATION_CTA = {
  /**
   * Trois paragraphes (trois `<p>`). Le troisième (« Ton compte est prêt ») n'est vrai que
   * pour un compte connecté : `compte = false` le retire.
   */
  paragraphes: (slug: ParcoursSlug, compte = true): string[] => {
    const p = PARCOURS_NOMS[slug];
    const { titres, complet } = programme(slug);
    const ensuite = titres.length > 0 ? ` ${complet ? "Ensuite" : "Ensuite, entre autres"} : ${titres.join(", ")}.` : "";
    return [
      `Ton quiz te conseille ${p} : pour toi si ${ligneCarte(slug)}. L'étape 1 est offerte.${ensuite}`,
      `Avec Premium, les étapes ${etapesPayantes(slug)} sont ouvertes tout de suite, ${minutesParcours(slug)} minutes chacune (idéalement une par semaine). Un seul prix, ${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} par mois, ouvre les ${PARCOURS_COUNT} parcours, pas seulement ${p}.`,
      ...(compte ? ["Ton compte est prêt : il ne reste que le paiement."] : []),
    ];
  },
  /** Plein `OUVRIR_P` : ouvre directement le paiement (le compte existe). */
  bouton: (slug: ParcoursSlug) => libelleOuvrirUnParcours(slug),
  garantie:
    "Prix TTC, paiement sécurisé par Stripe. Tu résilies depuis ton profil quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.",
  /** Lien discret (existant) vers l'étape 1 du parcours conseillé ; plein pour un abonné. */
  commencer: "Voir par où commencer",
  /** Lien discret (existant). */
  refaire: "Refaire le quiz",
} as const;

// ─── B14. Fin d'étape 1 et carte « Étape 2 » (validé) ───────────────────────

export const FIN_ETAPE_1 = {
  /** [S17] surtitre de la carte `CarteEtapeSuivante` (données publiques, inchangé). */
  carteSurtitre: (slug: ParcoursSlug, numero = 2) =>
    `Étape ${numero} sur ${etapesParcours(slug)}, ${minutesParcours(slug)} minutes`,
  /**
   * Fin de [S18] : « Dans l'étape : un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. »
   * à partir du format public de l'étape (inchangé).
   */
  carteFormat: (format: string) => {
    const liste = format.trim().replace(/\.$/, "");
    const minuscule = liste.charAt(0).toLowerCase() + liste.slice(1);
    const i = minuscule.lastIndexOf(", ");
    const avecEt = i > 0 ? `${minuscule.slice(0, i)} et ${minuscule.slice(i + 2)}` : minuscule;
    return `Dans l'étape : ${avecEt}.`;
  },
  /** Phrase de suite et de validation (sans nombre d'étapes ni durée). */
  phrase: `Bien joué pour l'étape 1. Avec Premium, tu la valides et tu enchaînes : l'étape 2 est ouverte tout de suite, les suivantes aussi. Le rythme conseillé : une par semaine, mais rien ne t'y oblige. Le même abonnement ouvre aussi les ${AUTRES} autres parcours en entier.`,
  bouton: "Passer à l'étape 2 avec Premium",
  /**
   * [S30] lien discret vers la lettre : texte validé, NON posé (nouvel emplacement, accord de
   * Thomas requis, `docs/design/cta-forme-place-s21.md` §8).
   */
  lienLettre: "Ou la lettre gratuite, sans compte : une vanne décryptée et un exercice, une fois par mois par e-mail",
} as const;

// ─── B15. Page /parcours (validé) ───────────────────────────────────────────

export const LISTE_PARCOURS_CTA = {
  bouton: (slug: ParcoursSlug) => `Commencer ${PARCOURS_NOMS[slug]}, étape 1 gratuite`,
  /** [S31] ligne frontière sous le bouton. */
  frontiere: (slug: ParcoursSlug) =>
    `Sans compte ni abonnement, quiz compris. Les étapes ${etapesPayantes(slug)} sont dans Premium.`,
} as const;

// ─── B16. Page /abonnement, visiteur (validé) ───────────────────────────────

interface HautAbonnement {
  surtitre: string;
  titre: string;
}

const HAUT_REPARTIE: HautAbonnement = {
  surtitre: "Pour toi si tu trouves la bonne réponse, mais avec un temps de retard",
  titre: "Ta réplique pendant la soirée, pas dans le bus du retour",
};
const HAUT_BOULOT: HautAbonnement = {
  surtitre: "Pour toi si tu veux faire rire au boulot, sans devenir le collègue qui force",
  titre: "Ta réplique pendant la réunion, pas dans l'ascenseur d'après",
};
const HAUT_CONFIANCE: HautAbonnement = {
  surtitre: "Pour toi si tu sors d'une période compliquée et que le rire te manque",
  titre: `Retrouver le rire à table, ${minutesParcours("confiance")} minutes par semaine, sans te forcer`,
};
const HAUT_STORYTELLING: HautAbonnement = {
  surtitre: "Pour toi si ta chute arrive quand tout le monde est passé au dessert",
  titre: "Ton histoire jusqu'à la chute, avant qu'on te dise « et donc ? »",
};

/** Surtitre et titre selon le parcours d'origine (`returnTo`), repli Répartie. */
export const ABONNEMENT_HAUT_PAR_PARCOURS: Readonly<Record<ParcoursSlug | "defaut", HautAbonnement>> = {
  defaut: HAUT_REPARTIE,
  repartie: HAUT_REPARTIE,
  storytelling: HAUT_STORYTELLING,
  "machine-a-cafe": HAUT_BOULOT,
  boulot: HAUT_BOULOT,
  confiance: HAUT_CONFIANCE,
};

export const ABONNEMENT_CTA = {
  /**
   * Libellé du bouton d'achat : suit la formule choisie, sans rechargement. Parcours d'origine
   * publié : « Ouvrir {P} et les {AUTRES} autres · prix » ; sinon (adresse directe) `OUVRIR`.
   */
  bouton: (plan: PremiumPlan, origine: ParcoursSlug | null = null) => {
    const prix = plan === "annual" ? PREMIUM_ANNUAL_PRICE_LABEL : PREMIUM_PRICE_LABEL;
    if (origine && AUTRES >= 1 && PREMIUM_PARCOURS.some((p) => p.slug === origine)) {
      return `Ouvrir ${PARCOURS_NOMS[origine]} et les ${AUTRES} autres${ESPACE_INSECABLE}· ${prix}`;
    }
    return libelleOuvrirParcours(PARCOURS_COUNT, prix);
  },
  /** [S32] juste sous le bouton. */
  suite: "Deux étapes : ton compte, puis le paiement sécurisé par Stripe.",
} as const;

// ─── B17. Page /register (validé) ───────────────────────────────────────────

export const REGISTER_CTA = {
  /** [S34] libellé du champ prénom (facultatif, en dernier). */
  prenomLabel: "Prénom (facultatif, pour te saluer dans nos e-mails)",
  /** Indication dans le champ prénom (existante). */
  prenomPlaceholder: "Ton prénom",
  /** [S36] plein du formulaire. */
  bouton: "Créer mon compte et passer au paiement",
  /** [S35] lien discret sous « Déjà un compte ? ». */
  lienEtape1: (slug: ParcoursSlug) =>
    `Tu préfères lire d'abord ? L'étape 1 du parcours ${PARCOURS_NOMS[slug]}, gratuite et sans compte`,
} as const;

// ─── Boutons restés hors chantier : E1 (carnet), E3 (/abonnement), E4 (profil) ─
//
// Validés à l'aveugle le 18/10 (`docs/copy/cta-s21/complements/textes-valides-boutons.md`) ;
// E2 (accueil) : `CARTE_PREMIUM.connecte` (cta-articles-accueil.ts). Rendu du jour, mot pour mot.

/** « les 5 parcours » ; repli « tous les parcours » si le compte tombe à 1 ou 0 (comme `OUVRIR`). */
const LES_PARCOURS = PARCOURS_COUNT >= 2 ? `les ${PARCOURS_COUNT} parcours` : "tous les parcours";

/** « de 3 à 6 semaines » : parcours le plus court et le plus long (config/premium.ts). */
const SEMAINES_PARCOURS =
  PARCOURS_MIN_WEEKS === PARCOURS_MAX_WEEKS
    ? `${PARCOURS_MIN_WEEKS} semaines`
    : `de ${PARCOURS_MIN_WEEKS} à ${PARCOURS_MAX_WEEKS} semaines`;

/** E1 : appel du carnet, non abonné, après la fiche offerte (tour 3). `n` = `view.apercus.length`. */
export const CARNET_PAYWALL = {
  titre: (n: number) => `Ça, c'était la réplique offerte. Il en reste ${n}.`,
  paragraphe:
    "Elles vont de la moins tendue à la plus tendue, alors tu commences tranquille et tu montes d'un cran. Avec Premium, elles s'ouvrent toutes d'un coup, et un nouveau carnet arrive chaque mois.",
  bouton: (n: number) => `Voir les ${n} autres répliques${ESPACE_INSECABLE}· ${PREMIUM_PRICE_LABEL}`,
  /** Sous le bouton. */
  suite: `${MENSUEL_TTC}. Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux.`,
} as const;

/** E3 : /abonnement, compte connecté sans abonnement (tour 11, variante R2). */
export const ABONNEMENT_CONNECTE = {
  pastille: "Un abonnement, tout ouvert",
  titre: `${LES_PARCOURS.charAt(0).toUpperCase()}${LES_PARCOURS.slice(1)} en entier, et un nouveau carnet de répartie chaque mois.`,
  paragraphe: `${listeFr(PREMIUM_PARCOURS.map((p) => p.name))}, ${SEMAINES_PARCOURS} chacun, et tout s'ouvre d'un coup. Chaque étape tient en ${DUREE_ETAPES} : un conseil, un défi à tenter, 5 vannes, 2 vidéos et un petit quiz. En plus des parcours : toutes les vannes, tous les conseils et toutes les vidéos du site.`,
  /** « · 24,99 €/an » si l'annuel est choisi. */
  bouton: (plan: PremiumPlan) =>
    libelleOuvrirParcours(PARCOURS_COUNT, plan === "annual" ? PREMIUM_ANNUAL_PRICE_LABEL : PREMIUM_PRICE_LABEL),
} as const;

/** E4 : carte « Abonnement » du profil, compte connecté sans abonnement (tour 14, O1 ; ligne discrète D6). */
export const PROFIL_ABONNEMENT_OFFRE = {
  phrase: `Avec Premium, tout est ouvert : ${LES_PARCOURS} en entier, un nouveau carnet de répartie chaque mois, toutes les vannes, tous les conseils et toutes les vidéos. Et tu gardes en favori ce que tu veux ressortir.`,
  /** Si XP > 0. */
  ligneXp: (xp: number) => `Tu as déjà ${xp} XP.`,
  ligneDiscrete: "Résiliable quand tu veux depuis ce profil. Tu as 14 jours pour te faire rembourser ce paiement.",
  bouton: `Tout ouvrir${ESPACE_INSECABLE}· ${PREMIUM_PRICE_LABEL}`,
} as const;

// ─── E5 (/glossaire) et E6 (/a-propos) : fin de page, visiteur et compte sans abonnement ─
//
// Validés à l'aveugle le 18/10, tour 7 (`docs/copy/cta-s21/complements/textes-valides-boutons.md`).
// Masqués pour un abonné (`MasqueSiPremium`). Rendu du jour, mot pour mot.

/**
 * « de la répartie au storytelling » n'est vrai que si les deux parcours sont publiés : sinon
 * le segment est retiré (rien n'est inventé à sa place), même règle que `colocAfterworkVrai`.
 */
export function repartieStorytellingVrai(parcours: readonly { slug: string }[] = PREMIUM_PARCOURS): boolean {
  const publies = new Set(parcours.map((p) => p.slug));
  return publies.has("repartie") && publies.has("storytelling");
}

/** « , de la répartie au storytelling, 15 à 20 minutes par semaine » (après « les 5 parcours »). */
const PROGRAMME_SUITE = `${repartieStorytellingVrai() ? ", de la répartie au storytelling" : ""}, ${DUREE_ETAPES} par semaine`;

/** « des 5 parcours » ; repli « de tous les parcours » (même seuil que `LES_PARCOURS`). */
const DES_PARCOURS = PARCOURS_COUNT >= 2 ? `des ${PARCOURS_COUNT} parcours` : "de tous les parcours";

/** Phrases communes à E5 et E6, après le programme. */
const ETAPE_ET_ESSAI =
  "Chaque étape : un conseil, un défi, 5 vannes, 2 vidéos, un quiz. La première étape de chaque parcours se lit sans compte, pour juger sur pièce, et le reste s'ouvre d'un coup quand tu t'abonnes.";

/** Ligne discrète sous le bouton et petit lien texte, identiques en E5 et E6. */
const FIN_DE_PAGE_COMMUN = {
  bouton: libelleOuvrirParcours(),
  ligneDiscrete: "Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux.",
  lienEtape1: "Lis d'abord une étape, elle est offerte",
} as const;

/** Parcours du petit lien « Lis d'abord une étape » (E5, E6) : Répartie, comme le contour de l'accueil. */
export const FIN_DE_PAGE_PARCOURS_ETAPE_1: ParcoursSlug = "repartie";

/** E5 : fin de page /glossaire (bouton vers /abonnement, `src=glossaire`). */
export const GLOSSAIRE_FIN = {
  titre: "Le vocabulaire, c'est fait. Reste à s'en servir.",
  paragraphe: `Tu sais ce qu'est un callback. Le placer au dîner de samedi, c'est autre chose : faire rire à table, ça s'entraîne. C'est à ça que servent ${LES_PARCOURS}${PROGRAMME_SUITE}. ${ETAPE_ET_ESSAI}`,
  ...FIN_DE_PAGE_COMMUN,
} as const;

/**
 * E6 : fin de page /a-propos (titre inchangé, celui de l'accueil). `inscrits` (« Déjà 1 500+
 * inscrits, et toi ? ») : dernière phrase du paragraphe, retirée pour un compte connecté.
 */
export const A_PROPOS_FIN = {
  titre: ["Tu parles et personne rit.", "On va arranger ça."],
  paragraphe: `Observer, s'entraîner, roder : c'est le programme ${DES_PARCOURS}${PROGRAMME_SUITE}. ${ETAPE_ET_ESSAI}`,
  inscrits: CARTE_PREMIUM.inscrits,
  ...FIN_DE_PAGE_COMMUN,
} as const;
