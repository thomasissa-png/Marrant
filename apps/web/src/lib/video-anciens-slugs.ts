/**
 * Anciennes URL des fiches vidéo dont le titre a changé avec le remplacement
 * de la vidéo (s26, `src/data/video-remplacements-s26.json`, `anciensTitres`).
 *
 * Le slug public dépend de l'`id` de la ligne (`buildVideoSlug` = titre + 10
 * premiers caractères de l'id), que le dépôt ne connaît pas pour la production.
 * L'ancien slug est donc recalculé ICI, à la requête, avec la même fonction et
 * l'id réel : la page `/videos/[slug]` le reconnaît exactement (`pickBySlug`,
 * avant le score de mots qui pourrait ouvrir une autre vidéo du même préfixe)
 * puis redirige en permanence vers le slug canonique.
 *
 * Seulement pour une ligne qui porte DÉJÀ le nouvel id : si la tâche de
 * démarrage a refusé (garde-fou), le titre n'a pas changé et l'ancienne URL
 * reste canonique (aucune redirection, aucune boucle). Module pur.
 */
import { buildVideoSlug } from "@/lib/catalogue-slug";
import remplacementsS26 from "@/data/video-remplacements-s26.json";

interface Remplacement {
  statut: string;
  anciensTitres: string[];
  cible: { youtubeId: string };
}

const ANCIENS_TITRES_PAR_NOUVEL_ID: ReadonlyMap<string, readonly string[]> = new Map(
  (remplacementsS26.videos as Remplacement[])
    .filter((r) => r.statut === "appliquer" && r.anciensTitres.length > 0)
    .map((r) => [r.cible.youtubeId, r.anciensTitres]),
);

export function anciensSlugsVideo(video: { id: string; youtubeId: string }): string[] {
  const titres = ANCIENS_TITRES_PAR_NOUVEL_ID.get(video.youtubeId) ?? [];
  return titres.map((title) => buildVideoSlug({ id: video.id, title }));
}
