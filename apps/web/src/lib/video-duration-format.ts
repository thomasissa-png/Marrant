/**
 * Durée vidéo ISO 8601 au format YouTube : PT[nH][nM][nS] (au moins une
 * composante). Module pur (aucun import serveur) : partagé par la tâche
 * `video-durations-s20` (garde-fou sur la cible) et le JSON-LD `VideoObject`.
 *
 * s20 : les vraies durées vont de « PT54S » à « PT2H26M19S » ; les heures
 * doivent être lues (l'ancien formateur inline de `videos-grid.tsx`, code mort
 * supprimé, rendait « PT1H9M56S » en « 1:9:56 »).
 */
const ISO_DURATION = /^PT(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+S)?$/;

export function isIsoVideoDuration(value: unknown): value is string {
  return typeof value === "string" && ISO_DURATION.test(value);
}
