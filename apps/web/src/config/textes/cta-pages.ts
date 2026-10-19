/**
 * Blocs d'appel s21, parties B et C : murs des listes, fiches vanne, conseil et vidéo, fenêtre
 * Premium, quiz d'humour, quiz d'orientation, fin d'étape 1, /parcours, /abonnement, /register,
 * carnet, profil, fins de page /glossaire et /a-propos.
 *
 * SOURCE UNIQUE des textes de ces blocs : aucun texte en dur dans les composants.
 *
 * Source : textes de la concision VALIDÉS à l'aveugle le 18/10/2026, version v5, mot pour mot
 * (`docs/copy/cta-s21/concision/textes-v5-b.md` et `textes-v5-c.md` ; conventions dans
 * `textes-v5-a.md` §0). Libellés uniques : `OUVRIR` (`libelleOuvrirParcours`), `GRATUIT_P`
 * (`libelleGratuitParcours`), `GRATUIT_ACCUEIL` ; réassurance unique `REASSURANCE_UNIQUE`
 * (offre.ts), rendue sous chaque plein qui porte un prix.
 *
 * Les nombres viennent de leur source : PARCOURS_COUNT et PREMIUM_PARCOURS (config/premium.ts),
 * limites gratuites (`FREE_*_LIMIT`), prix de l'offre (mêmes montants que Stripe), nombre
 * d'étapes d'un parcours lu dans la donnée (jamais en dur).
 * « · » des boutons : espace insécable avant, le prix passe à la ligne avec lui.
 */
import {
  ESPACE_INSECABLE,
  formatEuros,
  FREE_JOKE_LIMIT,
  FREE_TIP_LIMIT,
  FREE_VIDEO_LIMIT,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_PARCOURS,
  PREMIUM_PRICE_LABEL,
  type PremiumPlan,
} from "@/config/premium";
import { PARCOURS_ETAPES } from "@/config/parcours-etapes";
import { libelleGratuitParcours, libelleToutOuvrir } from "@/config/textes/cta-articles-accueil";
import { libelleSabonner, PHRASE_OBJET_CONNECTE } from "@/config/textes/abonnement-vente";
import { LAST_FREE_PARCOURS_STEP } from "@/lib/parcours-access";
import { OFFRE_NOM, PASSER_ETAPE_2, prixTtcLabel } from "@/config/textes/offre";
import { PARCOURS_NOMS, type ParcoursSlug } from "@/lib/entrees-parcours";

/** « Libellé · 2,99 €/mois » (espace insécable avant le point médian). */
const avecPrix = (libelle: string, prix: string = PREMIUM_PRICE_LABEL): string => `${libelle}${ESPACE_INSECABLE}· ${prix}`;

/** `{N}` : nombre d'étapes d'un parcours, lu dans la donnée. */
function etapesParcours(slug: ParcoursSlug): number {
  return PREMIUM_PARCOURS.find((x) => x.slug === slug)?.weeks ?? PARCOURS_ETAPES[slug].titres.length;
}

// ─── Murs des listes /vannes, /conseils, /videos ────────────────────────────

export type ListeMur = "vannes" | "conseils" | "videos";

/** Parcours de l'étape gratuite proposée en lien sous les murs. */
export const MUR_PARCOURS: ParcoursSlug = "repartie";

/** Titre, une ligne, un plein (REASS dessous), un lien `GRATUIT_P`. */
export const MUR_LISTE: Readonly<
  Record<ListeMur, { titre: string; limite: string; bouton: string; contour: (slug: ParcoursSlug) => string }>
> = {
  vannes: {
    titre: "Encore des vannes à ressortir",
    limite: `Les ${FREE_JOKE_LIMIT} gratuites, c’est fait.`,
    bouton: avecPrix("Voir la suite des vannes"),
    contour: libelleGratuitParcours,
  },
  conseils: {
    titre: "Pour la prochaine fois qu’on te chambre",
    limite: `${FREE_TIP_LIMIT} conseils gratuits, c’est fait.`,
    bouton: avecPrix("Voir la suite des conseils"),
    contour: libelleGratuitParcours,
  },
  videos: {
    titre: "Tu regardes pour rire. Et pour faire rire ?",
    limite: `${FREE_VIDEO_LIMIT} vidéos gratuites, c’est fait.`,
    bouton: avecPrix("Voir la suite des vidéos"),
    contour: libelleGratuitParcours,
  },
};

// ─── Fiches vanne, conseil, vidéo ───────────────────────────────────────────

export type FicheType = "vanne" | "conseil" | "video";

/** Titre, une phrase, un plein (REASS dessous), un lien `GRATUIT_P`. */
export const BLOC_EXERCICE: Readonly<
  Record<FicheType, { titre: string; texte: string; bouton: string; contour: (slug: ParcoursSlug) => string }>
> = {
  vanne: {
    titre: "Demain, c’est peut-être la tienne qu’on répète",
    texte: "Une consigne, un exemple, et c’est à toi.",
    bouton: avecPrix("Écrire la mienne"),
    contour: libelleGratuitParcours,
  },
  conseil: {
    titre: "Essaie-le avant le soir où il te servira",
    texte: "À froid, rater est sans risque : l’exercice sert à ça.",
    bouton: avecPrix("Essayer ce conseil"),
    contour: libelleGratuitParcours,
  },
  video: {
    titre: "L’humoriste a sa salle. Toi, une table suffit",
    texte: "Les points clés, et un exercice pour t’en servir.",
    bouton: avecPrix("Décrypter cette vidéo"),
    contour: libelleGratuitParcours,
  },
};

/** Titre du bloc pour un abonné (l'exercice s'affiche, aucun bouton). */
export const BLOC_EXERCICE_ABONNE_TITRE = "À toi de jouer";

// ─── Fenêtre Premium, par geste ─────────────────────────────────────────────

/** Geste qui ouvre la fenêtre. `carte` = carte floutée d'une liste. */
export type GesteFenetre = "favori" | "vote" | "carte";

/** 4 éléments visibles : titre, prix en gros (`FENETRE_PRIX`), plein, REASS. */
export interface TexteFenetre {
  titre: string;
  bouton: string;
}

const VOTE_FENETRE: TexteFenetre = { titre: `Voter, et tout le reste : ${OFFRE_NOM}`, bouton: "Je m’abonne et je vote" };
const CARTE_FENETRE: TexteFenetre = {
  titre: "Le reste de la liste est juste derrière",
  bouton: "Je m’abonne et j’ouvre toute la liste",
};

/** Visiteur et compte connecté voient la même fenêtre. */
export const FENETRE_PREMIUM: Readonly<Record<GesteFenetre, Readonly<Record<FicheType, TexteFenetre>>>> = {
  favori: {
    vanne: { titre: "Mets-la de côté", bouton: "Je m’abonne et je la garde" },
    conseil: { titre: "Garde-le sous le coude", bouton: "Je m’abonne et je le garde" },
    video: { titre: "Garde-la pour la revoir", bouton: "Je m’abonne et je la garde" },
  },
  vote: { vanne: VOTE_FENETRE, conseil: VOTE_FENETRE, video: VOTE_FENETRE },
  carte: { vanne: CARTE_FENETRE, conseil: CARTE_FENETRE, video: CARTE_FENETRE },
};

/** Ligne de prix de la fenêtre (« 2,99 € TTC / mois ») : montant en gros, suffixe en petit. */
export const FENETRE_PRIX = { montant: formatEuros(PREMIUM_MONTHLY_PRICE_CENTS), suffixe: "TTC / mois" } as const;

/** Bouton pendant l'ouverture du paiement (compte connecté). */
export const FENETRE_CHARGEMENT = "On t’emmène au paiement…";

// ─── Paywall `premium-paywall.tsx` ──────────────────────────────────────────

/**
 * Web : titre, texte de valeur, plein vers Stripe (« S'abonner », trajet de conversion s21 §2.1 :
 * paiement direct), REASS. Mobile natif (Apple 3.1.1) : seul `valeur` s'affiche, sans prix ni lien web.
 */
export const PAYWALL_PREMIUM = {
  titre: `Le reste, avec ${OFFRE_NOM}`,
  valeur: "Le carnet du mois, tes favoris, tout le catalogue.",
  bouton: libelleSabonner(),
} as const;

// ─── Résultat du quiz d'humour ──────────────────────────────────────────────

/** Le résultat (entrees-parcours.ts), puis un plein gratuit, « Sans compte. », la porte « Tout ouvrir ». */
export const QUIZ_HUMOUR_CTA = {
  sansCompte: "Sans compte.",
  bouton: libelleGratuitParcours,
  lien: (_slug: ParcoursSlug) => libelleToutOuvrir(),
} as const;

// ─── Résultat du quiz d'orientation (compte sans abonnement) ────────────────

/** Une phrase par parcours (« Pour toi si … »). */
const LIGNE_QUIZ: Readonly<Record<ParcoursSlug, string>> = {
  repartie: "Pour toi si on te chambre et que tu cherches encore quoi répondre.",
  "machine-a-cafe": "Pour toi si tu veux faire rire à la pause.",
  confiance: "Pour toi si tu aimerais rire plus souvent avec les autres.",
  storytelling: "Pour toi si ta chute arrive quand tout le monde est passé au dessert.",
  boulot: "Pour toi si, le lundi à 9 h, tu prends un ton de compte rendu.",
};

/**
 * Titre, une phrase, un plein, REASS ; liens « Refaire le quiz » et `GRATUIT_P`. Deux destinations,
 * deux libellés (trajet de conversion s21 §2) : le compte connecté va à Stripe (« S'abonner », avec
 * la ligne d'objet), le visiteur va à /abonnement (porte « Tout ouvrir »).
 */
export const QUIZ_ORIENTATION_CTA = {
  titre: (slug: ParcoursSlug) => `Ton parcours : ${PARCOURS_NOMS[slug]}`,
  phrase: (slug: ParcoursSlug) => LIGNE_QUIZ[slug],
  /** Compte sans abonnement : paiement direct. */
  bouton: (_slug: ParcoursSlug) => libelleSabonner(),
  /** Compte sans abonnement : ligne d'objet après « Pour toi si… ». */
  objetConnecte: `${OFFRE_NOM} ouvre ce parcours et tout le reste.`,
  /** Visiteur : porte vers /abonnement. */
  boutonVisiteur: (_slug: ParcoursSlug) => libelleToutOuvrir(),
  /** Lien discret vers l'étape 1 du parcours conseillé (compte sans abonnement). */
  commencer: libelleGratuitParcours,
  /** Abonné : plein vers l'étape 1 (hors concision v5, libellé existant gardé). */
  commencerAbonne: "Voir par où commencer",
  refaire: "Refaire le quiz",
} as const;

// ─── Fin d'étape 1 (visiteur) et carte « Étape 2 » ──────────────────────────

export const FIN_ETAPE_1 = {
  /** Surtitre de la carte `CarteEtapeSuivante` : « Étape 2 sur {N} », {N} lu dans la donnée. */
  carteSurtitre: (slug: ParcoursSlug, numero = 2) => `Étape ${numero} sur ${etapesParcours(slug)}`,
  titre: "Bien joué !",
  phrase: `${OFFRE_NOM} ouvre la suite et les autres parcours d’un coup.`,
  /** Plein vers /register (puis paiement). REASS dessous. */
  bouton: PASSER_ETAPE_2,
  /**
   * Lettre sous la REASS : ligne discrète qui déplie le champ au clic. Champ, bouton discret,
   * case et mention : `TEXTES_LETTRE.formulaire` (lettre-s21.ts), textes légaux inchangés.
   */
  lettre: { ligne: "Lettre gratuite : une vanne décryptée par mois." },
} as const;

// ─── Page /parcours ─────────────────────────────────────────────────────────

export const LISTE_PARCOURS_CTA = {
  bouton: libelleGratuitParcours,
  /** Ligne frontière sous le bouton. */
  frontiere: (_slug: ParcoursSlug) => `Sans compte. La suite : ${OFFRE_NOM}.`,
} as const;

// ─── Page /abonnement ───────────────────────────────────────────────────────
// Trajet de conversion s21 : titre unique, bouton, tableau, etc. dans `abonnement-vente.ts`.

export const ABONNEMENT_CTA = {
  /** « Pas encore sûr ? » puis le lien `GRATUIT_P` (parcours d'origine, sinon Répartie). Visiteur seulement. */
  pasEncoreSur: "Pas encore sûr ?",
  lienEtape1: libelleGratuitParcours,
} as const;

// ─── Page /register ─────────────────────────────────────────────────────────

export const REGISTER_CTA = {
  titre: "Ton compte",
  /**
   * « Premium, 2,99 € TTC par mois. » (annuel : « Premium, 24,99 € TTC par an. »). Depuis la fin
   * d'étape 1 (`src=parcours-etape`, parcours connu) : + « Après le paiement, l'étape 2 de {Parcours}
   * s'ouvre. » (trajet de conversion s21 §4 : le bouton cliqué promettait l'étape 2).
   */
  planReminder: (plan: PremiumPlan, parcoursEtape?: ParcoursSlug | null) =>
    `${OFFRE_NOM}, ${prixTtcLabel(plan)}.${
      parcoursEtape ? ` Après le paiement, l’étape ${LAST_FREE_PARCOURS_STEP + 1} de ${PARCOURS_NOMS[parcoursEtape]} s’ouvre.` : ""
    }`,
  bouton: "Créer mon compte et passer au paiement",
  google: "Continuer avec Google",
  dejaCompte: "Déjà un compte ?",
  connecteToi: "Connecte-toi",
  /** Parcours d'origine, Répartie par défaut ; absent quand on arrive de la fin de l'étape 1. */
  lienEtape1: libelleGratuitParcours,
} as const;

// ─── /carnet, visiteur : paywall après la fiche offerte ─────────────────────

/** `n` = `view.apercus.length` (répliques restantes du mois). */
export const CARNET_PAYWALL = {
  titre: (n: number) => `Ça, c’était la réplique offerte. Il en reste ${n}.`,
  paragraphe: "Un nouveau carnet arrive chaque mois.",
  bouton: avecPrix("Voir tout le carnet"),
  listeTitre: "Au programme",
  /** Après les 3 premiers titres de la liste verrouillée : `reste` = n - 3. */
  listeReste: (reste: number) => `Et ${reste} autres répliques`,
} as const;

/** Nombre de titres de fiches montrés dans la liste verrouillée du carnet. */
export const CARNET_LISTE_VISIBLES = 3;

// ─── /profil, compte sans abonnement ────────────────────────────────────────

/** Paiement direct (trajet de conversion s21 §2) : « S'abonner » et la phrase d'objet commune. */
export const PROFIL_ABONNEMENT_OFFRE = {
  phrase: PHRASE_OBJET_CONNECTE,
  bouton: libelleSabonner(),
} as const;

// ─── Fins de page /glossaire et /a-propos (visiteur et compte sans abonnement) ─

/** Parcours du lien gratuit des fins de page : Répartie. */
export const FIN_DE_PAGE_PARCOURS_ETAPE_1: ParcoursSlug = "repartie";

const FIN_DE_PAGE_COMMUN = {
  bouton: libelleToutOuvrir(),
  lienEtape1: libelleGratuitParcours(FIN_DE_PAGE_PARCOURS_ETAPE_1),
} as const;

/** /glossaire (bouton vers /abonnement, `src=glossaire`). */
export const GLOSSAIRE_FIN = {
  titre: "Le vocabulaire, c’est fait. Reste à s’en servir.",
  paragraphe: "Placer un callback au dîner de samedi, c’est autre chose : ça se travaille.",
  ...FIN_DE_PAGE_COMMUN,
} as const;

/** /a-propos (titre de l'accueil). `preuve` : retirée pour un compte connecté. */
export const A_PROPOS_FIN = {
  titre: ["Tu parles et personne rit.", "On va arranger ça."],
  paragraphe: "Observer d’abord, roder ensuite : voilà le programme.",
  preuve: `Déjà 1${ESPACE_INSECABLE}500+ inscrits.`,
  ...FIN_DE_PAGE_COMMUN,
} as const;
