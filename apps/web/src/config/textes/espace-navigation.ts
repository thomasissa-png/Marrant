/**
 * Textes de la navigation de l'espace client Premium (s24, lot D2 du plan
 * `docs/espace-client/plan-developpement-s24.md`) : barre de rubriques, menu « Plus »,
 * cloche (coque), recherche et menu de compte de l'en-tête abonné.
 *
 * Sources, mot pour mot (aucun texte neuf) :
 * - rubriques et menu « Plus » : décision C1 de Thomas (`docs/founder-preferences.md`,
 *   12/11) et architecture v20 §6.2 ; « Mon espace » : décision Q2 = A ;
 * - noms accessibles (« Notifications », « Rechercher », « Menu du compte », « Plus de
 *   rubriques ») et lignes de la cloche : `docs/copy/libelles-espace-e5-s24.md` lignes 10 à 12 ;
 * - noms de la cloche au singulier et au pluriel, « Fermer » : maquette validée
 *   `docs/espace-client/etalons/e5/aujourdhui.html` ; état vide : architecture v20 §2.9 ;
 * « Mon profil » et « Déconnexion » restent ceux du menu de compte existant (`account-menu.tsx`).
 * Contrôle automatique : zéro tiret cadratin, zéro émoji (`__tests__/espace/navigation-espace-s24.test.tsx`).
 */

export const TEXTES_ESPACE_NAVIGATION = {
  /** Nom de la région de la barre (architecture 6.2 règle a) et entrée du menu de compte (Q2 = A). */
  monEspace: "Mon espace",
  rubriques: {
    aujourdhui: "Aujourd'hui",
    parcours: "Parcours",
    quoiRepondre: "Quoi répondre",
    bibliotheque: "Bibliothèque",
    mesQuestions: "Mes questions",
    plus: "Plus",
  },
  menuPlus: {
    /** Nom accessible du menu (libellés E5, ligne 12). */
    nom: "Plus de rubriques",
    sEntrainer: "S'entraîner",
    groupeMonContenu: "Mon contenu",
    favoris: "Favoris",
    mesRepliques: "Mes répliques",
    groupeLeReste: "Le reste",
    lettres: "Lettres",
    articles: "Articles",
    quiz: "Quiz d'humour",
  },
  cloche: {
    /** Titre du panneau (libellés E5, ligne 10). */
    titre: "Notifications",
    fermer: "Fermer",
    /** État vide du panneau (architecture 2.9). */
    vide: "Rien de nouveau. Reviens quand tu veux.",
  },
  recherche: {
    ouvrir: "Rechercher",
    fermer: "Fermer",
  },
  compte: {
    /** Nom accessible du bouton du menu de compte de l'en-tête abonné (libellés E5, ligne 12). */
    nom: "Menu du compte",
  },
} as const;

/**
 * Nom accessible de la cloche : le nombre est celui des réponses de l'équipe non lues,
 * jamais celui des lignes du panneau (plan, lot D8). Singulier et pluriel de la maquette.
 */
export function nomCloche(nonLues: number): string {
  if (nonLues <= 0) return "Notifications, aucune réponse non lue";
  if (nonLues === 1) return "Notifications, 1 réponse de l'équipe non lue";
  return `Notifications, ${nonLues} réponses de l'équipe non lues`;
}
