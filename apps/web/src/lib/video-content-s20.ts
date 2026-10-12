/**
 * Contenus des fiches vidéo s20 (décision Thomas du 12/10) : applique, fiche par
 * fiche, la version gagnante du duel (s11 corrigée, s11, ou réécrite en neutre)
 * bundlée dans `src/data/video-content-s20.json` (généré par script, relu).
 * Doc : `docs/copy/application-videos-s20.md`.
 *
 * Tâche DÉDIÉE : ne passe pas par `catalogue-content` (dont la version ne bouge
 * pas, garde-fou s20 de `startup-tasks.ts`).
 *
 * Garanties :
 *  - Garde-fou : une fiche n'est écrite QUE si son texte en base est encore celui
 *    lu le 12/10 : sha256(JSON.stringify([title, description, learnings ?? null,
 *    exercise ?? null])) en hex, 16 premiers caractères, égal à `attendu`. Sinon
 *    (texte retouché depuis) : refus « GARDE-FOU » journalisé, aucune écriture,
 *    pas de marqueur (l'alerte revient à chaque boot).
 *  - `cible.youtubeId` (fiche 68) : refus si une autre ligne porte déjà l'id
 *    (colonne `@unique`). `cible.category` : refus si hors enum `TipCategory`.
 *  - Idempotent : marqueur `DataPatch` "video-content-s20:v<version>:<youtubeId
 *    d'origine>" posé dans la MÊME transaction que l'update → 2e boot = 0 update
 *    (marqueurs lus en une seule requête).
 *  - Réversible : `DataPatch.note` (JSON) garde `videoId` et, dans `before`, la
 *    valeur précédente de chaque champ modifié. Retour arrière (Postgres), en
 *    GARDANT les marqueurs (les supprimer ferait ré-appliquer au boot suivant,
 *    l'ancien texte repassant le garde-fou) :
 *      UPDATE "Video" v SET
 *        title = COALESCE(b->>'title', v.title),
 *        "channelName" = COALESCE(b->>'channelName', v."channelName"),
 *        "youtubeId" = COALESCE(b->>'youtubeId', v."youtubeId"),
 *        category = COALESCE((b->>'category')::"TipCategory", v.category),
 *        description = COALESCE(b->>'description', v.description),
 *        exercise = CASE WHEN b ? 'exercise' THEN b->>'exercise' ELSE v.exercise END,
 *        learnings = CASE WHEN jsonb_typeof(b->'learnings') = 'array'
 *          THEN ARRAY(SELECT jsonb_array_elements_text(b->'learnings'))
 *          WHEN b ? 'learnings' THEN NULL ELSE v.learnings END,
 *        "updatedAt" = now()
 *      FROM (SELECT d.note::jsonb->>'videoId' AS vid, d.note::jsonb->'before' AS b
 *            FROM "DataPatch" d WHERE d."patchId" LIKE 'video-content-s20:v1:%') r
 *      WHERE v.id = r.vid;
 *  - Fail-safe : erreur DB sur une fiche → loggée, les autres continuent ;
 *    jamais de throw (ne bloque pas le boot). SANS IA.
 *  - Tourne APRÈS `stripVideoEmDashesTask` (empreintes calculées sur le texte
 *    sans tirets ; le texte cible n'en contient aucun).
 */
import { createHash } from "crypto";
import { Prisma, TipCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import videoContentS20 from "@/data/video-content-s20.json";

export interface VideoContentS20Cible {
  description: string;
  learnings: string[];
  exercise: string;
  title?: string;
  category?: string;
  channelName?: string;
  youtubeId?: string;
}

export interface VideoContentS20Fiche {
  seedId: number;
  youtubeId: string;
  attendu: string;
  source: string;
  cible: VideoContentS20Cible;
}

export interface VideoContentS20File {
  _meta: { version: number; [k: string]: unknown };
  fiches: VideoContentS20Fiche[];
}

/** Ligne `Video` telle que lue par Prisma (`learnings` NULL possible en base). */
export interface VideoContentS20Row {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  category: string;
  description: string;
  learnings: string[] | null;
  exercise: string | null;
}

type Field = "title" | "channelName" | "youtubeId" | "category" | "description" | "learnings" | "exercise";
const FIELDS: Field[] = ["title", "channelName", "youtubeId", "category", "description", "learnings", "exercise"];

/** Empreinte du texte en base, même calcul que le script générateur du JSON. */
export function videoTextFingerprint(v: Pick<VideoContentS20Row, "title" | "description" | "learnings" | "exercise">): string {
  const payload = JSON.stringify([v.title, v.description, v.learnings ?? null, v.exercise ?? null]);
  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

export function isTipCategory(value: string): value is TipCategory {
  return (Object.values(TipCategory) as string[]).includes(value);
}

export type VideoContentS20Plan =
  | { kind: "refus"; reason: string }
  | { kind: "update"; data: Partial<Record<Field, string | string[] | null>>; before: Partial<Record<Field, string | string[] | null>> };

/** Décide, sans accès DB, ce que la fiche doit devenir (ou pourquoi refuser). */
export function planVideoContentS20(row: VideoContentS20Row, fiche: VideoContentS20Fiche): VideoContentS20Plan {
  const empreinte = videoTextFingerprint(row);
  if (empreinte !== fiche.attendu) {
    return { kind: "refus", reason: `empreinte ${empreinte} ≠ attendu ${fiche.attendu} (texte modifié depuis le 12/10)` };
  }
  const c = fiche.cible;
  const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;
  if (!nonEmpty(c.description) || !nonEmpty(c.exercise)) return { kind: "refus", reason: "cible incomplète (description/exercise)" };
  if (!Array.isArray(c.learnings) || c.learnings.length === 0 || !c.learnings.every(nonEmpty)) {
    return { kind: "refus", reason: "cible incomplète (learnings)" };
  }
  for (const k of ["title", "channelName", "youtubeId", "category"] as const) {
    if (c[k] !== undefined && !nonEmpty(c[k])) return { kind: "refus", reason: `cible.${k} vide` };
  }
  if (c.category !== undefined && !isTipCategory(c.category)) {
    return { kind: "refus", reason: `catégorie « ${c.category} » hors enum TipCategory` };
  }

  const data: Partial<Record<Field, string | string[] | null>> = {};
  const before: Partial<Record<Field, string | string[] | null>> = {};
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

type VideoPlanData = Extract<VideoContentS20Plan, { kind: "update" }>["data"];

/** Données Prisma typées (+ `updatedAt`) depuis le plan. */
export function toVideoUpdateInput(data: VideoPlanData, now: Date): Prisma.VideoUpdateInput {
  const out: Prisma.VideoUpdateInput = { updatedAt: now };
  if (typeof data.title === "string") out.title = data.title;
  if (typeof data.channelName === "string") out.channelName = data.channelName;
  if (typeof data.youtubeId === "string") out.youtubeId = data.youtubeId;
  if (typeof data.category === "string" && isTipCategory(data.category)) out.category = data.category;
  if (typeof data.description === "string") out.description = data.description;
  if (Array.isArray(data.learnings)) out.learnings = data.learnings;
  if (typeof data.exercise === "string") out.exercise = data.exercise;
  return out;
}

export interface VideoContentS20Result {
  version: number;
  updated: number;
  refused: number;
  done: number;
  missing: number;
  unchanged: number;
  failed: number;
  summary: string;
}

export function formatVideoContentS20Summary(r: Omit<VideoContentS20Result, "summary">): string {
  const extras = [
    r.missing > 0 ? `${r.missing} absente(s) en base` : "",
    r.unchanged > 0 ? `${r.unchanged} déjà au texte cible` : "",
    r.failed > 0 ? `${r.failed} erreur(s) DB` : "",
  ].filter(Boolean);
  return (
    `contenus vidéo s20 v${r.version} : ${r.updated} fiche(s) mise(s) à jour, ${r.refused} refus garde-fou, ${r.done} déjà faite(s)` +
    (extras.length > 0 ? ` (${extras.join(", ")})` : "")
  );
}

const ROW_SELECT = {
  id: true,
  youtubeId: true,
  title: true,
  channelName: true,
  category: true,
  description: true,
  learnings: true,
  exercise: true,
} as const;

export async function applyVideoContentS20Task(
  db: typeof prisma = prisma,
  file: VideoContentS20File = videoContentS20 as VideoContentS20File,
): Promise<VideoContentS20Result> {
  const version = file._meta?.version ?? 1;
  const counts = { version, updated: 0, refused: 0, done: 0, missing: 0, unchanged: 0, failed: 0 };
  const refuse = (fiche: VideoContentS20Fiche, reason: string) => {
    counts.refused++;
    console.error(
      `[startup] contenus vidéo s20 v${version} : GARDE-FOU, fiche ${fiche.seedId} (${fiche.youtubeId}) NON écrite : ${reason}. Aucune écriture, pas de marqueur.`,
    );
  };

  // Marqueurs lus en UNE requête (sinon 86 allers-retours à chaque boot).
  const prefix = `video-content-s20:v${version}:`;
  let markers: Set<string>;
  try {
    const rows = await withDbRetry(
      () => db.dataPatch.findMany({ where: { patchId: { startsWith: prefix } }, select: { patchId: true } }),
      { label: "video-content-s20:markers" },
    );
    markers = new Set(rows.map((r) => r.patchId));
  } catch (err) {
    console.error("[startup] contenus vidéo s20 : lecture des marqueurs échouée (non bloquant) :", err);
    const summary = `contenus vidéo s20 v${version} : non exécutée (base injoignable)`;
    return { ...counts, failed: 1, summary };
  }

  for (const fiche of file.fiches ?? []) {
    const patchId = `${prefix}${fiche.youtubeId}`;
    if (markers.has(patchId)) {
      counts.done++;
      continue;
    }
    try {
      const row: VideoContentS20Row | null = await withDbRetry(
        () => db.video.findUnique({ where: { youtubeId: fiche.youtubeId }, select: ROW_SELECT }),
        { label: `video-content-s20:find(${fiche.youtubeId})` },
      );
      if (!row) {
        counts.missing++;
        console.warn(`[startup] contenus vidéo s20 : fiche ${fiche.seedId} (${fiche.youtubeId}) absente en base, ignorée.`);
        continue;
      }
      const plan = planVideoContentS20(row, fiche);
      if (plan.kind === "refus") {
        refuse(fiche, plan.reason);
        continue;
      }
      const newId = plan.data.youtubeId;
      if (typeof newId === "string") {
        const taken = await withDbRetry(
          () => db.video.findUnique({ where: { youtubeId: newId }, select: { id: true } }),
          { label: `video-content-s20:unique(${newId})` },
        );
        if (taken && taken.id !== row.id) {
          refuse(fiche, `youtubeId cible ${newId} déjà porté par la ligne ${taken.id}`);
          continue;
        }
      }
      const changed = Object.keys(plan.data);
      const note = JSON.stringify({
        patch: "video-content-s20",
        version,
        seedId: fiche.seedId,
        source: fiche.source,
        videoId: row.id,
        youtubeId: fiche.youtubeId,
        changed,
        before: plan.before,
      });
      const ops =
        changed.length > 0
          ? [
              db.video.update({ where: { id: row.id }, data: toVideoUpdateInput(plan.data, new Date()) }),
              db.dataPatch.create({ data: { patchId, note } }),
            ]
          : [db.dataPatch.create({ data: { patchId, note } })];
      await withDbRetry(() => db.$transaction(ops), { label: `video-content-s20:apply(${fiche.youtubeId})` });
      if (changed.length > 0) counts.updated++;
      else counts.unchanged++;
    } catch (err) {
      counts.failed++;
      console.error(`[startup] contenus vidéo s20 échoué pour "${fiche.youtubeId}" (non bloquant) :`, err);
    }
  }

  const summary = formatVideoContentS20Summary(counts);
  console.log(`[startup] ${summary}.`);
  return { ...counts, summary };
}
