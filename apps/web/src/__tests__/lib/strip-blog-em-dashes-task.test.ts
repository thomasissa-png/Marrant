/**
 * @jest-environment node
 *
 * Tests : stripBlogEmDashesTask (s12, règle n°12). Idempotence via DataPatch,
 * titres intouchés, contenu d'origine conservé pour retour arrière, fail-safe.
 */
const mockFindMany = jest.fn();
const mockDataPatchFindUnique = jest.fn();
const mockUpdate = jest.fn((arg: unknown) => ({ op: "update", arg }));
const mockCreate = jest.fn((arg: unknown) => ({ op: "create", arg }));
const mockTransaction = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: {
      findMany: (...a: unknown[]) => mockFindMany(...a),
      update: (a: unknown) => mockUpdate(a),
    },
    dataPatch: {
      findUnique: (...a: unknown[]) => mockDataPatchFindUnique(...a),
      create: (a: unknown) => mockCreate(a),
    },
    $transaction: (ops: unknown[]) => mockTransaction(ops),
  },
}));

jest.mock("@/lib/db-retry", () => ({
  withDbRetry: (fn: () => unknown) => Promise.resolve(fn()),
}));

import { stripBlogEmDashesTask } from "@/lib/startup-tasks";

const WITH_BODY = "## Pilier 1 : L'observation — Voir\n\nTon cerveau sait déjà faire tout ça — il le fait chaque jour.";
const HEADING_ONLY = "## Titre — sous-titre\n\nCorps sans tiret.";

describe("stripBlogEmDashesTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockTransaction.mockResolvedValue([]);
  });

  it("ne lit que les articles publiés contenant un tiret cadratin", async () => {
    mockFindMany.mockResolvedValue([]);
    await stripBlogEmDashesTask();
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { isPublished: true, content: { contains: "—" } },
      select: { id: true, slug: true, content: true },
    });
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("corrige le corps, garde le titre et pose le marqueur avec l'original", async () => {
    mockFindMany.mockResolvedValue([{ id: "a1", slug: "art", content: WITH_BODY }]);
    mockDataPatchFindUnique.mockResolvedValue(null);
    await stripBlogEmDashesTask();

    expect(mockTransaction).toHaveBeenCalledTimes(1);
    const update = mockUpdate.mock.calls[0][0] as { where: { id: string }; data: { content: string } };
    expect(update.where).toEqual({ id: "a1" });
    expect(update.data.content).toBe(
      "## Pilier 1 : L'observation — Voir\n\nTon cerveau sait déjà faire tout ça : il le fait chaque jour.",
    );
    const patch = mockCreate.mock.calls[0][0] as { data: { patchId: string; note: string } };
    expect(patch.data.patchId).toBe("blog-em-dash:v1:art");
    expect(JSON.parse(patch.data.note).before).toBe(WITH_BODY);
  });

  it("2e boot : marqueur présent → 0 update", async () => {
    mockFindMany.mockResolvedValue([{ id: "a1", slug: "art", content: WITH_BODY }]);
    mockDataPatchFindUnique.mockResolvedValue({ patchId: "blog-em-dash:v1:art" });
    await stripBlogEmDashesTask();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("tirets seulement dans les titres → ni update ni marqueur", async () => {
    mockFindMany.mockResolvedValue([{ id: "a2", slug: "titre", content: HEADING_ONLY }]);
    mockDataPatchFindUnique.mockResolvedValue(null);
    await stripBlogEmDashesTask();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("fail-safe : une erreur sur un article n'arrête pas les suivants", async () => {
    mockFindMany.mockResolvedValue([
      { id: "a1", slug: "ko", content: WITH_BODY },
      { id: "a3", slug: "ok", content: WITH_BODY },
    ]);
    mockDataPatchFindUnique.mockResolvedValue(null);
    mockTransaction.mockRejectedValueOnce(new Error("db down")).mockResolvedValueOnce([]);
    await expect(stripBlogEmDashesTask()).resolves.toBeUndefined();
    expect(mockTransaction).toHaveBeenCalledTimes(2);
  });

  it("lecture DB en échec → non bloquant", async () => {
    mockFindMany.mockRejectedValue(new Error("neon froid"));
    await expect(stripBlogEmDashesTask()).resolves.toBeUndefined();
    expect(mockTransaction).not.toHaveBeenCalled();
  });
});
