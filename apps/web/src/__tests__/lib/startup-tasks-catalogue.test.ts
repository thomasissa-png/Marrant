/**
 * Tests — applyCatalogueContentTask (lib/startup-tasks.ts, s11 passe 2).
 *
 * La refonte copy vit dans les fichiers de seed, or le seed est bloqué en
 * production : cette tâche de boot applique UNIQUEMENT les textes, de façon
 * idempotente (marqueur DataPatch versionné) et fail-safe.
 *
 * Couvre : renommage via alias (string et tableau), pas de doublon de content,
 * vannes IA exclues, conseils/vidéos/parcours, idempotence (marqueur + 0 update
 * si déjà à jour), échec DB → pas de throw ni de marqueur.
 */

const mockJokeFindMany = jest.fn();
const mockJokeUpdate = jest.fn();
const mockTipFindMany = jest.fn();
const mockTipUpdate = jest.fn();
const mockVideoFindMany = jest.fn();
const mockVideoUpdate = jest.fn();
const mockPathFindMany = jest.fn();
const mockPathUpdate = jest.fn();
const mockPatchFindUnique = jest.fn();
const mockPatchUpsert = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: {
      findMany: (...a: unknown[]) => mockJokeFindMany(...a),
      update: (...a: unknown[]) => mockJokeUpdate(...a),
    },
    tip: {
      findMany: (...a: unknown[]) => mockTipFindMany(...a),
      update: (...a: unknown[]) => mockTipUpdate(...a),
    },
    video: {
      findMany: (...a: unknown[]) => mockVideoFindMany(...a),
      update: (...a: unknown[]) => mockVideoUpdate(...a),
    },
    learningPath: {
      findMany: (...a: unknown[]) => mockPathFindMany(...a),
      update: (...a: unknown[]) => mockPathUpdate(...a),
    },
    dataPatch: {
      findUnique: (...a: unknown[]) => mockPatchFindUnique(...a),
      upsert: (...a: unknown[]) => mockPatchUpsert(...a),
    },
  },
}));

import { applyCatalogueContentTask, CATALOGUE_CONTENT_PATCH_ID } from "@/lib/startup-tasks";
import blaguesSeed from "../../../../../docs/content/blagues-seed.json";
import conseilsSeed from "../../../../../docs/content/conseils-seed.json";
import videosSeed from "../../../../../docs/content/videos-seed.json";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";
import jokeDecryptages from "@/data/joke-decryptages.json";

type SeedJoke = { content: string; punchline: string; previousContent?: string | string[] };
const jokes = blaguesSeed as SeedJoke[];
const decs = jokeDecryptages as Array<{
  content: string;
  comedyTechnique: string;
  techniqueExplanation: string;
  howToApply: string;
}>;
const jokeWithAlias = jokes.find((j) => typeof j.previousContent === "string")!;
const jokeWithAliasList = jokes.find((j) => Array.isArray(j.previousContent))!;
const tipWithAlias = (conseilsSeed as Array<{ title: string; previousTitle?: string }>).find(
  (t) => t.previousTitle,
)!;
const video = (videosSeed as Array<{ youtubeId: string; description: string }>)[0];
const path = (parcoursSeed as Array<{ slug: string; description: string }>)[0];

/** Ligne DB déjà conforme au seed (texte + décryptage). */
function upToDateJokeRow(j: SeedJoke, id: string) {
  const d = decs.find((x) => x.content === j.content)!;
  return {
    id,
    content: j.content,
    punchline: j.punchline,
    comedyTechnique: d.comedyTechnique,
    techniqueExplanation: d.techniqueExplanation,
    howToApply: d.howToApply,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  mockPatchFindUnique.mockResolvedValue(null);
  mockPatchUpsert.mockResolvedValue({});
  mockJokeFindMany.mockResolvedValue([]);
  mockTipFindMany.mockResolvedValue([]);
  mockVideoFindMany.mockResolvedValue([]);
  mockPathFindMany.mockResolvedValue([]);
  [mockJokeUpdate, mockTipUpdate, mockVideoUpdate, mockPathUpdate].forEach((m) =>
    m.mockResolvedValue({}),
  );
});

afterEach(() => jest.restoreAllMocks());

describe("applyCatalogueContentTask", () => {
  it("renomme une vanne via previousContent (string) et applique punchline + décryptage", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "j1", content: jokeWithAlias.previousContent, punchline: "vieille chute", comedyTechnique: null, techniqueExplanation: null, howToApply: null },
    ]);
    await applyCatalogueContentTask();

    const dec = decs.find((d) => d.content === jokeWithAlias.content)!;
    expect(mockJokeUpdate).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith({
      where: { id: "j1" },
      data: {
        content: jokeWithAlias.content,
        punchline: jokeWithAlias.punchline,
        comedyTechnique: dec.comedyTechnique,
        techniqueExplanation: dec.techniqueExplanation,
        howToApply: dec.howToApply,
      },
    });
    expect(mockPatchUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { patchId: CATALOGUE_CONTENT_PATCH_ID } }),
    );
  });

  it("renomme via un alias d'un previousContent en tableau", async () => {
    const aliases = jokeWithAliasList.previousContent as string[];
    mockJokeFindMany.mockResolvedValue([
      { ...upToDateJokeRow(jokeWithAliasList, "j2"), content: aliases[aliases.length - 1] },
    ]);
    await applyCatalogueContentTask();
    expect(mockJokeUpdate).toHaveBeenCalledWith({
      where: { id: "j2" },
      data: { content: jokeWithAliasList.content },
    });
  });

  it("ne crée pas de doublon : si le nouveau content existe, l'alias n'est pas touché", async () => {
    mockJokeFindMany.mockResolvedValue([
      { ...upToDateJokeRow(jokeWithAlias, "new"), punchline: "ancienne chute" },
      { ...upToDateJokeRow(jokeWithAlias, "old"), content: jokeWithAlias.previousContent },
    ]);
    await applyCatalogueContentTask();
    expect(mockJokeUpdate).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith({
      where: { id: "new" },
      data: { punchline: jokeWithAlias.punchline },
    });
  });

  it("ne lit que les vannes non IA (generatedByAI: false)", async () => {
    await applyCatalogueContentTask();
    expect(mockJokeFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { generatedByAI: false } }),
    );
    expect(mockTipFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { generatedByAI: false } }),
    );
  });

  it("met à jour conseil (via previousTitle), vidéo et description de parcours", async () => {
    mockTipFindMany.mockResolvedValue([
      { id: "t1", title: tipWithAlias.previousTitle, content: "x", example: "x", exercise: "x" },
    ]);
    mockVideoFindMany.mockResolvedValue([
      { id: "v1", youtubeId: video.youtubeId, description: "old", technique: "old", learnings: [], exercise: null },
    ]);
    mockPathFindMany.mockResolvedValue([{ id: "p1", slug: path.slug, description: "old" }]);
    await applyCatalogueContentTask();

    expect(mockTipUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "t1" },
        data: expect.objectContaining({ title: tipWithAlias.title }),
      }),
    );
    expect(mockVideoUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "v1" },
        data: expect.objectContaining({ description: video.description }),
      }),
    );
    expect(mockPathUpdate).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: { description: path.description },
    });
  });

  it("idempotent : rien à changer → 0 update ; marqueur présent → skip total", async () => {
    mockJokeFindMany.mockResolvedValue(jokes.map((j, i) => upToDateJokeRow(j, `j${i}`)));
    mockPathFindMany.mockResolvedValue([{ id: "p1", slug: path.slug, description: path.description }]);
    await applyCatalogueContentTask();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
    expect(mockPathUpdate).not.toHaveBeenCalled();
    expect(mockPatchUpsert).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
    mockPatchFindUnique.mockResolvedValue({ patchId: CATALOGUE_CONTENT_PATCH_ID });
    await applyCatalogueContentTask();
    expect(mockJokeFindMany).not.toHaveBeenCalled();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });

  it("échec DB sur une section → pas de throw, autres sections jouées, pas de marqueur", async () => {
    mockJokeFindMany.mockRejectedValue(new Error("boom"));
    mockPathFindMany.mockResolvedValue([{ id: "p1", slug: path.slug, description: "old" }]);
    await expect(applyCatalogueContentTask()).resolves.toBeUndefined();
    expect(mockPathUpdate).toHaveBeenCalledTimes(1);
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });

  it("échec DB sur le marqueur → pas de throw", async () => {
    mockPatchFindUnique.mockRejectedValue(new Error("db down"));
    await expect(applyCatalogueContentTask()).resolves.toBeUndefined();
    expect(mockJokeFindMany).not.toHaveBeenCalled();
  });
});
