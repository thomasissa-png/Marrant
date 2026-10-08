/**
 * s18 : interrupteur de publication de Storytelling et tâche de démarrage d'import.
 */
const mockPatchFindUnique = jest.fn();
const mockPatchCreate = jest.fn((a: unknown) => ({ op: "patch.create", a }));
const mockPatchUpsert = jest.fn();
const mockTipFindUnique = jest.fn();
const mockTipFindFirst = jest.fn();
const mockTipFindMany = jest.fn();
const mockTipUpdate = jest.fn((a: unknown) => ({ op: "tip.update", a }));
const mockJokeFindFirst = jest.fn();
const mockJokeFindMany = jest.fn();
const mockJokeCreate = jest.fn((a: unknown) => ({ op: "joke.create", a }));
const mockPathFindUnique = jest.fn();
const mockPathCreate = jest.fn();
const mockPathUpdate = jest.fn();
const mockStepCreate = jest.fn();
const mockStepUpdate = jest.fn();
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
    learningPathStep: { create: (...a: unknown[]) => mockStepCreate(...a), update: (...a: unknown[]) => mockStepUpdate(...a) },
    $transaction: (ops: unknown[]) => mockTransaction(ops),
  },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));

import storytelling from "../../../../../docs/content/parcours-storytelling-s18.json";
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";
import { buildPathFromSeed, getSeedForSlug, PARCOURS_SEED } from "@/lib/parcours-data";
import { publishedSeedJson } from "@/lib/parcours-seed";
import { isParcoursSlug, PARCOURS_SLUGS } from "@/lib/entrees-parcours";
import { PARCOURS_COUNT, PREMIUM_PARCOURS } from "@/config/premium";
import { QUIZ_PROFILES } from "@/components/quiz/quiz-data";
import { QUIZ_HUMOUR_PARCOURS } from "@/config/textes/entrees-parcours";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import {
  applyStorytellingImportTask,
  storytellingGlobalPatchId,
  vanneNeuveId,
} from "@/lib/parcours-storytelling-sync";

const meta = storytelling._meta;
const TITRES = storytelling.parcours.steps.map((s) => s.tipTitle);
const ALL_JOKES = storytelling.parcours.steps.flatMap((s) => s.jokeContents);

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

// Ces deux cas décrivent l'état livré (non publié) : sautés une fois l'interrupteur à true.
(STORYTELLING_PUBLIE ? describe.skip : describe)("interrupteur de publication (livré à false)", () => {
  it("Storytelling absent partout tant qu'il n'est pas publié", () => {
    expect(PARCOURS_SEED.map((p) => p.slug)).toEqual(["machine-a-cafe", "repartie", "confiance"]);
    expect(getSeedForSlug("storytelling")).toBeUndefined();
    expect(buildPathFromSeed("storytelling")).toBeNull();
    expect(PARCOURS_SLUGS).not.toContain("storytelling");
    expect(isParcoursSlug("storytelling")).toBe(false);
    expect(PREMIUM_PARCOURS.map((p) => p.slug)).not.toContain("storytelling");
    expect(PARCOURS_COUNT).toBe(3);
    expect(getParcoursCatalogue().map((p) => p.slug)).not.toContain("storytelling");
  });

  it("quiz : le profil Storyteller garde Machine à Café et sa phrase actuelle", () => {
    expect(QUIZ_PROFILES.STORYTELLER.recommendedParcours).toBe("machine-a-cafe");
    expect(QUIZ_HUMOUR_PARCOURS.raison.STORYTELLER).toBe(
      "Tu sais tenir une table avec une histoire : ce parcours t'apprend à la raconter au bon moment et jusqu'au bout.",
    );
  });

});

describe("interrupteur de publication (état publié simulé)", () => {
  it("publié : Storytelling rejoint le seed, l'offre, les slugs et le quiz (accroche 4 A)", () => {
    expect(publishedSeedJson(true).map((p) => p.slug)).toEqual(["machine-a-cafe", "repartie", "confiance", "storytelling"]);
    jest.isolateModules(() => {
      jest.doMock("@/config/parcours-publication", () => ({ STORYTELLING_PUBLIE: true }));
      const entrees = require("@/lib/entrees-parcours");
      const premium = require("@/config/premium");
      const quiz = require("@/components/quiz/quiz-data");
      const textes = require("@/config/textes/entrees-parcours");
      const data = require("@/lib/parcours-data");
      expect(entrees.isParcoursSlug("storytelling")).toBe(true);
      expect(premium.PARCOURS_COUNT).toBe(4);
      expect(quiz.QUIZ_PROFILES.STORYTELLER.recommendedParcours).toBe("storytelling");
      expect(textes.QUIZ_HUMOUR_PARCOURS.raison.STORYTELLER).toBe(
        "Tu sais tenir une table avec tes histoires : ce parcours commence par en écrire une comme elle vient, puis par couper ce qui traîne.",
      );
      expect(entrees.parcoursEtape1Href("storytelling", "quiz")).toBe("/parcours/storytelling?src=quiz#etape-1");
      expect(data.buildPathFromSeed("storytelling")?.steps).toHaveLength(6);
    });
  });
});

/** Base vide (premier démarrage) : conseils inactifs aux ids attendus, aucune vanne neuve, pas de parcours. */
function baseInitiale() {
  mockPatchFindUnique.mockResolvedValue(null);
  mockTipFindUnique.mockImplementation(({ where }: { where: { id: string } }) => {
    const c = meta.conseilsReactives.find((x) => x.id === where.id);
    return Promise.resolve(
      c ? { id: c.id, title: c.title, isActive: false, content: "ancien", example: "ancien", exercise: "ancien", originalContent: null } : null,
    );
  });
  mockTipFindFirst.mockImplementation(({ where }: { where: { title: string } }) =>
    Promise.resolve({ id: `tip-${where.title}`, exercise: "DÉFI BILAN : raconte-la ce soir." }),
  );
  mockTipFindMany.mockResolvedValue(TITRES.map((title, i) => ({ id: `tip-${i + 1}`, title })));
  mockJokeFindFirst.mockResolvedValue(null);
  mockJokeFindMany.mockResolvedValue(ALL_JOKES.map((content) => ({ content })));
  mockPathFindUnique.mockResolvedValue(null);
  mockPathCreate.mockImplementation(({ data }: { data: object }) => Promise.resolve({ id: "path-st", ...data, steps: [] }));
}

describe("tâche de démarrage applyStorytellingImportTask", () => {
  it("non publié : conseils réactivés, repli de l'étape 3, 5 vannes créées, parcours INACTIF et 6 étapes", async () => {
    baseInitiale();
    const r = await applyStorytellingImportTask(false);

    expect(r?.conseils.updated).toEqual(["Raconter une anecdote en 3 actes", "Le twist final", "La blague à tiroirs"]);
    const tipUpdates = mockTipUpdate.mock.calls.map(([a]) => a as { where: { id: string }; data: Record<string, unknown> });
    meta.conseilsReactives.forEach((c) =>
      expect(tipUpdates).toContainEqual(
        expect.objectContaining({
          where: { id: c.id },
          data: expect.objectContaining({ isActive: true, content: c.content, example: c.example, exercise: c.exercise }),
        }),
      ),
    );
    expect(r?.defis).toMatchObject({ updated: ["storytelling-3"], skipped: ["storytelling-6"] });
    expect(tipUpdates.find((u) => u.where.id === "tip-Rigoler de ses échecs")?.data.exercise).toBe(
      `DÉFI BILAN : raconte-la ce soir. ${meta.defisRetouches[0].ajouterALaFin}`,
    );

    expect(r?.vannes.created).toEqual([0, 1, 2, 3, 4].map(vanneNeuveId));
    const created = mockJokeCreate.mock.calls.map(([a]) => (a as { data: Record<string, unknown> }).data);
    expect(created[0]).toMatchObject({
      content: meta.vannesNeuvesEtape5[0].content,
      punchline: meta.vannesNeuvesEtape5[0].punchline,
      comedyTechnique: "Le tiroir",
      isActive: true,
      copyVerdict: "GARDER",
    });

    expect(mockPathCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ slug: "storytelling", order: 4, isActive: false, difficulty: "INTERMEDIAIRE" }) }),
    );
    expect(mockStepCreate.mock.calls.map(([a]) => (a as { data: object }).data)).toEqual(
      [3, 10, 17, 24, 31, 38].map((dayNumber, i) => ({ learningPathId: "path-st", tipId: `tip-${i + 1}`, order: i + 1, dayNumber })),
    );
    expect(r?.jokesMissing).toEqual([]);
    expect(mockPatchUpsert).toHaveBeenCalledWith(expect.objectContaining({ where: { patchId: storytellingGlobalPatchId(false) } }));
  });

  it("revérification : un id dont le titre ne correspond pas n'est jamais écrit, et le marqueur global attend", async () => {
    baseInitiale();
    mockTipFindUnique.mockResolvedValue({ id: "x", title: "Autre conseil", isActive: false, content: "", example: "", exercise: "", originalContent: null });
    mockTipFindMany.mockResolvedValue([]);
    const r = await applyStorytellingImportTask(false);
    expect(r?.conseils.refused).toHaveLength(3);
    expect(mockTipUpdate.mock.calls.some(([a]) => (a as { data: { isActive?: boolean } }).data.isActive)).toBe(false);
    expect(r?.steps.tipsMissing).toHaveLength(6);
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });

  it("marqueur global présent : une seule lecture, aucune écriture", async () => {
    mockPatchFindUnique.mockResolvedValue({ patchId: storytellingGlobalPatchId(false) });
    expect(await applyStorytellingImportTask(false)).toBeNull();
    expect(mockPatchFindUnique).toHaveBeenCalledTimes(1);
    expect(mockTransaction).not.toHaveBeenCalled();
    expect(mockPathCreate).not.toHaveBeenCalled();
  });

  it("publication : parcours existant passé à isActive = true, défi B ajouté au callback (paragraphe à part)", async () => {
    baseInitiale();
    mockPatchFindUnique.mockImplementation(({ where }: { where: { patchId: string } }) =>
      Promise.resolve(/:(conseil|vanne):|defi:storytelling-3/.test(where.patchId) ? { patchId: where.patchId } : null),
    );
    mockTipFindFirst.mockResolvedValue({ id: "tip-callback", exercise: "DÉFI SOIRÉE : reprends-le le soir." });
    mockPathFindUnique.mockResolvedValue({
      id: "path-st",
      ...storytelling.parcours,
      isActive: false,
      steps: TITRES.map((title, i) => ({ id: `step-${i + 1}`, order: i + 1, dayNumber: [3, 10, 17, 24, 31, 38][i], tip: { id: `tip-${i + 1}`, title } })),
    });
    const r = await applyStorytellingImportTask(true);
    expect(mockPathUpdate).toHaveBeenCalledWith({ where: { id: "path-st" }, data: { isActive: true } });
    expect(mockStepCreate).not.toHaveBeenCalled();
    expect(mockStepUpdate).not.toHaveBeenCalled();
    expect(r?.defis.updated).toEqual(["storytelling-6"]);
    expect(mockTipUpdate).toHaveBeenCalledWith({
      where: { id: "tip-callback" },
      data: { exercise: `DÉFI SOIRÉE : reprends-le le soir.\n\n${meta.defisRetouches[1].ajouterALaFin}` },
    });
    expect(mockPatchUpsert).toHaveBeenCalledWith(expect.objectContaining({ where: { patchId: storytellingGlobalPatchId(true) } }));
  });
});
