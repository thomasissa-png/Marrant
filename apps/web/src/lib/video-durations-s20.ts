/**
 * Durées réelles des fiches vidéo s20 : les 89 `Video.duration` (ISO 8601) en
 * base étaient toutes fausses (estimations arrondies du seed, ex. « PT68M00S »
 * pour une vidéo de 1 h 17). Les vraies durées ont été lues le 13/10/2026 via
 * l'API YouTube Data v3 (`videos.list`, `contentDetails.duration`) et bundlées
 * dans `src/data/video-durations-s20.json` (généré par la session, ne pas
 * éditer à la main) : `{ _meta: { version }, videos: [{ youtubeId, attendu, duree }] }`.
 *
 * Garanties (même modèle que `video-content-s20.ts`) :
 *  - Garde-fou : une fiche n'est écrite QUE si `duration` en base est encore
 *    strictement égale à `attendu` (la valeur lue le 13/10). Sinon (durée
 *    retouchée depuis) : refus « GARDE-FOU » journalisé, aucune écriture, pas de
 *    marqueur (l'alerte revient à chaque exécution). `duree` hors format ISO 8601
 *    (PT…H…M…S) : refus aussi.
 *  - Idempotent : marqueur `DataPatch` "video-duration-s20:v<version>:<youtubeId>"
 *    posé dans la MÊME transaction que l'update (une transaction par vidéo) →
 *    2e exécution = 0 update (marqueurs lus en une seule requête).
 *  - Réversible : `DataPatch.note` (JSON) garde `videoId` et `before.duration`.
 *    Retour arrière (Postgres), en GARDANT les marqueurs (les supprimer ferait
 *    ré-appliquer à l'exécution suivante, l'ancienne durée repassant le garde-fou) :
 *      UPDATE "Video" v SET
 *        duration = r.b->>'duration',
 *        "updatedAt" = now()
 *      FROM (SELECT d.note::jsonb->>'videoId' AS vid, d.note::jsonb->'before' AS b
 *            FROM "DataPatch" d WHERE d."patchId" LIKE 'video-duration-s20:v1:%') r
 *      WHERE v.id = r.vid AND r.b ? 'duration';
 *  - Fail-safe : erreur DB sur une fiche → loggée, les autres continuent ;
 *    jamais de throw (ne bloque pas la chaîne des tâches). SANS IA.
 *  - Tourne APRÈS `applyVideoContentS20Task` : la fiche Dany Boon y change de
 *    `youtubeId` (U80fwIfPC4M → JNo86HEt86w), le JSON porte déjà le nouvel id.
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { isIsoVideoDuration } from "@/lib/video-duration-format";
import videoDurationsS20 from "@/data/video-durations-s20.json";

export interface VideoDurationS20Entry {
  youtubeId: string;
  /** Durée en base lue le 13/10 (garde-fou). */
  attendu: string;
  /** Vraie durée YouTube (ISO 8601). */
  duree: string;
}

export interface VideoDurationsS20File {
  _meta: { version: number; [k: string]: unknown };
  videos: VideoDurationS20Entry[];
}

export type VideoDurationS20Plan =
  | { kind: "refus"; reason: string }
  | { kind: "unchanged" }
  | { kind: "update"; duration: string; before: string };

/** Décide, sans accès DB, ce que la durée doit devenir (ou pourquoi refuser). */
export function planVideoDurationS20(current: string, entry: VideoDurationS20Entry): VideoDurationS20Plan {
  if (current !== entry.attendu) {
    return { kind: "refus", reason: `durée en base « ${current} » ≠ attendu « ${entry.attendu} » (modifiée depuis le 13/10)` };
  }
  if (!isIsoVideoDuration(entry.duree)) {
    return { kind: "refus", reason: `durée cible « ${entry.duree} » hors format ISO 8601` };
  }
  if (current === entry.duree) return { kind: "unchanged" };
  return { kind: "update", duration: entry.duree, before: current };
}

export interface VideoDurationsS20Result {
  version: number;
  updated: number;
  refused: number;
  done: number;
  missing: number;
  unchanged: number;
  failed: number;
  summary: string;
}

export function formatVideoDurationsS20Summary(r: Omit<VideoDurationsS20Result, "summary">): string {
  const extras = [
    r.unchanged > 0 ? `${r.unchanged} déjà à la bonne durée` : "",
    r.failed > 0 ? `${r.failed} erreur(s) DB` : "",
  ].filter(Boolean);
  return (
    `durées vidéo s20 v${r.version} : ${r.updated} corrigée(s), ${r.refused} refus garde-fou, ${r.done} déjà faite(s), ${r.missing} absente(s)` +
    (extras.length > 0 ? ` (${extras.join(", ")})` : "")
  );
}

export async function applyVideoDurationsS20Task(
  db: typeof prisma = prisma,
  file: VideoDurationsS20File = videoDurationsS20 as VideoDurationsS20File,
): Promise<VideoDurationsS20Result> {
  const version = file._meta?.version ?? 1;
  const counts = { version, updated: 0, refused: 0, done: 0, missing: 0, unchanged: 0, failed: 0 };

  try {
    const prefix = `video-duration-s20:v${version}:`;
    let markers: Set<string>;
    try {
      const rows = await withDbRetry(
        () => db.dataPatch.findMany({ where: { patchId: { startsWith: prefix } }, select: { patchId: true } }),
        { label: "video-duration-s20:markers" },
      );
      markers = new Set(rows.map((r) => r.patchId));
    } catch (err) {
      console.error("[startup] durées vidéo s20 : lecture des marqueurs échouée (non bloquant) :", err);
      return { ...counts, failed: 1, summary: `durées vidéo s20 v${version} : non exécutée (base injoignable)` };
    }

    for (const entry of file.videos ?? []) {
      const patchId = `${prefix}${entry.youtubeId}`;
      if (markers.has(patchId)) {
        counts.done++;
        continue;
      }
      try {
        const row = await withDbRetry(
          () => db.video.findUnique({ where: { youtubeId: entry.youtubeId }, select: { id: true, duration: true } }),
          { label: `video-duration-s20:find(${entry.youtubeId})` },
        );
        if (!row) {
          counts.missing++;
          console.warn(`[startup] durées vidéo s20 : vidéo ${entry.youtubeId} absente en base, ignorée.`);
          continue;
        }
        const plan = planVideoDurationS20(row.duration, entry);
        if (plan.kind === "refus") {
          counts.refused++;
          console.error(
            `[startup] durées vidéo s20 v${version} : GARDE-FOU, vidéo ${entry.youtubeId} NON écrite : ${plan.reason}. Aucune écriture, pas de marqueur.`,
          );
          continue;
        }
        const note = JSON.stringify({
          patch: "video-duration-s20",
          version,
          videoId: row.id,
          youtubeId: entry.youtubeId,
          after: entry.duree,
          before: plan.kind === "update" ? { duration: plan.before } : {},
        });
        // Opérations recréées à chaque tentative (une PrismaPromise ne se rejoue pas).
        const buildOps = () => {
          const marker = db.dataPatch.create({ data: { patchId, note } });
          return plan.kind === "update"
            ? [db.video.update({ where: { id: row.id }, data: { duration: plan.duration, updatedAt: new Date() } }), marker]
            : [marker];
        };
        await withDbRetry(() => db.$transaction(buildOps()), { label: `video-duration-s20:apply(${entry.youtubeId})` });
        if (plan.kind === "update") counts.updated++;
        else counts.unchanged++;
      } catch (err) {
        counts.failed++;
        console.error(`[startup] durées vidéo s20 échouée pour "${entry.youtubeId}" (non bloquant) :`, err);
      }
    }
  } catch (err) {
    counts.failed++;
    console.error("[startup] durées vidéo s20 : erreur inattendue (non bloquant) :", err);
  }

  const summary = formatVideoDurationsS20Summary(counts);
  console.log(`[startup] ${summary}.`);
  return { ...counts, summary };
}
