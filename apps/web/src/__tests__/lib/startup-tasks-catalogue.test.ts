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
 * s20 : garde-fou « contenu en base = texte que la refonte remplace » (sinon
 * refus, aucune écriture, pas de marqueur).
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
  // s20 : les 6 vannes alignées sur la base n'ont pas de décryptage indexé
  // sous leur texte (la tâche ne compare alors pas le décryptage).
  const d = decs.find((x) => x.content === j.content);
  return {
    id,
    content: j.content,
    punchline: j.punchline,
    comedyTechnique: d?.comedyTechnique ?? null,
    techniqueExplanation: d?.techniqueExplanation ?? null,
    howToApply: d?.howToApply ?? null,
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
      upToDateJokeRow(jokeWithAlias, "new"),
      { ...upToDateJokeRow(jokeWithAlias, "old"), content: jokeWithAlias.previousContent },
    ]);
    await applyCatalogueContentTask();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
    expect(mockPatchUpsert).toHaveBeenCalledTimes(1);
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

  it("met à jour un conseil via previousTitle ; vidéo et parcours différents → refusés (s20)", async () => {
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
    expect(mockVideoUpdate).not.toHaveBeenCalled();
    expect(mockPathUpdate).not.toHaveBeenCalled();
    expect(mockPatchUpsert).not.toHaveBeenCalled();
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
    mockTipFindMany.mockResolvedValue([
      { id: "t1", title: tipWithAlias.previousTitle, content: "x", example: "x", exercise: "x" },
    ]);
    await expect(applyCatalogueContentTask()).resolves.toBeUndefined();
    expect(mockTipUpdate).toHaveBeenCalledTimes(1);
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });

  it("échec DB sur le marqueur → pas de throw", async () => {
    mockPatchFindUnique.mockRejectedValue(new Error("db down"));
    await expect(applyCatalogueContentTask()).resolves.toBeUndefined();
    expect(mockJokeFindMany).not.toHaveBeenCalled();
  });
});

describe("garde-fou s20 : jamais de réécriture d'un texte validé depuis", () => {
  const errors = () =>
    (console.error as jest.Mock).mock.calls.map((c) => String(c[0])).join("\n");

  it("contenu en base = previousContent attendu → écriture", async () => {
    mockJokeFindMany.mockResolvedValue([
      { ...upToDateJokeRow(jokeWithAlias, "j1"), content: jokeWithAlias.previousContent },
    ]);
    await applyCatalogueContentTask();
    expect(mockJokeUpdate).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "j1" }, data: expect.objectContaining({ content: jokeWithAlias.content }) }),
    );
    expect(errors()).not.toContain("GARDE-FOU");
    expect(mockPatchUpsert).toHaveBeenCalledTimes(1);
  });

  it("contenu en base ≠ attendu (chute validée depuis) → aucune écriture, erreur, pas de marqueur", async () => {
    mockJokeFindMany.mockResolvedValue([
      { ...upToDateJokeRow(jokeWithAlias, "j1"), punchline: "Chute relue et validée depuis." },
    ]);
    await applyCatalogueContentTask();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
    expect(errors()).toContain("GARDE-FOU, 1 vannes NON réécrit(s)");
    expect(errors()).toContain("j1");
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });

  it("refus ligne par ligne : la ligne attendue est écrite, l'autre non", async () => {
    mockJokeFindMany.mockResolvedValue([
      { ...upToDateJokeRow(jokeWithAlias, "ok"), content: jokeWithAlias.previousContent },
      { ...upToDateJokeRow(jokeWithAliasList, "ko"), punchline: "Autre chute validée." },
    ]);
    await applyCatalogueContentTask();
    expect(mockJokeUpdate).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "ok" } }));
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });

  it("les 6 vannes actives (texte en base) : relance sans aucune écriture", async () => {
    const actives = jokes.filter((j) => !j.previousContent && decs.every((d) => d.content !== j.content));
    expect(actives.length).toBeGreaterThanOrEqual(6);
    mockJokeFindMany.mockResolvedValue(
      actives.map((j, i) => ({ ...upToDateJokeRow(j, `a${i}`), comedyTechnique: "Décryptage s14" })),
    );
    await applyCatalogueContentTask();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
    expect(mockPatchUpsert).toHaveBeenCalledTimes(1);
  });

  it("conseils du seed tels quels en base (seed aligné s20) : relance sans aucune écriture", async () => {
    mockTipFindMany.mockResolvedValue(
      (conseilsSeed as Array<{ title: string; content: string; example: string; exercise: string }>).map(
        (t, i) => ({ id: `t${i}`, title: t.title, content: t.content, example: t.example, exercise: t.exercise }),
      ),
    );
    await applyCatalogueContentTask();
    expect(mockTipUpdate).not.toHaveBeenCalled();
    expect(errors()).not.toContain("GARDE-FOU");
    expect(mockPatchUpsert).toHaveBeenCalledTimes(1);
  });

  it("conseil au titre cible mais corps différent → refusé ; vidéo différente → refusée", async () => {
    const tip = (conseilsSeed as Array<{ title: string }>)[0];
    mockTipFindMany.mockResolvedValue([
      { id: "t1", title: tip.title, content: "Texte validé depuis", example: "x", exercise: "x" },
    ]);
    mockVideoFindMany.mockResolvedValue([
      { id: "v1", youtubeId: video.youtubeId, description: "Fiche corrigée en s19", technique: "t", learnings: [], exercise: null },
    ]);
    await applyCatalogueContentTask();
    expect(mockTipUpdate).not.toHaveBeenCalled();
    expect(mockVideoUpdate).not.toHaveBeenCalled();
    expect(errors()).toContain("1 conseils NON réécrit(s)");
    expect(errors()).toContain("1 vidéos NON réécrit(s)");
    expect(mockPatchUpsert).not.toHaveBeenCalled();
  });
});
