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
  /**
   * Favoris (coordinateur, 15/11 : « l'état vide existant de la page avec l'offre, sans rien inventer ») : titre et
   * phrase de l'onglet « Tout » vide, mot pour mot (`components/favoris/favoris-list.tsx`, `TABS[0]`, contrôlé par
   * le test) ; ni l'émoji ni le bouton « Explorer les vannes » (un seul bouton plein par aperçu).
   */
  favorisVide: {
    titre: "Aucun favori pour l’instant",
    texte: "Mets des vannes, conseils ou vidéos de côté : tu nous remercieras en soirée.",
  },
} as const;
