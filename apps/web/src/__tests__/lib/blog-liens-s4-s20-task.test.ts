/**
 * @jest-environment node
 *
 * Tests : applyBlogLiensS4S20Task (liens S4 s20). Remplacement exact unique,
 * idempotence via DataPatch, refus si chaîne « avant » absente ou multiple
 * (article non touché, pas de marqueur), tout-ou-rien par article,
 * sauvegarde du contenu avant, updatedAt seulement pour l'article modifié.
 */
const mockFindUnique = jest.fn();
const mockDataPatchFindUnique = jest.fn();
const mockUpdate = jest.fn((arg: unknown) => ({ op: "update", arg }));
const mockCreate = jest.fn((arg: unknown) => ({ op: "create", arg }));
const mockTransaction = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: {
      findUnique: (...a: unknown[]) => mockFindUnique(...a),
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

import {
  applyBlogLiensS4S20Task,
  BLOG_LIENS_S4_S20_PATCHES,
  computeLinkPatch,
} from "@/lib/blog-liens-s4-s20";

const patchOf = (slug: string) => BLOG_LIENS_S4_S20_PATCHES.find((p) => p.slug === slug)!;
const SEVEN = patchOf("blague-drole-7-criteres-pepite");
const IMPRO = patchOf("comment-improviser-des-blagues");
const wrap = (s: string) => `Intro.\n\n${s}\n\nSuite de l'article.`;
/** Contenu « avant » plausible pour un article : toutes ses chaînes « avant ». */
const contentFor = (slug: string) => wrap(patchOf(slug).replacements.map((r) => r.before).join("\n\nMilieu.\n\n"));

let logSpy: jest.SpyInstance;
let errSpy: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  mockTransaction.mockResolvedValue([]);
  mockDataPatchFindUnique.mockResolvedValue(null);
});

describe("computeLinkPatch", () => {
  it("remplace chaque « avant » par son « après », le reste intact", () => {
    const out = computeLinkPatch(contentFor(IMPRO.slug), IMPRO.replacements);
    expect(out.status).toBe("apply");
    if (out.status !== "apply") return;
    expect(out.content).toBe(wrap(IMPRO.replacements.map((r) => r.after).join("\n\nMilieu.\n\n")));
  });

  it("refuse si une chaîne « avant » est absente (tout-ou-rien)", () => {
    const only12 = wrap(IMPRO.replacements[1].before);
    expect(computeLinkPatch(only12, IMPRO.replacements)).toEqual({
      status: "error",
      reason: "appariement 2 : chaîne « avant » trouvée 0 fois (attendu : 1)",
    });
  });

  it("refuse si une chaîne « avant » est présente deux fois", () => {
    const twice = wrap(`${SEVEN.replacements[0].before}\n\n${SEVEN.replacements[0].before}`);
    expect(computeLinkPatch(twice, SEVEN.replacements).status).toBe("error");
  });

  it("phrases déjà présentes (copie JSON) → already-present", () => {
    expect(computeLinkPatch(wrap(SEVEN.replacements[0].after), SEVEN.replacements)).toEqual({ status: "already-present" });
  });
});

describe("applyBlogLiensS4S20Task", () => {
  const articles = (overrides: Record<string, string | null> = {}) =>
    mockFindUnique.mockImplementation(({ where: { slug } }: { where: { slug: string } }) => {
      const content = slug in overrides ? overrides[slug] : contentFor(slug);
      return Promise.resolve(content === null ? null : { id: `id-${slug}`, content, isPublished: true });
    });

  it("applique les 4 articles une fois, avec marqueur et sauvegarde du contenu avant", async () => {
    articles();
    await applyBlogLiensS4S20Task();

    expect(mockTransaction).toHaveBeenCalledTimes(4);
    const ids = mockCreate.mock.calls.map((c) => (c[0] as { data: { patchId: string } }).data.patchId);
    expect(ids).toEqual(BLOG_LIENS_S4_S20_PATCHES.map((p) => `blog-liens-s4-s20:v1:${p.slug}`));

    const update = mockUpdate.mock.calls[0][0] as { where: { id: string }; data: { content: string; updatedAt: Date } };
    expect(update.where).toEqual({ id: `id-${IMPRO.slug}` });
    expect(update.data.updatedAt).toBeInstanceOf(Date);
    const note = JSON.parse((mockCreate.mock.calls[0][0] as { data: { note: string } }).data.note);
    expect(note.before).toBe(contentFor(IMPRO.slug));
    expect(note.appariements).toEqual([2, 12]);
    expect(logSpy).toHaveBeenCalledWith(
      "[startup] liens S4 s20 v1 : 4 article(s) modifié(s) (5 phrase(s)), 0 déjà patché(s), 0 déjà présent(s), 0 en erreur.",
    );
  });

  it("2e passage : marqueurs présents → 0 lecture d'article, 0 update", async () => {
    mockDataPatchFindUnique.mockResolvedValue({ patchId: "x" });
    await applyBlogLiensS4S20Task();
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockTransaction).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      "[startup] liens S4 s20 v1 : 0 article(s) modifié(s) (0 phrase(s)), 4 déjà patché(s), 0 déjà présent(s), 0 en erreur.",
    );
  });

  it("chaîne absente ou multiple → erreur journalisée, article non touché, pas de marqueur", async () => {
    articles({
      [IMPRO.slug]: wrap(IMPRO.replacements[1].before), // appariement 2 absent
      [SEVEN.slug]: wrap(`${SEVEN.replacements[0].before}\n\n${SEVEN.replacements[0].before}`),
    });
    await applyBlogLiensS4S20Task();

    expect(mockTransaction).toHaveBeenCalledTimes(2);
    const updated = mockUpdate.mock.calls.map((c) => (c[0] as { where: { id: string } }).where.id);
    expect(updated).not.toContain(`id-${IMPRO.slug}`);
    expect(updated).not.toContain(`id-${SEVEN.slug}`);
    expect(errSpy).toHaveBeenCalledWith(
      `[startup] liens S4 s20 : "${IMPRO.slug}" non modifié, appariement 2 : chaîne « avant » trouvée 0 fois (attendu : 1).`,
    );
    expect(errSpy).toHaveBeenCalledWith(
      `[startup] liens S4 s20 : "${SEVEN.slug}" non modifié, appariement 8 : chaîne « avant » trouvée 2 fois (attendu : 1).`,
    );
  });

  it("article introuvable → erreur, pas de marqueur ; phrases déjà là → marqueur sans update", async () => {
    articles({ [IMPRO.slug]: null, [SEVEN.slug]: wrap(SEVEN.replacements[0].after) });
    await applyBlogLiensS4S20Task();
    expect(mockTransaction).toHaveBeenCalledTimes(2);
    const marks = mockCreate.mock.calls.map((c) => (c[0] as { data: { patchId: string } }).data.patchId);
    expect(marks).toContain(`blog-liens-s4-s20:v1:${SEVEN.slug}`);
    expect(marks).not.toContain(`blog-liens-s4-s20:v1:${IMPRO.slug}`);
    expect(mockUpdate.mock.calls.map((c) => (c[0] as { where: { id: string } }).where.id)).not.toContain(`id-${SEVEN.slug}`);
  });

  it("erreur DB sur un article → non bloquant, les autres continuent", async () => {
    articles();
    mockTransaction.mockRejectedValueOnce(new Error("neon froid"));
    await expect(applyBlogLiensS4S20Task()).resolves.toBeUndefined();
    expect(mockTransaction).toHaveBeenCalledTimes(4);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("3 article(s) modifié(s) (3 phrase(s))"));
  });
});
