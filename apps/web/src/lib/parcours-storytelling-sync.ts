/**
 * Tâche de démarrage s18 : import du parcours Storytelling (même mécanisme que s17,
 * `parcours-content-sync.ts`). Contenu : `docs/content/parcours-storytelling-s18.json`.
 *
 * Dans l'ordre (chaque écriture garde l'ancien état dans `DataPatch.note`) :
 *  1. conseils des étapes 1, 4 et 5 : textes validés + `isActive = true`, par id
 *     (audit s14), seulement si le titre en base est bien celui attendu ;
 *  2. retouches de défi : repli solo de l'étape 3 (toujours), défi B du callback
 *     (étape 6) seulement une fois publié (il cite le parcours) ;
 *  3. 5 vannes neuves de l'étape 5 : créées si leur texte exact n'existe pas ;
 *  4. parcours `storytelling` et ses 6 étapes : créés ou réalignés, `isActive` =
 *     `STORYTELLING_PUBLIE` ;
 *  5. contrôle : les 30 vannes des étapes existent et sont actives (journal).
 *
 * Idempotente et fail-safe : marqueur par élément, puis marqueur global
 * `parcours-storytelling:s18-v1:publie=<bool>` posé seulement si tout a réussi
 * (un démarrage suivant ne fait alors qu'une lecture). Changer l'interrupteur
 * change le marqueur global : la tâche repasse et réaligne `isActive`.
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";
import { STORYTELLING_IMPORT, STORYTELLING_SEED } from "@/lib/parcours-seed";
import { defiApresRetouche } from "@/lib/parcours-content-sync";

export const STORYTELLING_SLUG = "storytelling";
export const STORYTELLING_PATCH_PREFIX = "parcours-storytelling:s18:";
/** BUMP MANUEL (v2, v3…) après toute nouvelle retouche du contenu stocké en base. */
export const STORYTELLING_PATCH_VERSION = "s18-v1";

export function storytellingGlobalPatchId(publie: boolean = STORYTELLING_PUBLIE): string {
  return `parcours-storytelling:${STORYTELLING_PATCH_VERSION}:publie=${publie}`;
}

/** Identifiant stable de la i-ième vanne neuve (création rejouable sans doublon). */
export function vanneNeuveId(index: number): string {
  return `cs18jkstory5v${index + 1}`;
}

type Difficulty = "DEBUTANT" | "INTERMEDIAIRE" | "EXPERT";
type JokeCategory =
  | "AUTODERISION" | "SITUATION" | "ABSURDE" | "OBSERVATIONNEL" | "JEUX_DE_MOTS" | "CULTUREL" | "COUPLE"
  | "BOULOT" | "ECOLE" | "GAMING" | "RESEAUX_SOCIAUX" | "DATING" | "SOIREES" | "PARENTS";

export interface StorytellingSyncResult {
  conseils: { updated: string[]; unchanged: number; refused: string[] };
  defis: { updated: string[]; unchanged: number; skipped: string[]; missing: string[] };
  vannes: { created: string[]; existing: number };
  path: { created: boolean; updated: boolean; isActive: boolean | null };
  steps: { created: number; updated: number; tipsMissing: string[] };
  jokesMissing: string[];
  errors: string[];
}

function emptyResult(): StorytellingSyncResult {
  return {
    conseils: { updated: [], unchanged: 0, refused: [] },
    defis: { updated: [], unchanged: 0, skipped: [], missing: [] },
    vannes: { created: [], existing: 0 },
    path: { created: false, updated: false, isActive: null },
    steps: { created: 0, updated: 0, tipsMissing: [] },
    jokesMissing: [],
    errors: [],
  };
}

async function hasMarker(patchId: string): Promise<boolean> {
  const row = await withDbRetry(() => prisma.dataPatch.findUnique({ where: { patchId } }), {
    label: "storytelling:marker:check",
  });
  return !!row;
}

function note(value: unknown): string {
  return JSON.stringify(value).slice(0, 8000);
}

/** 1. Conseils des étapes 1, 4 et 5 : réactivés avec le texte validé (étalons §1). */
export async function reactivateStorytellingTips(result: StorytellingSyncResult): Promise<void> {
  for (const c of STORYTELLING_IMPORT.conseilsReactives) {
    const patchId = `${STORYTELLING_PATCH_PREFIX}conseil:${c.id}`;
    if (await hasMarker(patchId)) {
      result.conseils.unchanged++;
      continue;
    }
    const tip = await withDbRetry(
      () =>
        prisma.tip.findUnique({
          where: { id: c.id },
          select: { id: true, title: true, isActive: true, content: true, example: true, exercise: true, originalContent: true },
        }),
      { label: "storytelling:tip:find" },
    );
    // Revérification avant écriture : id absent ou titre différent = aucune écriture.
    if (!tip || tip.title !== c.title) {
      result.conseils.refused.push(`${c.id} (${tip ? `titre « ${tip.title} »` : "absent"})`);
      continue;
    }
    const same = tip.isActive && tip.content === c.content && tip.example === c.example && tip.exercise === c.exercise;
    const before = { tipId: tip.id, isActive: tip.isActive, content: tip.content, example: tip.example, exercise: tip.exercise };
    const mark = () => prisma.dataPatch.create({ data: { patchId, note: note(before) } });
    if (same) {
      await withDbRetry(mark, { label: "storytelling:tip:mark" });
      result.conseils.unchanged++;
      continue;
    }
    await withDbRetry(
      () =>
        prisma.$transaction([
          prisma.tip.update({
            where: { id: tip.id },
            data: {
              isActive: true,
              content: c.content,
              example: c.example,
              exercise: c.exercise,
              // Même trace que la phase 2 de l'audit s18 (version 18, texte réécrit).
              copyVerdict: "REECRIRE",
              copyReviewVersion: 18,
              copyReviewedAt: new Date(),
              ...(tip.originalContent ? {} : { originalContent: tip.content }),
            },
          }),
          mark(),
        ]),
      { label: "storytelling:tip:update" },
    );
    result.conseils.updated.push(c.title);
  }
}

/** 2. Retouches de défi (étalons §7). Le défi B de l'étape 6 attend la publication. */
export async function applyStorytellingDefis(
  result: StorytellingSyncResult,
  publie: boolean = STORYTELLING_PUBLIE,
): Promise<void> {
  for (const r of STORYTELLING_IMPORT.defisRetouches) {
    const attendPublication = r.cle === "storytelling-6";
    if (attendPublication && !publie) {
      result.defis.skipped.push(r.cle);
      continue;
    }
    const patchId = `${STORYTELLING_PATCH_PREFIX}defi:${r.cle}`;
    if (await hasMarker(patchId)) {
      result.defis.unchanged++;
      continue;
    }
    const tip = await withDbRetry(
      () =>
        prisma.tip.findFirst({
          where: { title: r.tipTitle, isActive: true },
          orderBy: { createdAt: "asc" },
          select: { id: true, exercise: true },
        }),
      { label: "storytelling:defi:find" },
    );
    if (!tip) {
      result.defis.missing.push(r.cle);
      continue;
    }
    const before = tip.exercise ?? "";
    const separateur = "separateur" in r && typeof r.separateur === "string" ? r.separateur : " ";
    const after = before.includes(r.ajouterALaFin)
      ? null
      : separateur === " "
        ? defiApresRetouche(before, { mode: "ajouter", texte: r.ajouterALaFin })
        : `${before.trimEnd()}${separateur}${r.ajouterALaFin}`;
    const mark = () =>
      prisma.dataPatch.create({ data: { patchId, note: note({ tipId: tip.id, before, after: after ?? before }) } });
    if (after === null) {
      await withDbRetry(mark, { label: "storytelling:defi:mark" });
      result.defis.unchanged++;
      continue;
    }
    await withDbRetry(
      () => prisma.$transaction([prisma.tip.update({ where: { id: tip.id }, data: { exercise: after } }), mark()]),
      { label: "storytelling:defi:update" },
    );
    result.defis.updated.push(r.cle);
  }
}

/** 3. Vannes neuves de l'étape 5 (validées à l'aveugle) : créées si absentes. */
export async function createStorytellingJokes(result: StorytellingSyncResult): Promise<void> {
  const neuves = STORYTELLING_IMPORT.vannesNeuvesEtape5;
  for (const [i, v] of neuves.entries()) {
    const patchId = `${STORYTELLING_PATCH_PREFIX}vanne:${i + 1}`;
    if (await hasMarker(patchId)) {
      result.vannes.existing++;
      continue;
    }
    const existing = await withDbRetry(
      () => prisma.joke.findFirst({ where: { content: v.content }, select: { id: true, isActive: true } }),
      { label: "storytelling:joke:find" },
    );
    if (existing) {
      await withDbRetry(
        () => prisma.dataPatch.create({ data: { patchId, note: note({ existing: existing.id, isActive: existing.isActive }) } }),
        { label: "storytelling:joke:mark" },
      );
      result.vannes.existing++;
      continue;
    }
    const id = vanneNeuveId(i);
    await withDbRetry(
      () =>
        prisma.$transaction([
          prisma.joke.create({
            data: {
              id,
              content: v.content,
              punchline: v.punchline,
              category: v.category as JokeCategory,
              type: "STORY",
              maturityLevel: 1,
              isActive: true,
              generatedByAI: false,
              comedyTechnique: v.comedyTechnique,
              techniqueExplanation: v.techniqueExplanation,
              // Même statut que les vannes validées du catalogue (GARDER, charte v1).
              copyVerdict: "GARDER",
              copyReviewVersion: 1,
              copyReviewedAt: new Date(),
            },
          }),
          prisma.dataPatch.create({ data: { patchId, note: note({ created: id }) } }),
        ]),
      { label: "storytelling:joke:create" },
    );
    result.vannes.created.push(id);
  }
}

/** 4. Parcours et étapes : créés s'ils manquent, réalignés sinon ; `isActive` = interrupteur. */
export async function syncStorytellingPath(
  result: StorytellingSyncResult,
  publie: boolean = STORYTELLING_PUBLIE,
): Promise<void> {
  const seed = STORYTELLING_SEED;
  const fields = {
    title: seed.title,
    description: seed.description,
    duration: seed.duration,
    difficulty: seed.difficulty as Difficulty,
    icon: seed.icon,
    order: seed.order,
  };
  let row = await withDbRetry(
    () =>
      prisma.learningPath.findUnique({
        where: { slug: STORYTELLING_SLUG },
        select: {
          id: true, title: true, description: true, duration: true, difficulty: true, icon: true, order: true, isActive: true,
          steps: { select: { id: true, order: true, dayNumber: true, tip: { select: { id: true, title: true } } } },
        },
      }),
    { label: "storytelling:path:find" },
  );
  if (!row) {
    row = await withDbRetry(
      () =>
        prisma.learningPath.create({
          data: { slug: STORYTELLING_SLUG, ...fields, isActive: publie },
          select: {
            id: true, title: true, description: true, duration: true, difficulty: true, icon: true, order: true, isActive: true,
            steps: { select: { id: true, order: true, dayNumber: true, tip: { select: { id: true, title: true } } } },
          },
        }),
      { label: "storytelling:path:create" },
    );
    result.path.created = true;
  } else {
    const current = row;
    const diff = Object.fromEntries(
      Object.entries({ ...fields, isActive: publie }).filter(([k, v]) => current[k as keyof typeof current] !== v),
    );
    if (Object.keys(diff).length > 0) {
      await withDbRetry(() => prisma.learningPath.update({ where: { id: current.id }, data: diff }), {
        label: "storytelling:path:update",
      });
      result.path.updated = true;
    }
  }
  result.path.isActive = publie;

  const titles = seed.steps.map((s) => s.tipTitle);
  const tips = await withDbRetry(
    () =>
      prisma.tip.findMany({
        where: { title: { in: titles }, isActive: true },
        select: { id: true, title: true },
        orderBy: { createdAt: "asc" },
      }),
    { label: "storytelling:tips:find" },
  );
  const tipIdByTitle = new Map<string, string>();
  for (const t of tips) if (!tipIdByTitle.has(t.title)) tipIdByTitle.set(t.title, t.id);
  const pathId = row.id;
  const stepByOrder = new Map(row.steps.map((s) => [s.order, s]));
  for (const s of seed.steps) {
    const current = stepByOrder.get(s.week);
    if (current && current.tip.title === s.tipTitle && current.dayNumber === s.dayNumber) continue;
    const tipId = current?.tip.title === s.tipTitle ? current.tip.id : tipIdByTitle.get(s.tipTitle);
    if (!tipId) {
      result.steps.tipsMissing.push(`étape ${s.week} : « ${s.tipTitle} »`);
      continue;
    }
    if (current) {
      await withDbRetry(
        () => prisma.learningPathStep.update({ where: { id: current.id }, data: { tipId, dayNumber: s.dayNumber } }),
        { label: "storytelling:step:update" },
      );
      result.steps.updated++;
    } else {
      await withDbRetry(
        () => prisma.learningPathStep.create({ data: { learningPathId: pathId, tipId, order: s.week, dayNumber: s.dayNumber } }),
        { label: "storytelling:step:create" },
      );
      result.steps.created++;
    }
  }
}

/** 5. Les 30 vannes des étapes, désignées par leur texte exact, existent et sont actives. */
export async function checkStorytellingJokes(result: StorytellingSyncResult): Promise<void> {
  const contents = STORYTELLING_SEED.steps.flatMap((s) => s.jokeContents);
  const rows = await withDbRetry(
    () => prisma.joke.findMany({ where: { content: { in: contents }, isActive: true }, select: { content: true } }),
    { label: "storytelling:jokes:check" },
  );
  const found = new Set(rows.map((r) => r.content));
  result.jokesMissing = contents.filter((c) => !found.has(c)).map((c) => c.slice(0, 60));
}

function summary(r: StorytellingSyncResult): string {
  return (
    `conseils ${r.conseils.updated.length} réactivé(s), ${r.conseils.unchanged} déjà faits, refusés [${r.conseils.refused.join(", ")}] ; ` +
    `défis ${r.defis.updated.join(", ") || "0"} retouché(s), en attente [${r.defis.skipped.join(", ")}], introuvables [${r.defis.missing.join(", ")}] ; ` +
    `vannes neuves ${r.vannes.created.length} créée(s), ${r.vannes.existing} déjà là ; ` +
    `parcours ${r.path.created ? "créé" : r.path.updated ? "mis à jour" : "inchangé"} (isActive=${r.path.isActive}) ; ` +
    `étapes ${r.steps.created} créée(s), ${r.steps.updated} mise(s) à jour, conseils absents [${r.steps.tipsMissing.join(" ; ")}] ; ` +
    `vannes d'étape manquantes ou inactives : ${r.jokesMissing.length}`
  );
}

/** Tâche de démarrage (appelée par `runStartupTasks`), jamais bloquante. */
export async function applyStorytellingImportTask(publie: boolean = STORYTELLING_PUBLIE): Promise<StorytellingSyncResult | null> {
  const globalId = storytellingGlobalPatchId(publie);
  try {
    if (await hasMarker(globalId)) {
      console.log(`[startup] ${globalId} déjà appliqué (skip).`);
      return null;
    }
  } catch (err) {
    console.error("[startup] storytelling : lecture du marqueur échouée (non bloquant) :", err);
    return null;
  }
  const r = emptyResult();
  const steps: Array<[string, () => Promise<void>]> = [
    ["conseils", () => reactivateStorytellingTips(r)],
    ["défis", () => applyStorytellingDefis(r, publie)],
    ["vannes", () => createStorytellingJokes(r)],
    ["parcours", () => syncStorytellingPath(r, publie)],
    ["contrôle des vannes", () => checkStorytellingJokes(r)],
  ];
  for (const [label, run] of steps) {
    try {
      await run();
    } catch (err) {
      // Course entre 2 workers (marqueur unique) ou base froide : réessai au prochain démarrage.
      r.errors.push(label);
      console.error(`[startup] storytelling (${label}) échoué (non bloquant) :`, err);
    }
  }
  const text = summary(r);
  console.log(`[startup] ${globalId} : ${text}.`);
  const complet =
    r.errors.length === 0 &&
    r.conseils.refused.length === 0 &&
    r.defis.missing.length === 0 &&
    r.steps.tipsMissing.length === 0 &&
    r.jokesMissing.length === 0;
  if (!complet) {
    console.warn(`[startup] storytelling incomplet : marqueur non posé, nouvel essai au prochain démarrage.`);
    return r;
  }
  try {
    await withDbRetry(
      () => prisma.dataPatch.upsert({ where: { patchId: globalId }, create: { patchId: globalId, note: text.slice(0, 2000) }, update: {} }),
      { label: "storytelling:mark" },
    );
  } catch (err) {
    console.error("[startup] storytelling : marqueur global non posé (non bloquant) :", err);
  }
  return r;
}
