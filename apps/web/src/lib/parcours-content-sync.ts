/**
 * Tâche de démarrage s17 (lot D) : met la base au niveau du contenu réécrit des
 * parcours (`docs/content/parcours-seed.json`, trace : `parcours-reecriture-s17.json`).
 *
 * Ce qui vit en base et que cette tâche aligne sur le seed :
 *  - `LearningPath` : title, description, duration, difficulty, icon, order ;
 *  - `LearningPathStep` : conseil (`tipTitle`) et `dayNumber` de chaque étape
 *    (clé : parcours + `order` = `week` du seed). Jamais de suppression d'étape ;
 *  - `Tip.exercise` (le défi) des seuls conseils listés dans `DEFIS_CONFIRMES`.
 * Tout le reste (module, quiz, explications, vannes, vidéos, niveau affiché,
 * parcours suivant) est lu dans le seed au rendu : aucune écriture nécessaire.
 *
 * Idempotente et fail-safe (mêmes règles que `lib/startup-tasks.ts`) :
 *  - parcours et étapes : comparaison champ par champ puis marqueur `DataPatch`
 *    `PARCOURS_CONTENT_PATCH_ID`, écrit seulement si tout a réussi ;
 *  - défis : marqueur `parcours-defi:s17:<clé>` posé dans la MÊME transaction
 *    que la mise à jour, avec l'ancien texte dans `note` (retour arrière).
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { PARCOURS_SEED, type SeedParcours } from "@/lib/parcours-data";
import reecritureS17 from "../../../../docs/content/parcours-reecriture-s17.json";

/** BUMP MANUEL après toute nouvelle réécriture des champs stockés en base. */
export const PARCOURS_CONTENT_PATCH_ID = "parcours-content:s17-v1";
export const DEFI_PATCH_PREFIX = "parcours-defi:s17:";

const DIFFICULTIES = new Set(["DEBUTANT", "INTERMEDIAIRE", "EXPERT"]);
type Difficulty = "DEBUTANT" | "INTERMEDIAIRE" | "EXPERT";

/**
 * Retouches de défi appliquées (clé `<slug>-<étape>` de `_meta.defisRetouches`).
 * machine-a-cafe-3 et confiance-4 : confirmés par Thomas le 07/10/2026
 * (`docs/founder-preferences.md`, recos s17 2e série). confiance-6 : alignement du seed seulement.
 */
export const DEFIS_CONFIRMES = ["repartie-1", "confiance-1", "repartie-4", "machine-a-cafe-3", "confiance-4"] as const;

interface DefiRetoucheJson {
  statut?: string;
  ajouterALaFin?: string;
  remplacerTout?: string;
}

export interface DefiRetouche {
  cle: string;
  slug: string;
  etape: number;
  mode: "ajouter" | "remplacer";
  texte: string;
}

/** Retouches confirmées, lues dans `_meta.defisRetouches` (textes jamais recopiés ici). */
export function defisRetouchesConfirmees(): DefiRetouche[] {
  const raw = (reecritureS17 as { _meta: { defisRetouches: Record<string, DefiRetoucheJson> } })._meta
    .defisRetouches;
  const out: DefiRetouche[] = [];
  for (const [label, entry] of Object.entries(raw)) {
    const cle = label.split(" ")[0];
    if (!(DEFIS_CONFIRMES as readonly string[]).includes(cle)) continue;
    const match = /^(.+)-(\d+)$/.exec(cle);
    const texte = entry.remplacerTout ?? entry.ajouterALaFin;
    if (!match || !texte) continue;
    out.push({
      cle,
      slug: match[1],
      etape: Number(match[2]),
      mode: entry.remplacerTout ? "remplacer" : "ajouter",
      texte,
    });
  }
  return out;
}

/** Nouveau texte du défi, ou `null` si la retouche est déjà en place. */
export function defiApresRetouche(actuel: string, r: Pick<DefiRetouche, "mode" | "texte">): string | null {
  if (r.mode === "remplacer") return actuel.trim() === r.texte ? null : r.texte;
  if (actuel.includes(r.texte)) return null;
  const base = actuel.trimEnd();
  return base ? `${base} ${r.texte}` : r.texte;
}

export interface ParcoursSyncResult {
  paths: number;
  pathsMissing: number;
  stepsUpdated: number;
  stepsCreated: number;
  tipsMissing: string[];
}

type PathData = Partial<{
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  icon: string;
  order: number;
}>;

function pathDiff(
  row: { title: string; description: string; duration: string; difficulty: string; icon: string; order: number },
  seed: SeedParcours,
): PathData {
  const data: PathData = {};
  if (row.title !== seed.title) data.title = seed.title;
  if (row.description !== seed.description) data.description = seed.description;
  if (row.duration !== seed.duration) data.duration = seed.duration;
  if (DIFFICULTIES.has(seed.difficulty) && row.difficulty !== seed.difficulty) {
    data.difficulty = seed.difficulty as Difficulty;
  }
  if (row.icon !== seed.icon) data.icon = seed.icon;
  if (row.order !== seed.order) data.order = seed.order;
  return data;
}

/** Aligne `LearningPath` et `LearningPathStep` sur le seed (aucune suppression). */
export async function syncParcoursRows(seeds: SeedParcours[] = PARCOURS_SEED): Promise<ParcoursSyncResult> {
  const result: ParcoursSyncResult = { paths: 0, pathsMissing: 0, stepsUpdated: 0, stepsCreated: 0, tipsMissing: [] };
  const rows = await withDbRetry(
    () =>
      prisma.learningPath.findMany({
        where: { slug: { in: seeds.map((p) => p.slug) } },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          duration: true,
          difficulty: true,
          icon: true,
          order: true,
          steps: { select: { id: true, order: true, dayNumber: true, tip: { select: { id: true, title: true } } } },
        },
      }),
    { label: "parcours-content:paths:findMany" },
  );
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const wantedTitles = [...new Set(seeds.flatMap((p) => p.steps.map((s) => s.tipTitle)))];
  const tips = await withDbRetry(
    () =>
      prisma.tip.findMany({
        where: { title: { in: wantedTitles }, isActive: true },
        select: { id: true, title: true },
        orderBy: { createdAt: "asc" },
      }),
    { label: "parcours-content:tips:findMany" },
  );
  const tipIdByTitle = new Map<string, string>();
  for (const t of tips) if (!tipIdByTitle.has(t.title)) tipIdByTitle.set(t.title, t.id);

  for (const seed of seeds) {
    const row = bySlug.get(seed.slug);
    if (!row) {
      result.pathsMissing++;
      continue;
    }
    const data = pathDiff(row, seed);
    if (Object.keys(data).length > 0) {
      await withDbRetry(() => prisma.learningPath.update({ where: { id: row.id }, data }), {
        label: "parcours-content:paths:update",
      });
      result.paths++;
    }
    const stepByOrder = new Map(row.steps.map((s) => [s.order, s]));
    for (const s of seed.steps) {
      const current = stepByOrder.get(s.week);
      const sameTip = current?.tip.title === s.tipTitle;
      if (current && sameTip && current.dayNumber === s.dayNumber) continue;
      const tipId = sameTip ? current?.tip.id : tipIdByTitle.get(s.tipTitle);
      if (!tipId) {
        result.tipsMissing.push(`${seed.slug} étape ${s.week} : « ${s.tipTitle} »`);
        continue;
      }
      if (current) {
        await withDbRetry(
          () => prisma.learningPathStep.update({ where: { id: current.id }, data: { tipId, dayNumber: s.dayNumber } }),
          { label: "parcours-content:steps:update" },
        );
        result.stepsUpdated++;
      } else {
        await withDbRetry(
          () =>
            prisma.learningPathStep.create({
              data: { learningPathId: row.id, tipId, order: s.week, dayNumber: s.dayNumber },
            }),
          { label: "parcours-content:steps:create" },
        );
        result.stepsCreated++;
      }
    }
  }
  return result;
}

export interface DefisSyncResult {
  updated: string[];
  unchanged: number;
  missing: string[];
  failed: string[];
}

/**
 * Applique les retouches de défi confirmées sur `Tip.exercise`, et seulement ce
 * champ. Le conseil est celui de l'étape en base (parcours + ordre), pas un titre.
 */
export async function applyDefisRetouches(
  retouches: DefiRetouche[] = defisRetouchesConfirmees(),
): Promise<DefisSyncResult> {
  const result: DefisSyncResult = { updated: [], unchanged: 0, missing: [], failed: [] };
  for (const r of retouches) {
    try {
      await applyDefiRetouche(r, result);
    } catch (err) {
      // Course entre 2 workers (marqueur unique) ou base froide : réessai au prochain boot.
      result.failed.push(r.cle);
      console.error(`[startup] défi ${r.cle} non appliqué (non bloquant) :`, err);
    }
  }
  return result;
}

async function applyDefiRetouche(r: DefiRetouche, result: DefisSyncResult): Promise<void> {
  const patchId = `${DEFI_PATCH_PREFIX}${r.cle}`;
  const done = await withDbRetry(() => prisma.dataPatch.findUnique({ where: { patchId } }), {
    label: "parcours-content:defi:check",
  });
  if (done) {
    result.unchanged++;
    return;
  }
  const step = await withDbRetry(
    () =>
      prisma.learningPathStep.findFirst({
        where: { order: r.etape, learningPath: { slug: r.slug } },
        select: { tip: { select: { id: true, exercise: true } } },
      }),
    { label: "parcours-content:defi:find" },
  );
  if (!step) {
    result.missing.push(r.cle);
    return;
  }
  const before = step.tip.exercise ?? "";
  const after = defiApresRetouche(before, r);
  const note = JSON.stringify({ tipId: step.tip.id, before, after: after ?? before }).slice(0, 8000);
  if (after === null) {
    await withDbRetry(() => prisma.dataPatch.create({ data: { patchId, note } }), {
      label: "parcours-content:defi:mark",
    });
    result.unchanged++;
    return;
  }
  await withDbRetry(
    () =>
      prisma.$transaction([
        prisma.tip.update({ where: { id: step.tip.id }, data: { exercise: after } }),
        prisma.dataPatch.create({ data: { patchId, note } }),
      ]),
    { label: "parcours-content:defi:update" },
  );
  result.updated.push(r.cle);
}

/** Tâche de démarrage : parcours + étapes (marqueur global), puis défis (marqueur par défi). */
export async function applyParcoursContentTask(): Promise<void> {
  try {
    const existing = await withDbRetry(
      () => prisma.dataPatch.findUnique({ where: { patchId: PARCOURS_CONTENT_PATCH_ID } }),
      { label: "parcours-content:check" },
    );
    if (existing) {
      console.log(`[startup] ${PARCOURS_CONTENT_PATCH_ID} déjà appliqué (skip).`);
    } else {
      const r = await syncParcoursRows();
      const summary =
        `${r.paths} parcours mis à jour, ${r.pathsMissing} absent(s) ; ` +
        `étapes : ${r.stepsUpdated} mise(s) à jour, ${r.stepsCreated} créée(s), ${r.tipsMissing.length} conseil(s) introuvable(s)`;
      console.log(`[startup] ${PARCOURS_CONTENT_PATCH_ID} : ${summary}.`);
      if (r.tipsMissing.length > 0) {
        console.warn(`[startup] parcours : conseil(s) introuvable(s) : ${r.tipsMissing.join(" ; ")}.`);
      }
      // Comme le catalogue : un absent n'empêche pas le marqueur, une erreur si (catch).
      await withDbRetry(
        () =>
          prisma.dataPatch.upsert({
            where: { patchId: PARCOURS_CONTENT_PATCH_ID },
            create: { patchId: PARCOURS_CONTENT_PATCH_ID, note: summary.slice(0, 2000) },
            update: {},
          }),
        { label: "parcours-content:mark" },
      );
    }
  } catch (err) {
    console.error("[startup] parcours (contenu s17) échoué (non bloquant) :", err);
  }
  try {
    const d = await applyDefisRetouches();
    console.log(
      `[startup] défis s17 : ${d.updated.length} retouché(s) [${d.updated.join(", ")}], ` +
        `${d.unchanged} déjà en place, ${d.missing.length} introuvable(s) [${d.missing.join(", ")}], ` +
        `${d.failed.length} en échec [${d.failed.join(", ")}].`,
    );
  } catch (err) {
    console.error("[startup] défis s17 échoués (non bloquant) :", err);
  }
}
