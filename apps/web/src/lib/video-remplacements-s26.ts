/**
 * Remplacement s26 des vidéos YouTube à risque (supprimée, revendiquée ou copie
 * tierce) par une mise en ligne d'une chaîne officielle. Décision de Thomas du
 * 19/11 ; données `src/data/video-remplacements-s26.json` ; doc
 * `docs/qa/remplacements-videos-s26.md`.
 *
 * Mise à jour SUR PLACE de la ligne `Video` existante : `youtubeId`, `title`,
 * `channelName`, `duration` (et, seulement si la cible les porte, `description`,
 * `learnings`, `exercise`). Jamais de création ni de suppression, jamais de
 * changement d'`id` : favoris et « Contenu du jour » restent attachés. Ancienne
 * URL d'un titre changé : `anciensSlugsVideo` (page `/videos/[slug]`, 308).
 *
 * Garanties (modèle `video-content-s20.ts`) :
 *  - Statut « en-attente » : aucune lecture, aucune écriture (texte en base qui
 *    décrit l'ancienne vidéo : réécriture @copywriter puis relecture à
 *    l'aveugle, P0 s18). Passer à « appliquer » en ajoutant les textes à la cible.
 *  - Garde-fou : écriture seulement si l'empreinte du texte en base
 *    (`videoTextFingerprint`, celle de s20) vaut `attendu` (texte s20 v1, sur
 *    lequel la cohérence avec la nouvelle vidéo a été jugée). Sinon refus
 *    journalisé, aucune écriture, pas de marqueur (l'alerte revient au boot).
 *  - Refus si le `youtubeId` cible est déjà porté par une autre ligne (`@unique`).
 *  - Durée : "" (inconnue, oEmbed ne la donne pas) ou ISO 8601 ; jamais celle de
 *    l'ancienne vidéo. Aucun affichage public ; le JSON-LD omet une valeur vide.
 *  - Idempotent : marqueur `DataPatch` "video-remplacements-s26:v<version>:<ancien
 *    youtubeId>" dans la MÊME transaction que l'update ; marqueurs lus en une requête.
 *  - Réversible : `note.before` garde la valeur précédente de chaque champ
 *    modifié. Retour arrière (Postgres), en GARDANT les marqueurs (les supprimer
 *    ferait ré-appliquer au boot suivant) :
 *      UPDATE "Video" v SET
 *        "youtubeId" = COALESCE(b->>'youtubeId', v."youtubeId"),
 *        title = COALESCE(b->>'title', v.title),
 *        "channelName" = COALESCE(b->>'channelName', v."channelName"),
 *        duration = COALESCE(b->>'duration', v.duration),
 *        description = COALESCE(b->>'description', v.description),
 *        exercise = CASE WHEN b ? 'exercise' THEN b->>'exercise' ELSE v.exercise END,
 *        learnings = CASE WHEN jsonb_typeof(b->'learnings') = 'array'
 *          THEN ARRAY(SELECT jsonb_array_elements_text(b->'learnings')) ELSE v.learnings END,
 *        "updatedAt" = now()
 *      FROM (SELECT d.note::jsonb->>'videoId' AS vid, d.note::jsonb->'before' AS b
 *            FROM "DataPatch" d WHERE d."patchId" LIKE 'video-remplacements-s26:v1:%') r
 *      WHERE v.id = r.vid;
 *    Après un retour arrière, l'ancienne URL redevient canonique et la nouvelle
 *    retombe sur la fiche par son préfixe d'id : pas de boucle, car
 *    `anciensSlugsVideo` ne s'applique qu'à une ligne qui porte le NOUVEL id.
 *  - Fail-safe : erreur DB sur une vidéo → loggée, les autres continuent ;
 *    jamais de throw. SANS IA. Tourne APRÈS `applyVideoDurationsS20Task`.
 */
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { isIsoVideoDuration } from "@/lib/video-duration-format";
import { videoTextFingerprint } from "@/lib/video-content-s20";
import remplacementsS26 from "@/data/video-remplacements-s26.json";

export interface VideoRemplacementS26Cible {
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  description?: string;
  learnings?: string[];
  exercise?: string;
}

export interface VideoRemplacementS26Entry {
  seedId: number;
  youtubeId: string;
  statut: "appliquer" | "en-attente";
  attendu: string;
  anciensTitres: string[];
  cible: VideoRemplacementS26Cible;
  memePassage?: string;
  raison?: string;
}

export interface VideoRemplacementsS26File {
  _meta: { version: number; [k: string]: unknown };
  videos: VideoRemplacementS26Entry[];
}

export interface VideoRemplacementS26Row {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  description: string;
  learnings: string[] | null;
  exercise: string | null;
}

type Field = "youtubeId" | "title" | "channelName" | "duration" | "description" | "learnings" | "exercise";
const FIELDS: Field[] = ["youtubeId", "title", "channelName", "duration", "description", "learnings", "exercise"];
type Values = Partial<Record<Field, string | string[] | null>>;

export type VideoRemplacementS26Plan =
  | { kind: "refus"; reason: string }
  | { kind: "update"; data: Values; before: Values };

const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

/** Décide, sans accès DB, ce que la ligne doit devenir (ou pourquoi refuser). */
export function planVideoRemplacementS26(row: VideoRemplacementS26Row, entry: VideoRemplacementS26Entry): VideoRemplacementS26Plan {
  const empreinte = videoTextFingerprint(row);
  if (empreinte !== entry.attendu) {
    return { kind: "refus", reason: `empreinte ${empreinte} ≠ attendu ${entry.attendu} (texte en base différent du texte s20 v1)` };
  }
  const c = entry.cible;
  for (const k of ["youtubeId", "title", "channelName"] as const) {
    if (!nonEmpty(c[k])) return { kind: "refus", reason: `cible.${k} vide` };
  }
  if (c.youtubeId === entry.youtubeId) return { kind: "refus", reason: "cible.youtubeId identique à l'ancien" };
  if (c.duration !== "" && !isIsoVideoDuration(c.duration)) {
    return { kind: "refus", reason: `cible.duration « ${c.duration} » ni vide ni ISO 8601` };
  }
  if (c.description !== undefined && !nonEmpty(c.description)) return { kind: "refus", reason: "cible.description vide" };
  if (c.exercise !== undefined && !nonEmpty(c.exercise)) return { kind: "refus", reason: "cible.exercise vide" };
  if (c.learnings !== undefined && (!Array.isArray(c.learnings) || c.learnings.length === 0 || !c.learnings.every(nonEmpty))) {
    return { kind: "refus", reason: "cible.learnings incomplets" };
  }
  const data: Values = {};
  const before: Values = {};
  for (const k of FIELDS) {
    const next = c[k];
    if (next === undefined) continue;
    const prev = row[k];
    if (JSON.stringify(prev) === JSON.stringify(next)) continue;
    data[k] = next;
    before[k] = prev;
  }
  return { kind: "update", data, before };
}

/** Données Prisma typées (+ `updatedAt`) depuis le plan. */
export function toRemplacementUpdateInput(data: Values, now: Date): Prisma.VideoUpdateInput {
  const out: Prisma.VideoUpdateInput = { updatedAt: now };
  if (typeof data.youtubeId === "string") out.youtubeId = data.youtubeId;
  if (typeof data.title === "string") out.title = data.title;
  if (typeof data.channelName === "string") out.channelName = data.channelName;
  if (typeof data.duration === "string") out.duration = data.duration;
  if (typeof data.description === "string") out.description = data.description;
  if (Array.isArray(data.learnings)) out.learnings = data.learnings;
  if (typeof data.exercise === "string") out.exercise = data.exercise;
  return out;
}

export interface VideoRemplacementsS26Result {
  version: number;
  updated: number;
  refused: number;
  done: number;
  missing: number;
  pending: number;
  unchanged: number;
  failed: number;
  summary: string;
}

export function formatVideoRemplacementsS26Summary(r: Omit<VideoRemplacementsS26Result, "summary">): string {
  const extras = [
    r.pending > 0 ? `${r.pending} en attente de textes` : "",
    r.missing > 0 ? `${r.missing} absente(s) en base` : "",
    r.unchanged > 0 ? `${r.unchanged} déjà à la cible` : "",
    r.failed > 0 ? `${r.failed} erreur(s) DB` : "",
  ].filter(Boolean);
  return (
    `remplacements vidéo s26 v${r.version} : ${r.updated} vidéo(s) remplacée(s), ${r.refused} refus garde-fou, ${r.done} déjà faite(s)` +
    (extras.length > 0 ? ` (${extras.join(", ")})` : "")
  );
}

const ROW_SELECT = {
  id: true,
  youtubeId: true,
  title: true,
  channelName: true,
  duration: true,
  description: true,
  learnings: true,
  exercise: true,
} as const;

export const VIDEO_REMPLACEMENTS_S26_PREFIX = "video-remplacements-s26";

export async function applyVideoRemplacementsS26Task(
  db: typeof prisma = prisma,
  file: VideoRemplacementsS26File = remplacementsS26 as VideoRemplacementsS26File,
): Promise<VideoRemplacementsS26Result> {
  const version = file._meta?.version ?? 1;
  const counts = { version, updated: 0, refused: 0, done: 0, missing: 0, pending: 0, unchanged: 0, failed: 0 };
  const refuse = (entry: VideoRemplacementS26Entry, reason: string) => {
    counts.refused++;
    console.error(
      `[startup] remplacements vidéo s26 v${version} : GARDE-FOU, fiche ${entry.seedId} (${entry.youtubeId}) NON remplacée : ${reason}. Aucune écriture, pas de marqueur.`,
    );
  };
  const entries = file.videos ?? [];
  const actives = entries.filter((e) => e.statut === "appliquer");
  counts.pending = entries.length - actives.length;

  const prefix = `${VIDEO_REMPLACEMENTS_S26_PREFIX}:v${version}:`;
  let markers: Set<string>;
  try {
    const rows = await withDbRetry(
      () => db.dataPatch.findMany({ where: { patchId: { startsWith: prefix } }, select: { patchId: true } }),
      { label: "video-remplacements-s26:markers" },
    );
    markers = new Set(rows.map((r) => r.patchId));
  } catch (err) {
    console.error("[startup] remplacements vidéo s26 : lecture des marqueurs échouée (non bloquant) :", err);
    return { ...counts, failed: 1, summary: `remplacements vidéo s26 v${version} : non exécutée (base injoignable)` };
  }

  for (const entry of actives) {
    const patchId = `${prefix}${entry.youtubeId}`;
    if (markers.has(patchId)) {
      counts.done++;
      continue;
    }
    try {
      const row: VideoRemplacementS26Row | null = await withDbRetry(
        () => db.video.findUnique({ where: { youtubeId: entry.youtubeId }, select: ROW_SELECT }),
        { label: `video-remplacements-s26:find(${entry.youtubeId})` },
      );
      if (!row) {
        counts.missing++;
        console.warn(`[startup] remplacements vidéo s26 : fiche ${entry.seedId} (${entry.youtubeId}) absente en base, ignorée.`);
        continue;
      }
      const plan = planVideoRemplacementS26(row, entry);
      if (plan.kind === "refus") {
        refuse(entry, plan.reason);
        continue;
      }
      const taken = await withDbRetry(
        () => db.video.findUnique({ where: { youtubeId: entry.cible.youtubeId }, select: { id: true } }),
        { label: `video-remplacements-s26:unique(${entry.cible.youtubeId})` },
      );
      if (taken && taken.id !== row.id) {
        refuse(entry, `youtubeId cible ${entry.cible.youtubeId} déjà porté par la ligne ${taken.id}`);
        continue;
      }
      const changed = Object.keys(plan.data);
      const note = JSON.stringify({
        patch: VIDEO_REMPLACEMENTS_S26_PREFIX,
        version,
        seedId: entry.seedId,
        videoId: row.id,
        youtubeId: entry.youtubeId,
        changed,
        before: plan.before,
      });
      const marker = db.dataPatch.create({ data: { patchId, note } });
      const ops =
        changed.length > 0
          ? [db.video.update({ where: { id: row.id }, data: toRemplacementUpdateInput(plan.data, new Date()) }), marker]
          : [marker];
      await withDbRetry(() => db.$transaction(ops), { label: `video-remplacements-s26:apply(${entry.youtubeId})` });
      if (changed.length > 0) counts.updated++;
      else counts.unchanged++;
    } catch (err) {
      counts.failed++;
      console.error(`[startup] remplacements vidéo s26 échoué pour "${entry.youtubeId}" (non bloquant) :`, err);
    }
  }

  const summary = formatVideoRemplacementsS26Summary(counts);
  console.log(`[startup] ${summary}.`);
  return { ...counts, summary };
}
