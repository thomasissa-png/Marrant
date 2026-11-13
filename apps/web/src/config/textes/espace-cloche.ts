/**
 * Textes du panneau de la cloche (s24, lot D8 du plan `docs/espace-client/plan-developpement-s24.md`).
 *
 * Sources, mot pour mot (aucun texte neuf) :
 * - groupes et lignes : `docs/copy/libelles-espace-e5-s24.md` ligne 11 (« Nouveau ce mois-ci », « Le carnet
 *   du mois », « De nouvelles situations », « L'équipe t'a répondu ») et maquette validée
 *   `docs/espace-client/etalons/e5/aujourdhui.html` (groupe « Nouvelle lettre ») ;
 * - « Nouveau dans la Bibliothèque » : architecture v20 2.9 et 3.12 (notification neutre, sans nom de
 *   sujet, identique pour tous les blocs de la Bibliothèque, humour noir compris) ;
 * - ligne d'une réponse : type du fil et « Répondu le {date} » de « Mes questions » (libellés, ligne 21) ;
 * - titre du panneau, « Fermer », état vide et nom du bouton : `espace-navigation.ts` (lot D2).
 * - message de la cloche qui ne charge pas : `docs/copy/espace/textes-manquants-import2-s24.md` section 3
 *   (reco B, clôture du 13/11), test `textes-manquants-s24`.
 * Contrôle automatique : zéro tiret cadratin, zéro émoji (`__tests__/espace/cloche-s24.test.ts`).
 */
export const TEXTES_CLOCHE = {
  groupes: {
    reponses: "L'équipe t'a répondu",
    nouveautes: "Nouveau ce mois-ci",
    lettre: "Nouvelle lettre",
  },
  lignes: {
    carnet: "Le carnet du mois",
    situations: "De nouvelles situations",
    bibliotheque: "Nouveau dans la Bibliothèque",
  },
  erreur: "On n'a pas pu afficher tes notifications. Repasse dans un moment.",
} as const;
