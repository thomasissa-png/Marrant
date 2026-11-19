/**
 * Textes des pages d'aperçu des rubriques Premium (nav v6, `docs/ux/navigation-v6-menu-rubriques.md` §2 et §5),
 * servies interrupteur ouvert au visiteur et à l'inscrit gratuit, à l'adresse même de la rubrique.
 *
 * Un seul texte neuf, validé par Thomas le 15/11 (recommandation 4, `docs/founder-preferences.md`) : le sous-titre.
 * Tout le reste est repris par import, sans retouche :
 * - titres des rubriques : onglets de la bande (`espace-navigation.ts`, `espace-aujourdhui.ts`) ;
 * - bouton d'offre : celui de l'en-tête (`EN_TETE`, prix lu dans `config/premium.ts`) ;
 * - « Connexion » (visiteur) : le lien de l'en-tête (`TEXTES_CONNEXION.lienConnexionMobile`).
 * Zéro tiret cadratin, zéro émoji (contrôlé par `__tests__/espace/apercu-rubriques.test.ts`).
 */
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { EN_TETE } from "@/config/textes/cta-articles-accueil";
import { TEXTES_CONNEXION } from "@/config/textes/compte";

export type RubriqueApercu = "aujourdhui" | "quoiRepondre" | "bibliotheque" | "sEntrainer" | "mesQuestions" | "mesRepliques" | "favoris";

export const TEXTES_APERCU = {
  /** Validé par Thomas, 15/11 : « pour les points je suis ta reco » (recommandation 4). */
  sousTitre: "Voici un exemple de cette rubrique. Elle est ouverte avec Premium.",
  titres: {
    aujourdhui: TEXTES_AUJOURDHUI.titre,
    quoiRepondre: N.index.quoiRepondre,
    bibliotheque: N.index.bibliotheque,
    sEntrainer: N.index.sEntrainer,
    mesQuestions: N.index.mesQuestions,
    mesRepliques: N.index.mesRepliques,
    favoris: N.index.favoris,
  } satisfies Record<RubriqueApercu, string>,
  offre: { bouton: EN_TETE.bouton, nomAccessible: EN_TETE.nomAccessible },
  connexion: TEXTES_CONNEXION.lienConnexionMobile,
} as const;

/**
 * Refonte d'« Aujourd'hui » (s25, `docs/ux/aujourdhui-refonte-s25.md` §6.2) : les seuls textes neufs de la refonte,
 * proposés par @ux, EN ATTENTE de validation par Thomas. Réunis ici pour être retrouvés et remplacés d'un coup.
 * Tout le reste de l'aperçu verrouillé et du tableau de bord est repris par import (spec UX §6.1).
 */
export const TEXTES_APERCU_VERROUILLE = {
  /** T1 : promesse du hero de l'aperçu d'« Aujourd'hui » (version B ; 1 ligne à 1280, 2 à 375, mesuré au v7 tour 13). */
  // validé par Thomas le 16/11
  promesseAujourdhui: "Cinq minutes par jour pour oser répondre au lieu de te taire.",
  /** Promesse du hero de l'aperçu de « Quoi répondre » (s26, `docs/ux/rubriques-premium-s26.md` §1.1). */
  // validé par Thomas le 18/11 (docs/founder-preferences.md)
  promesseQuoiRepondre: "La bonne réplique sous la main, au moment où on te chambre.",
  /** Promesse du hero de l'aperçu de « Bibliothèque » (s26, spec §2.1). */
  // validé par Thomas le 18/11 (docs/founder-preferences.md)
  promesseBibliotheque: "Repère ce qui fait rire, puis fais-le à ta façon.",
  /** Promesse du hero de l'aperçu de « S'entraîner » (s26, spec §3.1). Vérifié : les 30 jeux, les cartes, les missions
   * et les séances ne notent rien (aucun score, aucune XP), la phrase est vraie pour toute la rubrique. */
  // validé par Thomas le 18/11 (docs/founder-preferences.md)
  promesseSEntrainer: "Ici, rien n'est noté : tu t'essaies avant que ça compte.",
  /** Promesse du hero de l'aperçu de « Favoris » (s26, `docs/ux/favoris-carnet-s26.md` §1.2, emplacement `PROMESSE`). */
  // validé par Thomas le 19/11 (docs/founder-preferences.md)
  promesseFavoris: "Garde ce qui t'a servi, retrouve-le sans chercher.",
  /** T2 : phrase de fin d'extrait, toutes rubriques. */
  // validé par Thomas le 18/11
  suite: "La suite est dans Premium",
  /** T4 : lu seulement (lecteurs d'écran), après le H1 de l'aperçu. */
  // À VALIDER PAR THOMAS (s25)
  lecteurEcran: "Rubrique Premium. Exemple ci-dessous, non cliquable.",
} as const;

const FORMAT_DATE_DU_JOUR = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });

/** T3 : date sous le H1 de l'abonné, jour de Paris, mise en forme automatique en français (« lundi 16 novembre »). */
// À VALIDER PAR THOMAS (s25)
export const dateDuJour = (maintenant: Date = new Date()): string => FORMAT_DATE_DU_JOUR.format(maintenant);
