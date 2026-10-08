/**
 * Lot D s17 : contenu réécrit des parcours en production.
 * Seed (format, quiz + explication, niveaux, suite de Confiance), 65 vannes
 * résolues avec les données réelles (`vannes-actives-s17.json`), libellés
 * « Étape N », vidéos facultatives, tâche de démarrage idempotente.
 */
const mockPathFindMany = jest.fn();
const mockPathUpdate = jest.fn();
const mockStepUpdate = jest.fn();
const mockStepCreate = jest.fn();
const mockStepFindFirst = jest.fn();
const mockTipFindMany = jest.fn();
const mockTipUpdate = jest.fn();
const mockJokeFindMany = jest.fn();
const mockPatchFindUnique = jest.fn();
const mockPatchCreate = jest.fn();
const mockPatchUpsert = jest.fn();
const mockTransaction = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    learningPath: { findMany: (...a: unknown[]) => mockPathFindMany(...a), update: (...a: unknown[]) => mockPathUpdate(...a) },
    learningPathStep: {
      update: (...a: unknown[]) => mockStepUpdate(...a),
      create: (...a: unknown[]) => mockStepCreate(...a),
      findFirst: (...a: unknown[]) => mockStepFindFirst(...a),
    },
    tip: { findMany: (...a: unknown[]) => mockTipFindMany(...a), update: (...a: unknown[]) => mockTipUpdate(...a) },
    joke: { findMany: (...a: unknown[]) => mockJokeFindMany(...a) },
    dataPatch: {
      findUnique: (...a: unknown[]) => mockPatchFindUnique(...a),
      create: (...a: unknown[]) => mockPatchCreate(...a),
      upsert: (...a: unknown[]) => mockPatchUpsert(...a),
    },
    $transaction: (...a: unknown[]) => mockTransaction(...a),
  },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));

import parcoursSeed from "../../../../../docs/content/parcours-seed.json";
import reecriture from "../../../../../docs/content/parcours-reecriture-s17.json";
import vannesActives from "../../../../../docs/content/vannes-actives-s17.json";
import {
  applyDefisRetouches,
  applyParcoursContentTask,
  defiApresRetouche,
  defisRetouchesConfirmees,
  DEFIS_CONFIRMES,
  PARCOURS_CONTENT_PATCH_ID,
  syncParcoursRows,
} from "@/lib/parcours-content-sync";
import { resolveStepJokes } from "@/lib/parcours-vannes";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import { buildParcoursCourseJsonLd } from "@/lib/parcours-jsonld";
import { DIFFICULTY_LABELS } from "@/lib/parcours-labels";
import { dureeEtapeTexte, VIDEOS_ETAPE } from "@/config/textes/parcours";
import type { SeedParcours } from "@/lib/parcours-data";
import { pickSuite } from "@/components/parcours/path-completion-card";
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";

const seed = parcoursSeed as SeedParcours[];
const actives = (vannesActives as Array<{ content?: string; punchline?: string }>).filter(
  (v): v is { content: string; punchline: string } => typeof v.content === "string",
);

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("seed réécrit (parcours-seed.json)", () => {
  it("racine tableau, identique au tableau `parcours` du fichier de réécriture (gardé comme trace)", () => {
    expect(Array.isArray(parcoursSeed)).toBe(true);
    expect(parcoursSeed).toEqual((reecriture as { parcours: unknown[] }).parcours);
    expect(seed.map((p) => p.steps.length)).toEqual([3, 4, 6]);
  });

  it("54 questions, chacune avec une explication et une bonne réponse valide", () => {
    const quiz = seed.flatMap((p) => p.steps.flatMap((s) => s.quiz ?? []));
    expect(quiz).toHaveLength(54);
    quiz.forEach((q) => {
      expect(q.explanation?.trim().length).toBeGreaterThan(0);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    });
  });

  it("niveaux harmonisés : enum de la base, libellés connus, plus d'EXPERT", () => {
    expect(seed.map((p) => [p.slug, p.difficulty, p.difficultyLabel])).toEqual([
      ["machine-a-cafe", "DEBUTANT", "DEBUTANT"],
      ["repartie", "INTERMEDIAIRE", "DEBUTANT → INTERMEDIAIRE"],
      ["confiance", "INTERMEDIAIRE", "DEBUTANT → INTERMEDIAIRE"],
    ]);
    seed.forEach((p) =>
      (p.difficultyLabel ?? "").split("→").forEach((part) => expect(DIFFICULTY_LABELS[part.trim()]).toBeDefined()),
    );
    const confiance = seed.find((p) => p.slug === "confiance")!;
    const jsonLd = buildParcoursCourseJsonLd({ slug: "confiance", name: confiance.title, description: confiance.description, weeks: 6, difficulty: confiance.difficulty });
    expect(jsonLd.educationalLevel).toBe("Intermediate");
  });

  it("Confiance mène à Répartie, et aucun parcours ne se propose lui-même", () => {
    expect(seed.find((p) => p.slug === "confiance")?.nextParcours).toBe("repartie");
    seed.forEach((p) => expect(p.nextParcours).not.toBe(p.slug));
  });

  it("bilan de Confiance : Répartie d'abord, sinon un parcours non terminé, sinon le carnet", () => {
    const fait = { completedAt: "2026-10-01" };
    const api = (rep: object | null, mac: object | null) => [
      { slug: "machine-a-cafe", title: "Parcours Machine à Café", progress: mac },
      { slug: "repartie", title: "Parcours Répartie", progress: rep },
      { slug: "confiance", title: "Parcours Confiance", progress: fait },
    ];
    expect(pickSuite(api(null, null), "confiance", "repartie")).toMatchObject({ kind: "parcours", slug: "repartie" });
    expect(pickSuite(api(fait, null), "confiance", "repartie")).toMatchObject({ kind: "parcours", slug: "machine-a-cafe" });
    expect(pickSuite(api(fait, fait), "confiance", "repartie")).toEqual({ kind: "tout-fini" });
  });
});

describe("vannes de l'étape avec les données réelles (D4)", () => {
  it("les 65 vannes des 13 étapes s'affichent (5 par étape), résolues dans les vannes actives", async () => {
    mockJokeFindMany.mockImplementation(async ({ where }: { where: { isActive: boolean; content: { in: string[] } } }) => {
      expect(where.isActive).toBe(true);
      return actives
        .filter((v) => where.content.in.includes(v.content))
        .map((v, i) => ({ id: `cmjoke${i}xxxxxxx`, content: v.content, punchline: v.punchline, comedyTechnique: null }));
    });
    let total = 0;
    for (const p of seed) {
      const byStep = await resolveStepJokes(p.steps.map((s) => ({ order: s.week, jokeContents: s.jokeContents, jokeIds: s.jokeIds })));
      p.steps.forEach((s) => {
        const jokes = byStep.get(s.week) ?? [];
        expect(jokes.map((j) => j.content)).toEqual(s.jokeContents);
        total += jokes.length;
      });
    }
    expect(total).toBe(65);
  });
});

describe("libellés", () => {
  it("le programme affiche « Étape N », jamais « Semaine N »", () => {
    const modules = getParcoursCatalogue().flatMap((p) => p.modules);
    expect(modules).toHaveLength(STORYTELLING_PUBLIE ? 19 : 13);
    modules.forEach((m) => expect(m.week).toMatch(/^Étape \d$/));
    expect(JSON.stringify(getParcoursCatalogue())).not.toMatch(/Semaine \d/);
  });

  it("vidéos facultatives : durée affichée hors vidéos, titre du bloc", () => {
    expect(dureeEtapeTexte("20 min/semaine", true)).toBe("Environ 20 min, hors vidéos");
    expect(dureeEtapeTexte("15 min/semaine")).toBe("Environ 15 min");
    expect(VIDEOS_ETAPE.titre).toMatch(/facultatif/);
  });
});

/** Base telle qu'avant le lot D : la base suit l'ancien seed (Confiance EXPERT, ancienne description). */
function dbRows(overrides: Record<string, Record<string, unknown>> = {}) {
  return seed.map((p, i) => ({
    id: `db-${p.slug}`,
    slug: p.slug,
    title: p.title,
    description: p.description,
    duration: p.duration,
    difficulty: p.difficulty,
    icon: p.icon,
    order: p.order,
    steps: p.steps.map((s) => ({ id: `st-${p.slug}-${s.week}`, order: s.week, dayNumber: s.dayNumber, tip: { id: `tip-${i}-${s.week}`, title: s.tipTitle } })),
    ...overrides[p.slug],
  }));
}

describe("tâche de démarrage : parcours et étapes", () => {
  it("met à jour seulement ce qui diffère (Confiance : niveau et description)", async () => {
    mockPathFindMany.mockResolvedValue(dbRows({ confiance: { difficulty: "EXPERT", description: "Ancienne description" } }));
    mockTipFindMany.mockResolvedValue([]);
    const r = await syncParcoursRows();
    expect(mockPathUpdate).toHaveBeenCalledTimes(1);
    expect(mockPathUpdate).toHaveBeenCalledWith({
      where: { id: "db-confiance" },
      data: { difficulty: "INTERMEDIAIRE", description: seed[2].description },
    });
    expect(r).toMatchObject({ paths: 1, stepsUpdated: 0, stepsCreated: 0, tipsMissing: [] });
  });

  it("idempotente : base déjà à jour → aucune écriture", async () => {
    mockPathFindMany.mockResolvedValue(dbRows());
    mockTipFindMany.mockResolvedValue([]);
    const r = await syncParcoursRows();
    expect(mockPathUpdate).not.toHaveBeenCalled();
    expect(mockStepUpdate).not.toHaveBeenCalled();
    expect(mockStepCreate).not.toHaveBeenCalled();
    expect(r.paths).toBe(0);
  });

  it("étape absente → créée ; mauvais conseil → corrigé ; conseil introuvable → signalé, jamais de suppression", async () => {
    const rows = dbRows();
    rows[0].steps = rows[0].steps.filter((s) => s.order !== 3);
    rows[1].steps[0] = { ...rows[1].steps[0], tip: { id: "tip-autre", title: "Autre conseil" } };
    mockPathFindMany.mockResolvedValue(rows);
    mockTipFindMany.mockResolvedValue([
      { id: "tip-mac3", title: seed[0].steps[2].tipTitle },
      { id: "tip-rep1", title: seed[1].steps[0].tipTitle },
    ]);
    const r = await syncParcoursRows();
    expect(mockStepCreate).toHaveBeenCalledWith({
      data: { learningPathId: "db-machine-a-cafe", tipId: "tip-mac3", order: 3, dayNumber: seed[0].steps[2].dayNumber },
    });
    expect(mockStepUpdate).toHaveBeenCalledWith({ where: { id: "st-repartie-1" }, data: { tipId: "tip-rep1", dayNumber: 3 } });
    expect(r).toMatchObject({ stepsCreated: 1, stepsUpdated: 1, tipsMissing: [] });

    jest.clearAllMocks();
    mockPathFindMany.mockResolvedValue(rows);
    mockTipFindMany.mockResolvedValue([]);
    const r2 = await syncParcoursRows();
    expect(r2.tipsMissing).toHaveLength(2);
    expect(mockStepCreate).not.toHaveBeenCalled();
  });

  it("marqueur présent → rien n'est relu ; panne base → pas d'exception ni de marqueur", async () => {
    mockPatchFindUnique.mockImplementation(async ({ where }: { where: { patchId: string } }) =>
      where.patchId === PARCOURS_CONTENT_PATCH_ID ? { id: "x" } : { id: "defi" },
    );
    await applyParcoursContentTask();
    expect(mockPathFindMany).not.toHaveBeenCalled();
    expect(mockTipUpdate).not.toHaveBeenCalled();

    jest.clearAllMocks();
    mockPatchFindUnique.mockResolvedValue(null);
    mockPathFindMany.mockRejectedValue(new Error("Neon froide"));
    mockStepFindFirst.mockRejectedValue(new Error("Neon froide"));
    await expect(applyParcoursContentTask()).resolves.toBeUndefined();
    expect(mockPatchUpsert).not.toHaveBeenCalled();
    expect(mockTransaction).not.toHaveBeenCalled();
  });
});

describe("retouches de défi (`_meta.defisRetouches`)", () => {
  it("les 5 retouches confirmées sont appliquées (MàC 3 et Confiance 4 confirmés par Thomas, lot E), pas confiance-6", () => {
    expect(defisRetouchesConfirmees().map((r) => [r.cle, r.slug, r.etape, r.mode])).toEqual([
      ["repartie-1", "repartie", 1, "ajouter"],
      ["confiance-1", "confiance", 1, "remplacer"],
      ["repartie-4", "repartie", 4, "ajouter"],
      ["machine-a-cafe-3", "machine-a-cafe", 3, "ajouter"],
      ["confiance-4", "confiance", 4, "ajouter"],
    ]);
    expect(DEFIS_CONFIRMES).toEqual(expect.arrayContaining(["machine-a-cafe-3", "confiance-4"]));
  });

  it("ajout en fin de défi, remplacement complet, et rien si déjà en place", () => {
    const ajout = { mode: "ajouter" as const, texte: "Pas d'occasion ? Écris-la." };
    expect(defiApresRetouche("DÉFI X : fais-le.", ajout)).toBe("DÉFI X : fais-le. Pas d'occasion ? Écris-la.");
    expect(defiApresRetouche("DÉFI X : fais-le. Pas d'occasion ? Écris-la.", ajout)).toBeNull();
    const remplace = { mode: "remplacer" as const, texte: "DÉFI NEUF." };
    expect(defiApresRetouche("DÉFI ANCIEN.", remplace)).toBe("DÉFI NEUF.");
    expect(defiApresRetouche("DÉFI NEUF.", remplace)).toBeNull();
  });

  it("ne touche que `Tip.exercise`, avec le marqueur et l'ancien texte dans la même transaction", async () => {
    mockPatchFindUnique.mockResolvedValue(null);
    mockStepFindFirst.mockImplementation(async ({ where }: { where: { order: number; learningPath: { slug: string } } }) => ({
      tip: { id: `tip-${where.learningPath.slug}-${where.order}`, exercise: "DÉFI ANCIEN : texte en base." },
    }));
    mockTipUpdate.mockImplementation((arg: unknown) => ({ op: "tip", arg }));
    mockPatchCreate.mockImplementation((arg: unknown) => ({ op: "patch", arg }));
    mockTransaction.mockResolvedValue([]);
    const r = await applyDefisRetouches();
    expect(r.updated).toEqual(["repartie-1", "confiance-1", "repartie-4", "machine-a-cafe-3", "confiance-4"]);
    expect(mockTransaction).toHaveBeenCalledTimes(5);
    const mac3 = mockTipUpdate.mock.calls.find(([a]) => (a as { where: { id: string } }).where.id === "tip-machine-a-cafe-3")!;
    expect((mac3[0] as { data: { exercise: string } }).data.exercise).toMatch(/^DÉFI ANCIEN : texte en base\. Pas d'ami sous la main \?/);
    mockTipUpdate.mock.calls.forEach(([arg]) => expect(Object.keys((arg as { data: object }).data)).toEqual(["exercise"]));
    const confiance = mockTipUpdate.mock.calls.find(([a]) => (a as { where: { id: string } }).where.id === "tip-confiance-1")!;
    expect((confiance[0] as { data: { exercise: string } }).data.exercise).toMatch(/^DÉFI RÈGLE NON ÉCRITE : aujourd'hui, repère/);
    const note = JSON.parse((mockPatchCreate.mock.calls[0][0] as { data: { note: string } }).data.note);
    expect(note.before).toBe("DÉFI ANCIEN : texte en base.");
  });

  it("2e démarrage : marqueurs posés → aucune écriture ; une erreur sur un défi n'arrête pas les autres", async () => {
    mockPatchFindUnique.mockResolvedValue({ id: "deja" });
    const r = await applyDefisRetouches();
    expect(r).toMatchObject({ updated: [], unchanged: 5 });
    expect(mockTipUpdate).not.toHaveBeenCalled();

    jest.clearAllMocks();
    mockPatchFindUnique.mockResolvedValue(null);
    mockStepFindFirst
      .mockRejectedValueOnce(new Error("course entre 2 workers"))
      .mockResolvedValue({ tip: { id: "t", exercise: "DÉFI." } });
    mockTransaction.mockResolvedValue([]);
    const r2 = await applyDefisRetouches();
    expect(r2.failed).toEqual(["repartie-1"]);
    expect(r2.updated).toEqual(["confiance-1", "repartie-4", "machine-a-cafe-3", "confiance-4"]);
  });
});
