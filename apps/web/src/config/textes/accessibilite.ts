/**
 * Noms accessibles (lecteurs d'écran) ajoutés par le lot D de l'audit s16.
 * PROVISOIRE s16, étalon à valider : tutoiement, zéro tiret cadratin.
 */

// PROVISOIRE s16, étalon à valider
/** Nom des barres de progression d'un parcours (liste /parcours, profil). */
export function progressionParcoursLabel(titre: string, faites: number, total: number): string {
  return `Progression du parcours ${titre} : ${faites} étape${faites > 1 ? "s" : ""} sur ${total}`;
}
