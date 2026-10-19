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
  PARCOURS_COUNT,
  PREMIUM_PARCOURS,
  PREMIUM_PRICE_LABEL,
  type PremiumPlan,
} from "@/config/premium";
import { PARCOURS_ETAPES } from "@/config/parcours-etapes";
import { libelleGratuitParcours, libelleToutOuvrir } from "@/config/textes/cta-articles-accueil";
import { libelleSabonner, PHRASE_OBJET_CONNECTE } from "@/config/textes/abonnement-vente";
import { LAST_FREE_PARCOURS_STEP } from "@/lib/parcours-access";
import { OFFRE_NOM, PASSER_ETAPE_2, PHRASE_SUITE_PARCOURS, rappelFormule } from "@/config/textes/offre";
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
    limite: `Les ${FREE_JOKE_LIMIT} vannes gratuites, c’est fait.`,
    bouton: avecPrix("Ouvrir la suite des vannes"),
    contour: libelleGratuitParcours,
  },
  conseils: {
    titre: "Pour la prochaine fois qu’on te chambre",
    limite: `${FREE_TIP_LIMIT} conseils gratuits, c’est fait.`,
    bouton: avecPrix("Ouvrir la suite des conseils"),
    contour: libelleGratuitParcours,
  },
  videos: {
    titre: "Tu regardes pour rire. Et pour faire rire ?",
    limite: `${FREE_VIDEO_LIMIT} vidéos gratuites, c’est fait.`,
    bouton: avecPrix("Ouvrir la suite des vidéos"),
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

/**
 * Ordre à l'écran (textes-trajet-v2 §2.4) : titre, rappel de l'objet cliqué (donnée), `ligne`
 * (W03, favori seulement), prix en gros (`FENETRE_PRIX`), plein, `FENETRE_COMPTE` (W06, visiteur),
 * REASS.
 */
export interface TexteFenetre {
  titre: string;
  bouton: string;
  ligne?: string;
}

/** W07 (v2) : même personne grammaticale que le plein du favori. */
const VOTE_FENETRE: TexteFenetre = { titre: `Voter, et tout le reste : ${OFFRE_NOM}`, bouton: "S’abonner et voter" };
const CARTE_FENETRE: TexteFenetre = {
  titre: "Le reste de la liste est juste derrière",
  bouton: "S’abonner et ouvrir la liste",
};

/** W01, W03, W05 (v2) : une seule phrase pour la vanne, le conseil et la vidéo. */
const FAVORI_FENETRE: TexteFenetre = {
  titre: `Les favoris, c’est ${OFFRE_NOM}`,
  ligne: `Il ouvre aussi tout le catalogue et les ${PARCOURS_COUNT} parcours.`,
  bouton: "S’abonner et tout ouvrir",
};

/**
 * Variante du §6 point 8 (arbitrage 1 du tour 2), appliquée parce que l'ajout automatique du
 * favori après paiement est codé et prouvé de bout en bout (Playwright local, favori-apres-paiement).
 * Texte écrit pour la vanne seulement : le conseil et la vidéo gardent W01/W05.
 */
const FAVORI_FENETRE_VANNE: TexteFenetre = {
  titre: `Garde-la avec ${OFFRE_NOM}`,
  ligne: FAVORI_FENETRE.ligne,
  bouton: "S’abonner et la garder",
};

/** Visiteur et compte connecté voient la même fenêtre. */
export const FENETRE_PREMIUM: Readonly<Record<GesteFenetre, Readonly<Record<FicheType, TexteFenetre>>>> = {
  favori: { vanne: FAVORI_FENETRE_VANNE, conseil: FAVORI_FENETRE, video: FAVORI_FENETRE },
  vote: { vanne: VOTE_FENETRE, conseil: VOTE_FENETRE, video: VOTE_FENETRE },
  carte: { vanne: CARTE_FENETRE, conseil: CARTE_FENETRE, video: CARTE_FENETRE },
};

/** W06 (v2) : ligne compte sous le plein, avant la REASS (visiteur seulement). Même phrase en T3 (T01). */
export const FENETRE_COMPTE = "D’abord ton compte, puis le paiement.";

/** Ligne de prix de la fenêtre (« 2,99 € /mois », W04) : montant en gros, suffixe en petit. */
export const FENETRE_PRIX = { montant: formatEuros(PREMIUM_MONTHLY_PRICE_CENTS), suffixe: "/mois" } as const;

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
  phrase: PHRASE_SUITE_PARCOURS,
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
  /** v2 G01 : écho exact de « D'abord ton compte, puis le paiement. » (W06, T01). */
  titre: "Ton compte, puis le paiement",
  /** v2 G02 : « Premium, 2,99 €/mois. » ; annuel « Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. » */
  planReminder: (plan: PremiumPlan) => rappelFormule(plan, { saufResiliation: true }),
  bouton: "Créer mon compte et passer au paiement",
  /** Bouton pendant l'ouverture du paiement, après la création du compte (attente dans le bouton). */
  chargementPaiement: "On t’emmène au paiement…",
  google: "Continuer avec Google",
  dejaCompte: "Déjà un compte ?",
  connecteToi: "Connecte-toi",
  /** v2 G06 : sous la réassurance, même style petit. */
  stripe: "Paiement sécurisé par Stripe.",
  /** v2 G05 : seulement sans source ou depuis /login (aucun clic d'achat). Parcours d'origine, Répartie par défaut. */
  lienEtape1: libelleGratuitParcours,
} as const;

/** Sources sans clic d'achat : /register ouvert tel quel ou depuis /login (v2 G05, §3). */
export const SRC_SANS_ACHAT: ReadonlySet<string> = new Set(["login"]);

const apresPaiement = (x: string) => `Après le paiement, ${x}.`;
const TOUT_S_OUVRE = apresPaiement("tout s’ouvre");

/** v2 §3 : phrase de /register par entrée (`src`), clé = source. Les autres sources : `TOUT_S_OUVRE`. */
export const CONTEXTE_REGISTER: Readonly<Record<string, string>> = {
  "mur-vannes": apresPaiement("la suite des vannes s’ouvre"),
  "mur-conseils": apresPaiement("la suite des conseils s’ouvre"),
  "mur-videos": apresPaiement("la suite des vidéos s’ouvre"),
  "modale-carte": apresPaiement("toute la liste s’ouvre"),
  favoris: apresPaiement("les favoris s’ouvrent"),
  "modale-favoris": apresPaiement("les favoris s’ouvrent"),
  "exercice-vanne": apresPaiement("les exercices des fiches s’ouvrent"),
  "exercice-conseil": apresPaiement("les exercices des fiches s’ouvrent"),
  "exercice-video": apresPaiement("les exercices des fiches s’ouvrent"),
  carnet: apresPaiement("tout le carnet s’ouvre"),
  recherche: apresPaiement("tous les résultats s’ouvrent"),
};

/**
 * Variante du §6 point 8 (arbitrage 1 du tour 2) : la vanne cliquée (étoile) est ajoutée aux
 * favoris après le paiement, prouvé de bout en bout. Texte écrit pour la vanne seulement.
 */
export const CONTEXTE_REGISTER_FAVORI_VANNE = "Après le paiement, ta vanne est dans tes favoris.";

/**
 * Phrase de contexte de /register (v2 G03, G04, §3), ou `null` sans clic d'achat. `parcours` : lu
 * dans le `returnTo` du callback ; `carnet` : retour vers /carnet ; `favoriVanne` : étoile d'une vanne.
 */
export function contexteRegister({
  src,
  parcours = null,
  carnet = false,
  favoriVanne = false,
}: {
  src: string | null;
  parcours?: ParcoursSlug | null;
  carnet?: boolean;
  favoriVanne?: boolean;
}): string | null {
  if (!src || SRC_SANS_ACHAT.has(src)) return null;
  if (src === "modale-favoris" && favoriVanne) return CONTEXTE_REGISTER_FAVORI_VANNE;
  if (CONTEXTE_REGISTER[src]) return CONTEXTE_REGISTER[src];
  if (carnet) return CONTEXTE_REGISTER.carnet;
  if (parcours) {
    const nom = PARCOURS_NOMS[parcours];
    if (src === "parcours-etape") {
      const titre = PARCOURS_ETAPES[parcours].titres[LAST_FREE_PARCOURS_STEP];
      const etape = `l’étape ${LAST_FREE_PARCOURS_STEP + 1} de ${nom} s’ouvre`;
      return apresPaiement(titre ? `${etape} : ${titre}` : etape);
    }
    if (src === "parcours-apercu") return apresPaiement(`la suite de ${nom} s’ouvre`);
    if (src === "onboarding") return apresPaiement(`${nom} s’ouvre en entier`);
  }
  return TOUT_S_OUVRE;
}

// ─── /carnet, visiteur : paywall après la fiche offerte ─────────────────────

/** `n` = `view.apercus.length` (répliques restantes du mois). */
export const CARNET_PAYWALL = {
  titre: (n: number) => `Ça, c’était la réplique offerte. Il en reste ${n}.`,
  paragraphe: "Un nouveau carnet arrive chaque mois.",
  bouton: avecPrix("Ouvrir tout le carnet"),
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
