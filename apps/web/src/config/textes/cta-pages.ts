/**
 * Blocs d'appel s21, partie B : murs des listes (B7), fiches vanne, conseil et
 * vidéo (B8 à B10), fenêtre Premium (B11), quiz d'humour (B12), quiz
 * d'orientation (B13), fin d'étape 1 (B14), /parcours (B15), /abonnement (B16)
 * et /register (B17).
 *
 * SOURCE UNIQUE des textes de ces blocs : aucun texte en dur dans les
 * composants. Après le tour 5 (docs/copy/cta-s21/tour5/textes-finaux-3.md),
 * seul ce fichier change.
 *
 * Version actuelle : gagnants du tour 4 (docs/copy/cta-s21/tour4/
 * resultats-tour4.md, cles-pack3-tour4.md, annexe-pack3-tour4.md §5).
 * Les nombres viennent de leur source : PARCOURS_COUNT et PREMIUM_PARCOURS
 * (config/premium.ts), les prix de l'offre (config/premium.ts, mêmes
 * montants que Stripe), l'annuel seulement si `isAnnualPlanAvailable()`
 * (passé en paramètre `annuel` : lu côté serveur, jamais deviné côté client).
 */
import {
  formatEuros,
  FREE_JOKE_LIMIT,
  FREE_TIP_LIMIT,
  FREE_VIDEO_LIMIT,
  PARCOURS_COUNT,
  PREMIUM_ANNUAL_EQUIVALENT_LABEL,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_PARCOURS,
  PREMIUM_PRICE_LABEL,
  type PremiumPlan,
} from "@/config/premium";
import { PARCOURS_NOMS, type ParcoursSlug } from "@/lib/entrees-parcours";

// ─── Briques communes (nombres lus à la source) ─────────────────────────────

const MENSUEL_TTC = `${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} TTC par mois`;
const ANNUEL_TTC = `${formatEuros(PREMIUM_ANNUAL_PRICE_CENTS)} TTC par an`;
const GARANTIE = "Tu as 14 jours pour te faire rembourser ton premier paiement.";

/** Minutes par semaine d'un parcours (« 20 min/semaine » → 20). */
function minutesParcours(slug: ParcoursSlug): number {
  const p = PREMIUM_PARCOURS.find((x) => x.slug === slug);
  return p ? Number.parseInt(p.timePerWeek, 10) : 20;
}

/** Nombre d'étapes d'un parcours (une par semaine). */
function etapesParcours(slug: ParcoursSlug): number {
  return PREMIUM_PARCOURS.find((x) => x.slug === slug)?.weeks ?? 4;
}

/** « 2 à 4 », ou « 2 et 3 » pour un parcours de 3 étapes. */
function etapesPayantes(slug: ParcoursSlug): string {
  const n = etapesParcours(slug);
  return n === 3 ? "2 et 3" : `2 à ${n}`;
}

/** « de 15 à 20 minutes » : bornes des parcours publiés. */
function fourchetteMinutes(): string {
  const m = PREMIUM_PARCOURS.map((p) => Number.parseInt(p.timePerWeek, 10)).filter((x) => x > 0);
  const min = Math.min(...m);
  const max = Math.max(...m);
  return min === max ? `${min} minutes` : `de ${min} à ${max} minutes`;
}

/**
 * Ligne prix + garantie sous un plein Premium (B7 à B10, B14). La demi-ligne
 * annuelle n'existe que si l'offre annuelle est disponible (annexe §5.3).
 */
export function lignePrixGarantie(annuel: boolean): string {
  const prix = annuel
    ? `${MENSUEL_TTC}, ou ${ANNUEL_TTC} (${PREMIUM_ANNUAL_EQUIVALENT_LABEL}, si tu vois loin).`
    : `${MENSUEL_TTC}.`;
  return `${prix} Résiliable en ligne quand tu veux. ${GARANTIE}`;
}

/** Contour vers l'étape 1 gratuite d'un parcours (B7 à B10, [S25]). */
export const contourEtape1 = (slug: ParcoursSlug): string =>
  `Essayer gratuitement l'étape 1 du parcours ${PARCOURS_NOMS[slug]}`;

// ─── B7. Murs des listes /vannes, /conseils, /videos (tour 4, A, 3-0) ───────

export type ListeMur = "vannes" | "conseils" | "videos";

/** Parcours de l'étape gratuite proposée en contour sous les murs. */
export const MUR_PARCOURS: ParcoursSlug = "repartie";

const AVEC_PREMIUM_FIN = `${PARCOURS_COUNT} parcours pour t'entraîner, une étape par semaine (${fourchetteMinutes()})`;

export const MUR_LISTE: Readonly<
  Record<
    ListeMur,
    {
      /** [S21] après la dernière carte gratuite. */
      limite: string;
      /** [S22] lien discret vers les filtres (Premium). */
      filtres: string;
      /** [S23] titre de la carte. */
      titre: string;
      /** [S24] ce qu'il y a derrière, en usage. */
      texte: string;
      /** Plein vers /abonnement?src=mur-<liste>. */
      bouton: string;
    }
  >
> = {
  vannes: {
    limite: `Voilà les ${FREE_JOKE_LIMIT} premières vannes. La suite est juste en dessous, dans Premium.`,
    filtres: "Le filtre par catégorie est dans Premium.",
    titre: "Et si la prochaine vanne qui fait rire la table était la tienne ?",
    texte: `Avec Premium : toute la liste, l'exercice « À toi de jouer » sous chaque vanne pour écrire la tienne, tes favoris, et ${AVEC_PREMIUM_FIN}.`,
    bouton: "Voir la suite des vannes avec Premium",
  },
  conseils: {
    limite: `Voilà les ${FREE_TIP_LIMIT} premiers conseils. La suite est juste en dessous, dans Premium.`,
    filtres: "Les filtres par niveau et par catégorie sont dans Premium.",
    titre: "Et si la bonne réplique sortait sur le moment, pas trois heures après ?",
    texte: `Avec Premium : toute la liste, l'exercice « À toi de jouer » de chaque conseil pour le tester sur toi, tes favoris, et ${AVEC_PREMIUM_FIN}.`,
    bouton: "Voir la suite des conseils avec Premium",
  },
  videos: {
    limite: `Voilà les ${FREE_VIDEO_LIMIT} premières vidéos. La suite est juste en dessous, dans Premium.`,
    filtres: "Les filtres par niveau et par catégorie sont dans Premium.",
    titre: "Tu les regardes pour rire. Et si tu les regardais pour faire rire ?",
    texte: `Avec Premium : toute la liste, les points clés et l'exercice de chaque vidéo, tes favoris, et ${AVEC_PREMIUM_FIN}.`,
    bouton: "Voir la suite des vidéos avec Premium",
  },
};

/** Lien court sur les cartes verrouillées (même destination que le plein). */
export const MUR_CARTE_LIEN = "Voir Premium";

// ─── B8 à B10. Fiches vanne, conseil, vidéo (tour 4, A, 3-0) ────────────────

export type FicheType = "vanne" | "conseil" | "video";

const AVEC_PARCOURS = `avec ${PARCOURS_COUNT} parcours pour t'entraîner : une étape par semaine, ${fourchetteMinutes()}`;

export const BLOC_EXERCICE: Readonly<
  Record<FicheType, { titre: string; texte: string; bouton: string; toutVoir: string; toutVoirHref: string }>
> = {
  vanne: {
    titre: "Et si demain, c'était la tienne qu'on se répétait ?",
    texte:
      "La mécanique, tu l'as. Il te reste l'exercice « À toi de jouer » : une consigne et un exemple à réutiliser pour écrire ta version, celle que tu auras envie de sortir à la prochaine soirée. Il est dans Premium.",
    bouton: "Écrire la mienne avec Premium",
    toutVoir: "Voir toutes les vannes",
    toutVoirHref: "/vannes",
  },
  conseil: {
    titre: "Ce conseil, avant le soir où il servira",
    texte: `L'exercice « À toi de jouer » te donne une consigne et un exemple à réutiliser pour tester ce conseil sur toi, tranquillement. Il est dans Premium, ${AVEC_PARCOURS}.`,
    bouton: "Tester ce conseil avec Premium",
    toutVoir: "Voir tous les conseils",
    toutVoirHref: "/conseils",
  },
  video: {
    titre: "Après le rire, l'analyse",
    texte: `Sur scène, il faut faire rire une salle. Toi, une table te suffit. Les points clés de cette vidéo et son exercice sont dans Premium, ${AVEC_PARCOURS}.`,
    bouton: "Décrypter cette vidéo avec Premium",
    toutVoir: "Voir toutes les vidéos",
    toutVoirHref: "/videos",
  },
};

/** Titre du bloc pour un abonné (l'exercice s'affiche, aucun bouton). */
export const BLOC_EXERCICE_ABONNE_TITRE = "À toi de jouer";

// ─── B11. Fenêtre Premium (tour 4, B, 3-0) ──────────────────────────────────

/** Geste qui ouvre la fenêtre. `carte` = carte floutée d'une liste. */
export type GesteFenetre = "favori" | "vote" | "carte";

export interface TexteFenetre {
  titre: string;
  intro: string;
  /** [S27] avantage du geste, deux lignes au plus. */
  avantage: string;
  bouton: string;
}

const INTRO_FENETRE =
  "Tu peux fermer cette fenêtre, ta page reste là. S'abonner, c'est deux étapes : ton compte, puis le paiement sécurisé.";

const VOTE_FENETRE: TexteFenetre = {
  titre: "Voter sur les nouveautés, c'est dans Premium",
  intro: INTRO_FENETRE,
  avantage: `Ton vote sur les nouveautés, et ${PARCOURS_COUNT} parcours pour t'entraîner, une étape par semaine.`,
  bouton: "Je m'abonne et je vote",
};

const favori = (titre: string): TexteFenetre => ({
  titre,
  intro: INTRO_FENETRE,
  avantage: `Avec Premium : tes favoris prêts pour le bon moment, et ${PARCOURS_COUNT} parcours pour t'entraîner, une étape par semaine.`,
  bouton: "Je m'abonne et je garde mes favoris",
});

const carte = (filtres: string): TexteFenetre => ({
  titre: "Le reste de la liste est juste derrière",
  intro: INTRO_FENETRE,
  avantage: `Avec Premium : toute la liste, ${filtres}, tes favoris, et ${PARCOURS_COUNT} parcours pour t'entraîner.`,
  bouton: "Je m'abonne et j'ouvre toute la liste",
});

/** Une intro et un titre par geste, déclinés pour vanne, conseil et vidéo. */
export const FENETRE_PREMIUM: Readonly<Record<GesteFenetre, Readonly<Record<FicheType, TexteFenetre>>>> = {
  favori: {
    vanne: favori("Garde-la pour le soir où tu en auras besoin"),
    conseil: favori("Garde-le pour le soir où tu en auras besoin"),
    video: favori("Garde-la pour le soir où tu en auras besoin"),
  },
  vote: { vanne: VOTE_FENETRE, conseil: VOTE_FENETRE, video: VOTE_FENETRE },
  carte: {
    vanne: carte("le filtre par catégorie"),
    conseil: carte("les filtres par niveau et par catégorie"),
    video: carte("les filtres par niveau et par catégorie"),
  },
};

/** Ligne de prix de la fenêtre (« 2,99 € TTC / mois ») : montant en gros, suffixe en petit. */
export const FENETRE_PRIX = { montant: formatEuros(PREMIUM_MONTHLY_PRICE_CENTS), suffixe: "TTC / mois" } as const;

/** Bouton pendant l'ouverture du paiement (compte connecté). */
export const FENETRE_CHARGEMENT = "On t'emmène au paiement…";

/** Unique ligne de garantie de la fenêtre (plus de mentions juridiques en doublon, choix du 18/10). */
export const FENETRE_GARANTIE =
  "Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux.";

/** [S28] lien discret vers l'étape 1 gratuite. */
export const fenetreLienEtape1 = (slug: ParcoursSlug): string =>
  `Ou lire d'abord l'étape 1 de ${PARCOURS_NOMS[slug]} (gratuite, sans compte)`;

// ─── B12. Résultat du quiz d'humour (tour 4, A, 3-0) ────────────────────────

export const QUIZ_HUMOUR_CTA = {
  phrase: (slug: ParcoursSlug) =>
    `Ton humour, tu viens de le découvrir. Ça se travaille : ${PARCOURS_NOMS[slug]}, c'est ${etapesParcours(slug)} étapes de ${minutesParcours(slug)} minutes, une par semaine. La première se lit tout de suite, sans compte, quiz compris.`,
  /** Plein vers l'étape 1 du parcours conseillé. */
  bouton: (slug: ParcoursSlug) => `Essayer gratuitement l'étape 1 de ${PARCOURS_NOMS[slug]}`,
  /** Lien vers /abonnement (retour au parcours conseillé). */
  lien: `Voir les ${PARCOURS_COUNT} parcours en entier avec Premium`,
  premium: (annuel: boolean) =>
    `Premium : ${MENSUEL_TTC}${annuel ? `, ou ${ANNUEL_TTC} (${PREMIUM_ANNUAL_EQUIVALENT_LABEL})` : ""}. Résiliable en ligne. ${GARANTIE}`,
} as const;

// ─── B13. Résultat du quiz d'orientation, compte sans abonnement (tour 4, A, 3-0) ──

/**
 * Ligne « Pour toi si… » de la carte de chaque parcours, raccourcie pour le
 * bloc (annexe §4). Storytelling et Boulot : pas de `personaTagline` dans le
 * seed, repli sans ligne tant que Thomas ne les a pas fournies.
 */
const POUR_TOI_SI: Readonly<Partial<Record<ParcoursSlug, string>>> = {
  repartie: "on te chambre et que tu cherches encore quoi répondre",
  "machine-a-cafe": "tu veux faire rire à la pause sans devenir le collègue qui force",
  confiance: "tu sors d'une période compliquée",
};

export const QUIZ_ORIENTATION_CTA = {
  phrase: (slug: ParcoursSlug) => {
    const nom = PARCOURS_NOMS[slug];
    const ligne = POUR_TOI_SI[slug];
    const pourToi = ligne ? `, le parcours pour toi si ${ligne}` : "";
    return `Ton compte est prêt. Plus qu'un pas pour suivre ${nom} en entier${pourToi} : étapes ${etapesPayantes(slug)}, une par semaine, ${minutesParcours(slug)} minutes.`;
  },
  /** Plein : ouvre directement le paiement (le compte existe). */
  bouton: (slug: ParcoursSlug) => `Suivre ${PARCOURS_NOMS[slug]} en entier · ${PREMIUM_PRICE_LABEL}`,
  garantie:
    "Prix TTC. Tu résilies en ligne quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.",
  /** Lien discret (existant) vers l'étape 1 du parcours conseillé ; plein pour un abonné. */
  commencer: "Voir par où commencer",
  /** Lien discret (existant). */
  refaire: "Refaire le quiz",
} as const;

// ─── B14. Fin d'étape 1 et carte « Étape 2 » (tour 4, A, 3-0) ───────────────

export const FIN_ETAPE_1 = {
  /** [S17] surtitre de la carte `CarteEtapeSuivante`. */
  carteSurtitre: (slug: ParcoursSlug, numero = 2) =>
    `Étape ${numero} sur ${etapesParcours(slug)}, ${minutesParcours(slug)} minutes`,
  /**
   * Fin de [S18] : « Dans l'étape : un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. »
   * à partir du format public de l'étape (« Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. »).
   */
  carteFormat: (format: string) => {
    const liste = format.trim().replace(/\.$/, "");
    const minuscule = liste.charAt(0).toLowerCase() + liste.slice(1);
    const i = minuscule.lastIndexOf(", ");
    const avecEt = i > 0 ? `${minuscule.slice(0, i)} et ${minuscule.slice(i + 2)}` : minuscule;
    return `Dans l'étape : ${avecEt}.`;
  },
  phrase: (slug: ParcoursSlug) =>
    `Bien joué, l'étape 1 est faite. La valider et ouvrir l'étape 2, c'est dans Premium, comme toute la suite : ${minutesParcours(slug)} minutes par semaine.`,
  bouton: "Passer à l'étape 2 avec Premium",
} as const;

// ─── B15. Page /parcours (tour 4, A, 3-0) ───────────────────────────────────

export const LISTE_PARCOURS_CTA = {
  bouton: (slug: ParcoursSlug) => `Commencer l'étape 1 de ${PARCOURS_NOMS[slug]}, gratuite`,
  /** [S31] ligne frontière sous le bouton. */
  frontiere: (slug: ParcoursSlug) =>
    `Sans compte, sans abonnement, quiz compris. Les étapes ${etapesPayantes(slug)} sont dans Premium.`,
} as const;

// ─── B16. Page /abonnement, visiteur (tour 4, A, 3-0) ───────────────────────

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
  titre: "Le rire, à ton rythme, sans te forcer",
};

/** Surtitre et titre selon le parcours d'origine (`returnTo`), repli Répartie. */
export const ABONNEMENT_HAUT_PAR_PARCOURS: Readonly<Record<ParcoursSlug | "defaut", HautAbonnement>> = {
  defaut: HAUT_REPARTIE,
  repartie: HAUT_REPARTIE,
  storytelling: HAUT_REPARTIE,
  "machine-a-cafe": HAUT_BOULOT,
  boulot: HAUT_BOULOT,
  confiance: HAUT_CONFIANCE,
};

export const ABONNEMENT_CTA = {
  /** Libellé du bouton d'achat : suit la formule choisie, sans rechargement. */
  bouton: (plan: PremiumPlan) =>
    `Ouvrir les ${PARCOURS_COUNT} parcours · ${plan === "annual" ? PREMIUM_ANNUAL_PRICE_LABEL : PREMIUM_PRICE_LABEL}`,
  /** [S32] juste sous le bouton. */
  suite: "Deux étapes : ton compte, puis le paiement sécurisé par Stripe.",
} as const;

// ─── B17. Page /register (tour 4, A, 2-1) ───────────────────────────────────

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
