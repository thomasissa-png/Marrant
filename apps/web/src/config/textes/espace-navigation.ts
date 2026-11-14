/**
 * Textes de la navigation de l'espace client Premium dans l'en-tête unique du site (s24,
 * `docs/ux/navigation-universelle-s24.md` v5) : lien « Mon espace », index (carte « Dans ton espace »
 * et menu mobile), liens « Retour : … », cloche.
 *
 * Sources, mot pour mot :
 * - « Mon espace » : décision Q2 = A (`docs/founder-preferences.md`) ;
 * - lignes de l'index : rubriques et lignes de l'ancien menu « Plus » (décision C1, architecture v20 §6.2),
 *   « Carnet » de l'en-tête abonné actuel ; « S’entraîner » en apostrophe typographique (règle du texte
 *   visible du site, `typographie-s21.spec.ts`) ;
 * - « Dans ton espace » et « Retour : {parent} » : spécification v5 §3 et §4.3 (libellés nouveaux, signalés) ;
 * - noms et lignes de la cloche : `docs/copy/libelles-espace-e5-s24.md` lignes 10 à 12, maquette
 *   `docs/espace-client/etalons/e5/aujourdhui.html`, état vide : architecture v20 §2.9.
 * Contrôle automatique : zéro tiret cadratin, zéro émoji (`__tests__/espace/navigation-espace-s24.test.tsx`).
 */

export const TEXTES_ESPACE_NAVIGATION = {
  /** Lien de la barre (dès 768 px), première ligne du menu mobile, intitulé de 768 à 1023 px. */
  monEspace: "Mon espace",
  /** Repli du retour d'un bilan dont le parcours n'est plus publié. */
  parcours: "Parcours",
  index: {
    /** Titre de la carte d'index de « Aujourd'hui » (v5 §3). */
    titre: "Dans ton espace",
    quoiRepondre: "Quoi répondre",
    bibliotheque: "Bibliothèque",
    mesQuestions: "Mes questions",
    sEntrainer: "S’entraîner",
    mesRepliques: "Mes répliques",
    lettres: "Lettres",
    favoris: "Favoris",
    carnet: "Carnet",
  },
  /** Lien de retour des pages de l'espace (v5 §4.3). */
  retour: (parent: string) => `Retour : ${parent}`,
  cloche: {
    /** Titre du panneau (libellés E5, ligne 10). */
    titre: "Notifications",
    fermer: "Fermer",
    /** État vide du panneau (architecture 2.9). */
    vide: "Rien de nouveau. Reviens quand tu veux.",
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
