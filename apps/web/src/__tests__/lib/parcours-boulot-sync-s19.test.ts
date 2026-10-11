/**
 * s19 : interrupteur de publication du Parcours Boulot, tâche de démarrage d'import,
 * et exclusion des vannes liées aux parcours de la relecture IA.
 */
const mockPatchFindUnique = jest.fn();
const mockPatchCreate = jest.fn((a: unknown) => ({ op: "patch.create", a }));
const mockPatchUpsert = jest.fn();
const mockTipFindUnique = jest.fn();
const mockTipFindFirst = jest.fn();
const mockTipFindMany = jest.fn();
const mockTipUpdate = jest.fn((a: unknown) => ({ op: "tip.update", a }));
const mockTipCreate = jest.fn((a: unknown) => ({ op: "tip.create", a }));
const mockJokeFindFirst = jest.fn();
const mockJokeFindMany = jest.fn();
const mockJokeCreate = jest.fn((a: unknown) => ({ op: "joke.create", a }));
const mockPathFindUnique = jest.fn();
const mockPathCreate = jest.fn();
const mockPathUpdate = jest.fn();
const mockStepCreate = jest.fn();
const mockStepUpdate = jest.fn();
const mockVideoFindMany = jest.fn();
const mockVideoUpdate = jest.fn((a: unknown) => ({ op: "video.update", a }));
const mockTransaction = jest.fn(async (ops: unknown[]) => ops);

jest.mock("@/lib/prisma", () => ({
  prisma: {
    dataPatch: {
      findUnique: (...a: unknown[]) => mockPatchFindUnique(...a),
      create: (a: unknown) => mockPatchCreate(a),
      upsert: (...a: unknown[]) => mockPatchUpsert(...a),
    },
    tip: {
      findUnique: (...a: unknown[]) => mockTipFindUnique(...a),
      findFirst: (...a: unknown[]) => mockTipFindFirst(...a),
      findMany: (...a: unknown[]) => mockTipFindMany(...a),
      update: (a: unknown) => mockTipUpdate(a),
      create: (a: unknown) => mockTipCreate(a),
    },
    joke: {
      findFirst: (...a: unknown[]) => mockJokeFindFirst(...a),
      findMany: (...a: unknown[]) => mockJokeFindMany(...a),
      create: (a: unknown) => mockJokeCreate(a),
    },
    learningPath: {
      findUnique: (...a: unknown[]) => mockPathFindUnique(...a),
      create: (...a: unknown[]) => mockPathCreate(...a),
      update: (...a: unknown[]) => mockPathUpdate(...a),
    },
    video: { findMany: (...a: unknown[]) => mockVideoFindMany(...a), update: (a: unknown) => mockVideoUpdate(a) },
    learningPathStep: { create: (...a: unknown[]) => mockStepCreate(...a), update: (...a: unknown[]) => mockStepUpdate(...a) },
    $transaction: (ops: unknown[]) => mockTransaction(ops),
  },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));

import boulot from "../../../../../docs/content/parcours-boulot-s19.json";
import { BOULOT_PUBLIE } from "@/config/parcours-publication";
import { buildPathFromSeed, getSeedForSlug, PARCOURS_SEED } from "@/lib/parcours-data";
import { publishedSeedJson } from "@/lib/parcours-seed";
import { isParcoursSlug, PARCOURS_SLUGS } from "@/lib/entrees-parcours";
import { PREMIUM_PARCOURS } from "@/config/premium";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import {
  applyBoulotImportTask, BOULOT_VIDEO_FIXES, boulotGlobalPatchId, boulotJokeId, boulotTipId,
} from "@/lib/parcours-boulot-sync";

const meta = boulot._meta;
const TITRES = boulot.parcours.steps.map((s) => s.tipTitle);
const ALL_JOKES = boulot.parcours.steps.flatMap((s) => s.jokeContents);

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

// État livré (non publié) : sauté une fois l'interrupteur à true.
(BOULOT_PUBLIE ? describe.skip : describe)("interrupteur de publication (livré à false)", () => {
  it("Boulot absent partout tant qu'il n'est pas publié (seed, slugs, offre, hub, page)", () => {
    expect(PARCOURS_SEED.map((p) => p.slug)).not.toContain("boulot");
    expect(getSeedForSlug("boulot")).toBeUndefined();
    expect(buildPathFromSeed("boulot")).toBeNull();
    expect(PARCOURS_SLUGS).not.toContain("boulot");
    expect(isParcoursSlug("boulot")).toBe(false);
    expect(PREMIUM_PARCOURS.map((p) => p.slug)).not.toContain("boulot");
    expect(getParcoursCatalogue().map((p) => p.slug)).not.toContain("boulot");
  });
});

describe("interrupteur de publication (état publié simulé)", () => {
  it("publié : Boulot rejoint le seed (après Storytelling), l'offre, les slugs et la page", () => {
    expect(publishedSeedJson(true, true).map((p) => p.slug)).toEqual([
      "machine-a-cafe", "repartie", "confiance", "storytelling", "boulot",
    ]);
    expect(publishedSeedJson(true, false).map((p) => p.slug)).not.toContain("boulot");
    jest.isolateModules(() => {
      jest.doMock("@/config/parcours-publication", () => ({ STORYTELLING_PUBLIE: true, BOULOT_PUBLIE: true }));
      const entrees = require("@/lib/entrees-parcours");
      const premium = require("@/config/premium");
      const data = require("@/lib/parcours-data");
      expect(entrees.isParcoursSlug("boulot")).toBe(true);
      expect(entrees.PARCOURS_NOMS.boulot).toBe("Boulot");
      expect(premium.PARCOURS_COUNT).toBe(5);
      expect(premium.PREMIUM_PARCOURS.at(-1)).toEqual({ slug: "boulot", name: "Boulot", timePerWeek: "15 min/semaine", weeks: 6 });
      expect(data.buildPathFromSeed("boulot")?.steps).toHaveLength(6);
    });
  });
});

/** Les 3 fiches vidéo telles qu'exportées de la prod (boulot-base-s19.json, lecture seule). */
const VIDEOS_AVANT = [
  { id: "v-marina", youtubeId: "m30qZa8p_Js", title: "Marina Rollman - Les relations sociales", duration: "PT5M20S" },
  { id: "v-haroun", youtubeId: "qdqIc-uzdbA", title: "Haroun - L'impro et la répartie", duration: "PT5M45S" },
  { id: "v-verino", youtubeId: "rldvVgHQSvo", title: "Vérino - Le distributeur de baguettes", duration: "PT7M30S" },
];

/** Base vide (premier démarrage) : 4 conseils existants aux ids attendus, rien d'autre. */
function baseInitiale() {
  mockPatchFindUnique.mockResolvedValue(null);
  mockTipFindUnique.mockImplementation(({ where }: { where: { id: string } }) => {
    const c = meta.conseils.find((x) => x.id === where.id);
    return Promise.resolve(
      c
        ? { id: c.id, title: c.title, isActive: c.id !== "cmmw0tqkc000smw62bo1yfeyg" ? false : true, content: "ancien",
            example: "ancien", exercise: "ancien", category: "JEUX_DE_MOTS", difficulty: "INTERMEDIAIRE",
            generatedByAI: false, originalContent: null, copyVerdict: null, copyReviewVersion: null, copyReviewedAt: null }
        : null,
    );
  });
  mockTipFindFirst.mockResolvedValue(null);
  mockTipFindMany.mockResolvedValue(TITRES.map((title, i) => ({ id: `tip-${i + 1}`, title })));
  mockJokeFindFirst.mockResolvedValue(null);
  mockJokeFindMany.mockImplementation(({ where }: { where: { id?: unknown } }) =>
    Promise.resolve(
      where.id
        ? meta.vannesEnLigne.map((v) => ({ id: v.id, content: v.content, isActive: true,
            generatedByAI: ["cmoxx7e56003xs60yyooxncw3", "cmnl01zwv004ss60y2ecodj9a"].includes(v.id) }))
        : ALL_JOKES.map((content) => ({ content })),
    ),
  );
  mockPathFindUnique.mockResolvedValue(null);
  mockVideoFindMany.mockResolvedValue(VIDEOS_AVANT);
  mockPathCreate.mockImplementation(({ data }: { data: object }) => Promise.resolve({ id: "path-bo", ...data, steps: [] }));
}

describe("tâche de démarrage applyBoulotImportTask", () => {
  it("non publié : 4 conseils mis à jour, 2 créés, 10 vannes créées, parcours INACTIF et 6 étapes", async () => {
    baseInitiale();
    const r = await applyBoulotImportTask(false);

    expect(r?.conseils.updated).toEqual(TITRES.slice(1, 5));
    expect(r?.conseils.created).toEqual([TITRES[0], TITRES[5]]);
    const tipUpdates = mockTipUpdate.mock.calls.map(([a]) => a as { where: { id: string }; data: Record<string, unknown> });
    meta.conseils.filter((c) => c.id).forEach((c) =>
      expect(tipUpdates).toContainEqual(
        expect.objectContaining({
          where: { id: c.id },
          data: expect.objectContaining({
            isActive: true, content: c.content, example: c.example, exercise: c.exercise, category: c.category,
            generatedByAI: false, copyVerdict: "REECRIRE", copyReviewVersion: 18, originalContent: "ancien",
          }),
        }),
      ),
    );
    // Le PS passe en ABSURDE ; l'ancien état est gardé dans le marqueur (retour arrière).
    expect(tipUpdates.find((u) => u.where.id === "cmmw0tqkc000smw62bo1yfeyg")?.data.category).toBe("ABSURDE");
    const notes = mockPatchCreate.mock.calls.map(([a]) => a as { data: { patchId: string; note: string } });
    const notePs = notes.find((n) => n.data.patchId === "parcours-boulot:s19:conseil:2");
    expect(JSON.parse(notePs?.data.note ?? "{}")).toMatchObject({ content: "ancien", category: "JEUX_DE_MOTS", isActive: true });
    const creesTip = mockTipCreate.mock.calls.map(([a]) => (a as { data: Record<string, unknown> }).data);
    expect(creesTip.map((d) => d.id)).toEqual([boulotTipId(1), boulotTipId(6)]);
    expect(creesTip[0]).toMatchObject({ title: TITRES[0], category: "OBSERVATION", generatedByAI: false, isActive: true });

    expect(r?.vannes.created).toEqual(meta.vannesNeuves.map((_, i) => boulotJokeId(i)));
    const created = mockJokeCreate.mock.calls.map(([a]) => (a as { data: Record<string, unknown> }).data);
    expect(created[0]).toMatchObject({
      content: meta.vannesNeuves[0].content,
      punchline: meta.vannesNeuves[0].punchline,
      category: "BOULOT",
      type: "ONE_LINER",
      generatedByAI: false,
      comedyTechnique: "La trace qui parle",
      howToApply: meta.vannesNeuves[0].howToApply,
      copyVerdict: "GARDER",
    });

    expect(r?.vannesEnLigne).toEqual({ problems: [], generatedByAI: ["cmoxx7e56003xs60yyooxncw3", "cmnl01zwv004ss60y2ecodj9a"] });
    expect(mockPathCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ slug: "boulot", order: 5, isActive: false, difficulty: "DEBUTANT" }) }),
    );
    expect(mockStepCreate.mock.calls.map(([a]) => (a as { data: object }).data)).toEqual(
      [3, 10, 17, 24, 31, 38].map((dayNumber, i) => ({ learningPathId: "path-bo", tipId: `tip-${i + 1}`, order: i + 1, dayNumber })),
    );
    expect(r?.jokesMissing).toEqual([]);
    expect(mockPatchUpsert).toHaveBeenCalledWith(expect.objectContaining({ where: { patchId: boulotGlobalPatchId(false) } }));
  });

  it("revérification : un titre en base différent n'est jamais écrit, et le marqueur global attend", async () => {
    baseInitiale();
    mockTipFindUnique.mockResolvedValue({ id: "x", title: "Autre conseil", isActive: false, content: "", example: "",
      exercise: "", category: "TIMING", difficulty: "DEBUTANT", generatedByAI: false, originalContent: null,
      copyVerdict: null, copyReviewVersion: null, copyReviewedAt: null });
    mockTipFindMany.mockResolvedValue([]);
    const r = await applyBoulotImportTask(false);
    expect(r?.conseils.refused).toHaveLength(4);
    expect(mockTipUpdate).not.toHaveBeenCalled();
    expect(r?.steps.tipsMissing).toHaveLength(6);
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });

  it("vanne en ligne inactive ou au texte différent : signalée, jamais réactivée, marqueur global non posé", async () => {
    baseInitiale();
    mockJokeFindMany.mockImplementation(({ where }: { where: { id?: unknown } }) =>
      Promise.resolve(
        where.id
          ? meta.vannesEnLigne.map((v, i) => ({ id: v.id, content: i === 0 ? `${v.content} ` : v.content, isActive: i !== 1, generatedByAI: false }))
          : ALL_JOKES.map((content) => ({ content })),
      ),
    );
    const r = await applyBoulotImportTask(false);
    expect(r?.vannesEnLigne.problems).toHaveLength(2);
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });

  it("marqueur global présent : une seule lecture, aucune écriture", async () => {
    mockPatchFindUnique.mockResolvedValue({ patchId: boulotGlobalPatchId(false) });
    expect(await applyBoulotImportTask(false)).toBeNull();
    expect(mockPatchFindUnique).toHaveBeenCalledTimes(1);
    expect(mockTransaction).not.toHaveBeenCalled();
    expect(mockPathCreate).not.toHaveBeenCalled();
  });

  it("publication : parcours existant passé à isActive = true, rien d'autre réécrit", async () => {
    baseInitiale();
    mockPatchFindUnique.mockImplementation(({ where }: { where: { patchId: string } }) =>
      Promise.resolve(/:(conseil|vanne|video):/.test(where.patchId) ? { patchId: where.patchId } : null),
    );
    mockPathFindUnique.mockResolvedValue({
      id: "path-bo",
      ...boulot.parcours,
      isActive: false,
      steps: TITRES.map((title, i) => ({ id: `step-${i + 1}`, order: i + 1, dayNumber: [3, 10, 17, 24, 31, 38][i], tip: { id: `tip-${i + 1}`, title } })),
    });
    await applyBoulotImportTask(true);
    expect(mockPathUpdate).toHaveBeenCalledWith({ where: { id: "path-bo" }, data: { isActive: true } });
    expect(mockTipUpdate).not.toHaveBeenCalled();
    expect(mockJokeCreate).not.toHaveBeenCalled();
    expect(mockStepCreate).not.toHaveBeenCalled();
    expect(mockPatchUpsert).toHaveBeenCalledWith(expect.objectContaining({ where: { patchId: boulotGlobalPatchId(true) } }));
  });
});

describe("fiches vidéo fausses (import-boulot.md §7.2, vérifiées sur YouTube le 11/10)", () => {
  type Patch = { data: { patchId: string; note: string } };
  const notes = () => mockPatchCreate.mock.calls.map(([a]) => (a as Patch).data).filter((d) => d.patchId.includes(":video:"));
  const updates = () => mockVideoUpdate.mock.calls.map(([a]) => a);

  it("titre et durée seulement, format de la base (« Humoriste - Titre », secondes sur 2 chiffres)", async () => {
    baseInitiale();
    const r = await applyBoulotImportTask(false);
    expect(updates()).toEqual([
      { where: { id: "v-marina" }, data: { title: "Marina Rollman - JCC 8è saison", duration: "PT5M08S" } },
      { where: { id: "v-haroun" }, data: { title: "Haroun - Jamel Comedy Club Saison 9" } },
      { where: { id: "v-verino" }, data: { duration: "PT5M51S" } },
    ]);
    expect(r?.videos).toEqual({ updated: ["m30qZa8p_Js", "qdqIc-uzdbA", "rldvVgHQSvo"], unchanged: 0, refused: [] });
    BOULOT_VIDEO_FIXES.forEach((f) => {
      expect(f.apres.title).toMatch(/^[^-]+ - .+$/);
      expect(f.apres.duration).toMatch(/^PT\d+M\d{2}S$/);
    });
    // Retour arrière : la note garde le titre et la durée d'avant.
    expect(notes().map((n) => [n.patchId, JSON.parse(n.note)])).toEqual(
      VIDEOS_AVANT.map((v) => [`parcours-boulot:s19:video:${v.youtubeId}`, v]),
    );
    expect(mockPatchUpsert).toHaveBeenCalledWith(expect.objectContaining({ where: { patchId: boulotGlobalPatchId(false) } }));
  });

  it("indépendant de l'interrupteur : mêmes corrections à true", async () => {
    baseInitiale();
    const r = await applyBoulotImportTask(true);
    expect(r?.videos.updated).toHaveLength(3);
  });

  it("idempotent : base déjà corrigée = aucune écriture (marqueur seul), marqueurs présents = aucune lecture", async () => {
    baseInitiale();
    mockVideoFindMany.mockResolvedValue(
      VIDEOS_AVANT.map((v) => ({ ...v, ...BOULOT_VIDEO_FIXES.find((f) => f.youtubeId === v.youtubeId)?.apres })),
    );
    const r = await applyBoulotImportTask(false);
    expect(mockVideoUpdate).not.toHaveBeenCalled();
    expect(r?.videos).toEqual({ updated: [], unchanged: 3, refused: [] });
    expect(notes()).toHaveLength(3);

    jest.clearAllMocks();
    baseInitiale();
    mockPatchFindUnique.mockImplementation(({ where }: { where: { patchId: string } }) =>
      Promise.resolve(where.patchId.includes(":video:") ? { patchId: where.patchId } : null),
    );
    const r2 = await applyBoulotImportTask(false);
    expect(mockVideoUpdate).not.toHaveBeenCalled();
    expect(notes()).toHaveLength(0);
    expect(r2?.videos).toEqual({ updated: [], unchanged: 3, refused: [] });
  });

  it("valeur inattendue (retouche à la main) ou fiche absente : refusée, rien écrit, marqueur global non posé", async () => {
    baseInitiale();
    mockVideoFindMany.mockResolvedValue([
      { ...VIDEOS_AVANT[0], duration: "PT5M10S" },
      VIDEOS_AVANT[2],
    ]);
    const r = await applyBoulotImportTask(false);
    expect(r?.videos.refused).toEqual(["m30qZa8p_Js (duration en base « PT5M10S »)", "qdqIc-uzdbA absente"]);
    expect(r?.videos.updated).toEqual(["rldvVgHQSvo"]);
    expect(updates()).toEqual([{ where: { id: "v-verino" }, data: { duration: "PT5M51S" } }]);
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });
});
