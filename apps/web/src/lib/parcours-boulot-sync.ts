/**
 * Tâche de démarrage s19 : import du parcours Boulot (même mécanisme que s18,
 * `parcours-storytelling-sync.ts`). Contenu : `docs/content/parcours-boulot-s19.json`,
 * liste d'import : `docs/marrant/parcours-boulot-s19/import-boulot.md`.
 *
 * Dans l'ordre (chaque écriture garde l'ancien état dans `DataPatch.note`) :
 *  1. 6 conseils : 4 existants (étapes 2 à 5, par id, seulement si le titre en base est
 *     celui attendu) remplacés ou réactivés avec le texte validé, 2 neufs (étapes 1 et 6)
 *     créés s'ils manquent ; `generatedByAI = false` écrit explicitement (hors de portée
 *     de la relecture IA), trace REECRIRE / 18 comme s18 ;
 *  2. 10 vannes neuves BOULOT : créées si leur texte exact n'existe pas ;
 *  3. contrôle des 20 vannes en ligne désignées par id (texte identique, active) ;
 *  4. parcours `boulot` et ses 6 étapes : créés ou réalignés, `isActive` = `BOULOT_PUBLIE` ;
 *  5. contrôle : les 30 vannes des étapes existent et sont actives (journal).
 *
 * Idempotente et fail-safe : marqueur par élément, puis marqueur global
 * `parcours-boulot:s19-v1:publie=<bool>` posé seulement si tout a réussi. Changer
 * l'interrupteur change le marqueur global : la tâche repasse et réaligne `isActive`.
 * Retour arrière : voir REPLIT_ACTIONS.md (entrée s19), notes des marqueurs `parcours-boulot:s19:*`.
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { BOULOT_PUBLIE } from "@/config/parcours-publication";
import { BOULOT_IMPORT, BOULOT_SEED } from "@/lib/parcours-seed";

export const BOULOT_SLUG = "boulot";
export const BOULOT_PATCH_PREFIX = "parcours-boulot:s19:";
/** BUMP MANUEL (v2, v3…) après toute nouvelle retouche du contenu stocké en base. */
export const BOULOT_PATCH_VERSION = "s19-v1";

export function boulotGlobalPatchId(publie: boolean = BOULOT_PUBLIE): string {
  return `parcours-boulot:${BOULOT_PATCH_VERSION}:publie=${publie}`;
}

/** Identifiants stables des créations (rejouables sans doublon). */
export function boulotTipId(etape: number): string {
  return `cs19tipboulot${etape}`;
}
export function boulotJokeId(index: number): string {
  return `cs19jkboulot${index + 1}`;
}

type Difficulty = "DEBUTANT" | "INTERMEDIAIRE" | "EXPERT";
type TipCategory = "TIMING" | "AUTODERISION" | "OBSERVATION" | "REPARTIE" | "STORYTELLING" | "ABSURDE" | "JEUX_DE_MOTS";
type JokeCategory =
  | "AUTODERISION" | "SITUATION" | "ABSURDE" | "OBSERVATIONNEL" | "JEUX_DE_MOTS" | "CULTUREL" | "COUPLE"
  | "BOULOT" | "ECOLE" | "GAMING" | "RESEAUX_SOCIAUX" | "DATING" | "SOIREES" | "PARENTS";

export interface BoulotSyncResult {
  conseils: { updated: string[]; created: string[]; unchanged: number; refused: string[] };
  vannes: { created: string[]; existing: number };
  /** Vannes en ligne liées : écarts bloquants, et celles marquées `generatedByAI` (information). */
  vannesEnLigne: { problems: string[]; generatedByAI: string[] };
  path: { created: boolean; updated: boolean; isActive: boolean | null };
  steps: { created: number; updated: number; tipsMissing: string[] };
  jokesMissing: string[];
  errors: string[];
}

function emptyResult(): BoulotSyncResult {
  return {
    conseils: { updated: [], created: [], unchanged: 0, refused: [] },
    vannes: { created: [], existing: 0 },
    vannesEnLigne: { problems: [], generatedByAI: [] },
    path: { created: false, updated: false, isActive: null },
    steps: { created: 0, updated: 0, tipsMissing: [] },
    jokesMissing: [],
    errors: [],
  };
}

async function hasMarker(patchId: string): Promise<boolean> {
  const row = await withDbRetry(() => prisma.dataPatch.findUnique({ where: { patchId } }), {
    label: "boulot:marker:check",
  });
  return !!row;
}

/** Note de marqueur : JSON complet (jamais tronqué, sinon le retour arrière serait illisible). */
function note(value: unknown): string {
  return JSON.stringify(value);
}

const TIP_SELECT = {
  id: true, title: true, isActive: true, content: true, example: true, exercise: true, category: true,
  difficulty: true, generatedByAI: true, originalContent: true, copyVerdict: true, copyReviewVersion: true,
  copyReviewedAt: true,
} as const;

/** 1. Conseils des 6 étapes (import-boulot.md §3). */
export async function syncBoulotTips(result: BoulotSyncResult): Promise<void> {
  for (const c of BOULOT_IMPORT.conseils) {
    const patchId = `${BOULOT_PATCH_PREFIX}conseil:${c.etape}`;
    if (await hasMarker(patchId)) {
      result.conseils.unchanged++;
      continue;
    }
    const tip = c.id
      ? await withDbRetry(() => prisma.tip.findUnique({ where: { id: c.id as string }, select: TIP_SELECT }), {
          label: "boulot:tip:find",
        })
      : await withDbRetry(
          () => prisma.tip.findFirst({ where: { title: c.title }, orderBy: { createdAt: "asc" }, select: TIP_SELECT }),
          { label: "boulot:tip:findByTitle" },
        );
    // Revérification avant écriture : id absent ou titre différent = aucune écriture.
    if (c.id && (!tip || tip.title !== c.title)) {
      result.conseils.refused.push(`${c.id} (${tip ? `titre « ${tip.title} »` : "absent"})`);
      continue;
    }
    const texte = {
      isActive: true,
      content: c.content,
      example: c.example,
      exercise: c.exercise,
      category: c.category as TipCategory,
      difficulty: c.difficulty as Difficulty,
      // Explicite : seule protection contre la relecture IA (copy-review-runner).
      generatedByAI: false,
      copyVerdict: "REECRIRE",
      copyReviewVersion: 18,
      copyReviewedAt: new Date(),
    };
    if (!tip) {
      const id = boulotTipId(c.etape);
      await withDbRetry(
        () =>
          prisma.$transaction([
            prisma.tip.create({ data: { id, title: c.title, ...texte } }),
            prisma.dataPatch.create({ data: { patchId, note: note({ created: id }) } }),
          ]),
        { label: "boulot:tip:create" },
      );
      result.conseils.created.push(c.title);
      continue;
    }
    const before = { ...tip };
    const mark = () => prisma.dataPatch.create({ data: { patchId, note: note(before) } });
    const same =
      tip.isActive && tip.generatedByAI === false && tip.content === c.content && tip.example === c.example &&
      tip.exercise === c.exercise && tip.category === c.category && tip.difficulty === c.difficulty;
    if (same) {
      await withDbRetry(mark, { label: "boulot:tip:mark" });
      result.conseils.unchanged++;
      continue;
    }
    await withDbRetry(
      () =>
        prisma.$transaction([
          prisma.tip.update({
            where: { id: tip.id },
            data: { ...texte, ...(tip.originalContent ? {} : { originalContent: tip.content }) },
          }),
          mark(),
        ]),
      { label: "boulot:tip:update" },
    );
    result.conseils.updated.push(c.title);
  }
}

/** 2. Les 10 vannes neuves BOULOT (validées à l'aveugle) : créées si absentes. */
export async function createBoulotJokes(result: BoulotSyncResult): Promise<void> {
  for (const [i, v] of BOULOT_IMPORT.vannesNeuves.entries()) {
    const patchId = `${BOULOT_PATCH_PREFIX}vanne:${v.place}`;
    if (await hasMarker(patchId)) {
      result.vannes.existing++;
      continue;
    }
    const existing = await withDbRetry(
      () => prisma.joke.findFirst({ where: { content: v.content }, select: { id: true, isActive: true } }),
      { label: "boulot:joke:find" },
    );
    if (existing) {
      await withDbRetry(
        () => prisma.dataPatch.create({ data: { patchId, note: note({ existing: existing.id, isActive: existing.isActive }) } }),
        { label: "boulot:joke:mark" },
      );
      result.vannes.existing++;
      continue;
    }
    const id = boulotJokeId(i);
    await withDbRetry(
      () =>
        prisma.$transaction([
          prisma.joke.create({
            data: {
              id,
              content: v.content,
              punchline: v.punchline,
              category: v.category as JokeCategory,
              type: "ONE_LINER",
              maturityLevel: 1,
              isActive: true,
              generatedByAI: false,
              comedyTechnique: v.comedyTechnique,
              techniqueExplanation: v.techniqueExplanation,
              howToApply: v.howToApply,
              // Même statut que les vannes validées du catalogue (GARDER, charte v1).
              copyVerdict: "GARDER",
              copyReviewVersion: 1,
              copyReviewedAt: new Date(),
            },
          }),
          prisma.dataPatch.create({ data: { patchId, note: note({ created: id, place: v.place }) } }),
        ]),
      { label: "boulot:joke:create" },
    );
    result.vannes.created.push(id);
  }
}

/**
 * 3. Les 20 vannes en ligne liées (import-boulot.md §4.2) : l'id existe, son texte est
 * identique, elle est active. Jamais de réactivation ni de correction : l'écart est journalisé.
 * `generatedByAI = true` n'est jamais changé (provenance réelle) : signalé seulement ; ces
 * vannes sont exclues de la relecture IA (`VANNES_LIEES_AUX_PARCOURS`).
 */
export async function checkBoulotOnlineJokes(result: BoulotSyncResult): Promise<void> {
  const liste = BOULOT_IMPORT.vannesEnLigne;
  const rows = await withDbRetry(
    () =>
      prisma.joke.findMany({
        where: { id: { in: liste.map((v) => v.id) } },
        select: { id: true, content: true, isActive: true, generatedByAI: true },
      }),
    { label: "boulot:jokes:online" },
  );
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const v of liste) {
    const row = byId.get(v.id);
    if (!row) result.vannesEnLigne.problems.push(`${v.id} absente (étape ${v.etape}, place ${v.place})`);
    else if (row.content !== v.content) result.vannesEnLigne.problems.push(`${v.id} texte différent (étape ${v.etape})`);
    else if (!row.isActive) result.vannesEnLigne.problems.push(`${v.id} inactive (étape ${v.etape})`);
    if (row?.generatedByAI) result.vannesEnLigne.generatedByAI.push(v.id);
  }
}

const PATH_SELECT = {
  id: true, title: true, description: true, duration: true, difficulty: true, icon: true, order: true, isActive: true,
  steps: { select: { id: true, order: true, dayNumber: true, tip: { select: { id: true, title: true } } } },
} as const;

/** 4. Parcours et étapes : créés s'ils manquent, réalignés sinon ; `isActive` = interrupteur. */
export async function syncBoulotPath(result: BoulotSyncResult, publie: boolean = BOULOT_PUBLIE): Promise<void> {
  const seed = BOULOT_SEED;
  const fields = {
    title: seed.title,
    description: seed.description,
    duration: seed.duration,
    difficulty: seed.difficulty as Difficulty,
    icon: seed.icon,
    order: seed.order,
  };
  let row = await withDbRetry(
    () => prisma.learningPath.findUnique({ where: { slug: BOULOT_SLUG }, select: PATH_SELECT }),
    { label: "boulot:path:find" },
  );
  if (!row) {
    row = await withDbRetry(
      () => prisma.learningPath.create({ data: { slug: BOULOT_SLUG, ...fields, isActive: publie }, select: PATH_SELECT }),
      { label: "boulot:path:create" },
    );
    result.path.created = true;
  } else {
    const current = row;
    const diff = Object.fromEntries(
      Object.entries({ ...fields, isActive: publie }).filter(([k, v]) => current[k as keyof typeof current] !== v),
    );
    if (Object.keys(diff).length > 0) {
      await withDbRetry(() => prisma.learningPath.update({ where: { id: current.id }, data: diff }), {
        label: "boulot:path:update",
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
    { label: "boulot:tips:find" },
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
        { label: "boulot:step:update" },
      );
      result.steps.updated++;
    } else {
      await withDbRetry(
        () => prisma.learningPathStep.create({ data: { learningPathId: pathId, tipId, order: s.week, dayNumber: s.dayNumber } }),
        { label: "boulot:step:create" },
      );
      result.steps.created++;
    }
  }
}

/** 5. Les 30 vannes des étapes, désignées par leur texte exact (`jokeContents`), existent et sont actives. */
export async function checkBoulotJokes(result: BoulotSyncResult): Promise<void> {
  const contents = BOULOT_SEED.steps.flatMap((s) => s.jokeContents);
  const rows = await withDbRetry(
    () => prisma.joke.findMany({ where: { content: { in: contents }, isActive: true }, select: { content: true } }),
    { label: "boulot:jokes:check" },
  );
  const found = new Set(rows.map((r) => r.content));
  result.jokesMissing = contents.filter((c) => !found.has(c)).map((c) => c.slice(0, 60));
}

function summary(r: BoulotSyncResult): string {
  return (
    `conseils ${r.conseils.updated.length} mis à jour, ${r.conseils.created.length} créé(s), ${r.conseils.unchanged} déjà faits, ` +
    `refusés [${r.conseils.refused.join(", ")}] ; ` +
    `vannes neuves ${r.vannes.created.length} créée(s), ${r.vannes.existing} déjà là ; ` +
    `vannes en ligne : écarts [${r.vannesEnLigne.problems.join(" ; ")}], generatedByAI (protégées de la relecture IA) ` +
    `[${r.vannesEnLigne.generatedByAI.join(", ")}] ; ` +
    `parcours ${r.path.created ? "créé" : r.path.updated ? "mis à jour" : "inchangé"} (isActive=${r.path.isActive}) ; ` +
    `étapes ${r.steps.created} créée(s), ${r.steps.updated} mise(s) à jour, conseils absents [${r.steps.tipsMissing.join(" ; ")}] ; ` +
    `vannes d'étape manquantes ou inactives : ${r.jokesMissing.length}`
  );
}

/** Tâche de démarrage (appelée par `runStartupTasks`), jamais bloquante. */
export async function applyBoulotImportTask(publie: boolean = BOULOT_PUBLIE): Promise<BoulotSyncResult | null> {
  const globalId = boulotGlobalPatchId(publie);
  try {
    if (await hasMarker(globalId)) {
      console.log(`[startup] ${globalId} déjà appliqué (skip).`);
      return null;
    }
  } catch (err) {
    console.error("[startup] boulot : lecture du marqueur échouée (non bloquant) :", err);
    return null;
  }
  const r = emptyResult();
  const steps: Array<[string, () => Promise<void>]> = [
    ["conseils", () => syncBoulotTips(r)],
    ["vannes", () => createBoulotJokes(r)],
    ["vannes en ligne", () => checkBoulotOnlineJokes(r)],
    ["parcours", () => syncBoulotPath(r, publie)],
    ["contrôle des vannes", () => checkBoulotJokes(r)],
  ];
  for (const [label, run] of steps) {
    try {
      await run();
    } catch (err) {
      // Course entre 2 workers (marqueur unique) ou base froide : réessai au prochain démarrage.
      r.errors.push(label);
      console.error(`[startup] boulot (${label}) échoué (non bloquant) :`, err);
    }
  }
  const text = summary(r);
  console.log(`[startup] ${globalId} : ${text}.`);
  const complet =
    r.errors.length === 0 &&
    r.conseils.refused.length === 0 &&
    r.vannesEnLigne.problems.length === 0 &&
    r.steps.tipsMissing.length === 0 &&
    r.jokesMissing.length === 0;
  if (!complet) {
    console.warn(`[startup] boulot incomplet : marqueur non posé, nouvel essai au prochain démarrage.`);
    return r;
  }
  try {
    await withDbRetry(
      () => prisma.dataPatch.upsert({ where: { patchId: globalId }, create: { patchId: globalId, note: text.slice(0, 2000) }, update: {} }),
      { label: "boulot:mark" },
    );
  } catch (err) {
    console.error("[startup] boulot : marqueur global non posé (non bloquant) :", err);
  }
  return r;
}
