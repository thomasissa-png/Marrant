/**
 * Retrait des tirets cadratins (« — ») des fiches vidéo en base (s20, décision
 * Thomas du 12/10, `docs/qa/diagnostic-conseils-videos-s11-s20.md` §3.3 :
 * 170 tirets dans 52 fiches). Pendant vidéo de `stripBlogEmDashesTask`.
 *
 * Applique `stripEmDashes` (ponctuation seulement : aucun mot changé) aux champs
 * texte de la fiche : `description` (publique, méta, Open Graph), `technique`,
 * `learnings` (chaque enseignement) et `exercise`. `title` et `channelName`
 * (noms venus de YouTube) ne sont JAMAIS touchés.
 *
 * Tâche DÉDIÉE : ne passe pas par `catalogue-content` (dont la version ne bouge
 * pas, garde-fou s20) et ne remplace aucun texte par celui du seed.
 *
 * Garanties (même modèle que `stripBlogEmDashesTask`) :
 *  - Idempotent : marqueur `DataPatch` "video-em-dash:v<version>:<youtubeId>"
 *    posé dans la MÊME transaction que l'update → 2e boot = 0 update. Une fiche
 *    sans « — » n'est ni modifiée ni marquée.
 *  - Réversible : `DataPatch.note` (JSON) garde les champs d'origine dans `before`.
 *    Retour arrière, par fiche :
 *      UPDATE "Video" v SET description = d.note::json->'before'->>'description',
 *        technique = d.note::json->'before'->>'technique',
 *        exercise = d.note::json->'before'->>'exercise',
 *        learnings = ARRAY(SELECT json_array_elements_text(d.note::json->'before'->'learnings'))
 *      FROM "DataPatch" d WHERE d."patchId" = 'video-em-dash:v1:' || v."youtubeId";
 *  - Fail-safe : erreur DB sur une fiche → loggée, les autres continuent ;
 *    jamais de throw (ne bloque pas le boot).
 *  - SANS IA. Tourne EN DERNIER parmi les tâches qui écrivent des vidéos : si
 *    une réécriture future réinjecte des tirets, bumper `VIDEO_EM_DASH_PATCH_VERSION`.
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { stripEmDashes } from "@/lib/em-dash";

export const VIDEO_EM_DASH_PATCH_VERSION = 1;
const EM_DASH = "—";

export interface VideoTextFields {
  description: string;
  technique: string;
  /** `NULL` possible en base (30 vidéos hors seed, colonne tableau) : laissé tel quel. */
  learnings: string[] | null;
  exercise: string | null;
}

export function countEmDashes(fields: VideoTextFields): number {
  const count = (s: string | null) => (s ? s.split(EM_DASH).length - 1 : 0);
  return (
    count(fields.description) +
    count(fields.technique) +
    count(fields.exercise) +
    (fields.learnings ?? []).reduce((sum, l) => sum + count(l), 0)
  );
}

/** Champs sans tiret cadratin (ponctuation seulement), ou `null` si rien à changer. */
export function stripVideoEmDashes(fields: VideoTextFields): VideoTextFields | null {
  if (countEmDashes(fields) === 0) return null;
  const strip = (s: string) => (s.includes(EM_DASH) ? stripEmDashes(s) : s);
  return {
    description: strip(fields.description),
    technique: strip(fields.technique),
    learnings: fields.learnings === null ? null : fields.learnings.map(strip),
    exercise: fields.exercise === null ? null : strip(fields.exercise),
  };
}

/** Seuls les champs réellement modifiés partent dans l'update. */
export function changedVideoFields(
  before: VideoTextFields,
  after: VideoTextFields,
): { description?: string; technique?: string; learnings?: string[]; exercise?: string | null } {
  const data: { description?: string; technique?: string; learnings?: string[]; exercise?: string | null } = {};
  if (after.description !== before.description) data.description = after.description;
  if (after.technique !== before.technique) data.technique = after.technique;
  if (after.exercise !== before.exercise) data.exercise = after.exercise;
  if (after.learnings && JSON.stringify(after.learnings) !== JSON.stringify(before.learnings)) {
    data.learnings = after.learnings;
  }
  return data;
}

export async function stripVideoEmDashesTask(): Promise<void> {
  const version = VIDEO_EM_DASH_PATCH_VERSION;
  let videos: Array<VideoTextFields & { id: string; youtubeId: string }>;
  try {
    videos = await withDbRetry(
      () =>
        prisma.video.findMany({
          select: { id: true, youtubeId: true, description: true, technique: true, learnings: true, exercise: true },
        }),
      { label: "video-em-dash:list" },
    );
  } catch (err) {
    console.error("[startup] stripVideoEmDashes : lecture échouée (non bloquant) :", err);
    return;
  }

  let applied = 0;
  let skipped = 0;
  let dashes = 0;
  for (const video of videos) {
    const before: VideoTextFields = {
      description: video.description,
      technique: video.technique,
      learnings: video.learnings,
      exercise: video.exercise,
    };
    const after = stripVideoEmDashes(before);
    if (!after) continue;
    const patchId = `video-em-dash:v${version}:${video.youtubeId}`;
    try {
      const existing = await withDbRetry(
        () => prisma.dataPatch.findUnique({ where: { patchId } }),
        { label: `video-em-dash:check(${video.youtubeId})` },
      );
      if (existing) {
        skipped++;
        continue;
      }
      const removed = countEmDashes(before) - countEmDashes(after);
      const note = JSON.stringify({ patch: "video-em-dash", version, youtubeId: video.youtubeId, removed, before });
      await withDbRetry(
        () =>
          prisma.$transaction([
            prisma.video.update({ where: { id: video.id }, data: changedVideoFields(before, after) }),
            prisma.dataPatch.create({ data: { patchId, note } }),
          ]),
        { label: `video-em-dash:apply(${video.youtubeId})` },
      );
      applied++;
      dashes += removed;
    } catch (err) {
      console.error(`[startup] stripVideoEmDashes échoué pour "${video.youtubeId}" (non bloquant) :`, err);
    }
  }

  if (applied > 0 || skipped > 0) {
    console.log(
      `[startup] tirets cadratins vidéos v${version} : ${applied} fiche(s) corrigée(s) (${dashes} tiret(s)), ${skipped} déjà patchée(s).`,
    );
  }
}
