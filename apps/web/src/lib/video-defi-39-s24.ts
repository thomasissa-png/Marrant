/**
 * Défi de la vidéo 39 (Aymeric Lompret, `itrLXrwG18c`) : décision de Thomas du
 * 13/11 (`docs/founder-preferences.md`), le tiret cadratin de l'exemple de
 * réponse est remplacé par une ponctuation, fiche publique comprise.
 *
 * Texte cible = champ `exercise` de la fiche 39 de `docs/content/videos-seed.json`
 * (seule source) : « Relativise. » « Justement, … » (deux répliques).
 *
 * Pourquoi une tâche : la fiche publique lit la base (`/api/fiches/exercice`,
 * `private, no-store`), pas le seed. En base depuis le 12/10 (s20), le défi porte
 * « « Relativise. Justement, … » » : `stripVideoEmDashesTask` a retiré le tiret,
 * puis `applyVideoContentS20Task` a posé le même texte. `catalogue-content` ne
 * réécrit aucune vidéo (garde-fou s20) : sans cette tâche, le seed corrigé
 * n'atteindrait jamais la page.
 *
 * Garanties (même modèle que `video-em-dash.ts`) :
 *  - Une seule fiche (`youtubeId`), un seul champ (`exercise`) ; aucune autre vidéo lue.
 *  - Garde-fou : écriture SEULEMENT si le texte en base est l'un des deux textes
 *    connus d'avant (sans tiret depuis s20, ou avec tiret si s20 n'est jamais
 *    passé). Sinon refus « GARDE-FOU » journalisé, aucune écriture.
 *  - Idempotent : marqueur `DataPatch` posé dans la MÊME transaction que l'update.
 *  - Réversible : `note.before.exercise` garde le texte d'origine. Retour arrière :
 *      UPDATE "Video" v SET exercise = d.note::json->'before'->>'exercise'
 *      FROM "DataPatch" d WHERE d."patchId" = 'video-defi-39-s24:v1' AND v.id = d.note::json->>'videoId';
 *    (garder le marqueur, sinon la tâche réécrit au passage suivant).
 *  - Fail-safe : jamais de throw. SANS IA. Tourne APRÈS `applyVideoContentS20Task`.
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import videosSeed from "../../../../docs/content/videos-seed.json";

export const VIDEO_DEFI_39_YOUTUBE_ID = "itrLXrwG18c";
export const VIDEO_DEFI_39_PATCH_ID = "video-defi-39-s24:v1";

const APRES = "« Relativise. » « Justement,";
const AVANT_SANS_TIRET = "« Relativise. Justement,";
const AVANT_AVEC_TIRET = "« Relativise. — Justement,";

function lireCible(): string {
  const fiche = (videosSeed as Array<{ id: number; youtubeId: string; exercise?: string | null }>).find(
    (v) => v.id === 39 && v.youtubeId === VIDEO_DEFI_39_YOUTUBE_ID,
  );
  if (!fiche || typeof fiche.exercise !== "string" || fiche.exercise.split(APRES).length !== 2) {
    throw new Error("video-defi-39-s24 : fiche 39 du seed introuvable ou texte inattendu");
  }
  return fiche.exercise;
}

/** Texte cible (seed) et textes d'avant acceptés par le garde-fou. */
export const VIDEO_DEFI_39_CIBLE = lireCible();
export const VIDEO_DEFI_39_AVANTS: readonly string[] = [
  VIDEO_DEFI_39_CIBLE.replace(APRES, AVANT_SANS_TIRET),
  VIDEO_DEFI_39_CIBLE.replace(APRES, AVANT_AVEC_TIRET),
];

export type DecisionDefi39 = "ecrire" | "deja" | "refus";

export function deciderDefi39(exercise: string | null): DecisionDefi39 {
  if (exercise === VIDEO_DEFI_39_CIBLE) return "deja";
  if (exercise !== null && VIDEO_DEFI_39_AVANTS.includes(exercise)) return "ecrire";
  return "refus";
}

export async function applyVideoDefi39S24Task(): Promise<void> {
  try {
    const existing = await withDbRetry(
      () => prisma.dataPatch.findUnique({ where: { patchId: VIDEO_DEFI_39_PATCH_ID } }),
      { label: "video-defi-39-s24:check" },
    );
    if (existing) return;
    const video = await withDbRetry(
      () => prisma.video.findUnique({ where: { youtubeId: VIDEO_DEFI_39_YOUTUBE_ID }, select: { id: true, exercise: true } }),
      { label: "video-defi-39-s24:read" },
    );
    if (!video) {
      console.log(`[startup] défi vidéo 39 s24 : fiche ${VIDEO_DEFI_39_YOUTUBE_ID} absente, rien à faire.`);
      return;
    }
    const decision = deciderDefi39(video.exercise);
    if (decision === "deja") return;
    if (decision === "refus") {
      console.error(
        `[startup] défi vidéo 39 s24 : GARDE-FOU, texte en base inattendu (retouché depuis ?), aucune écriture sur ${video.id}.`,
      );
      return;
    }
    const note = JSON.stringify({
      patch: "video-defi-39-s24",
      youtubeId: VIDEO_DEFI_39_YOUTUBE_ID,
      videoId: video.id,
      before: { exercise: video.exercise },
    });
    await withDbRetry(
      () =>
        prisma.$transaction([
          prisma.video.update({ where: { id: video.id }, data: { exercise: VIDEO_DEFI_39_CIBLE } }),
          prisma.dataPatch.create({ data: { patchId: VIDEO_DEFI_39_PATCH_ID, note } }),
        ]),
      { label: "video-defi-39-s24:apply" },
    );
    console.log("[startup] défi vidéo 39 s24 : 1 fiche corrigée (« Relativise. » « Justement, … »).");
  } catch (err) {
    console.error("[startup] défi vidéo 39 s24 échoué (non bloquant) :", err);
  }
}
