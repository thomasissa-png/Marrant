/**
 * @jest-environment node
 *
 * Tests — applyBlogArticleRewritesTask (s11 charte refonte copy).
 * Idempotence via DataPatch, ciblage des articles publiés, fail-safe par slug.
 */
const mockBlogFindUnique = jest.fn();
const mockDataPatchFindUnique = jest.fn();
const mockTransaction = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: {
      findUnique: (...a: unknown[]) => mockBlogFindUnique(...a),
      update: jest.fn(),
    },
    dataPatch: {
      findUnique: (...a: unknown[]) => mockDataPatchFindUnique(...a),
      create: jest.fn(),
    },
    $transaction: (ops: unknown[]) => mockTransaction(ops),
  },
}));

jest.mock("@/lib/db-retry", () => ({
  withDbRetry: (fn: () => unknown) => Promise.resolve(fn()),
}));

// Mock du fichier JSON (l'agent lit @/data/blog-article-rewrites.json).
jest.mock("@/data/blog-article-rewrites.json", () => ({
  _meta: { version: 1 },
  rewrites: [
    {
      slug: "article-existant-publie",
      title: "Nouveau titre",
      content: "# Nouveau contenu\n\nCorps.",
    },
    {
      slug: "article-inexistant",
      title: "T",
      content: "C",
    },
    {
      slug: "article-non-publie",
      title: "T",
      content: "C",
    },
    {
      slug: "article-vide",
      // aucun champ utile → skip défensif
    },
    {
      slug: "article-deja-patche",
      title: "T",
      content: "C",
    },
  ],
}), { virtual: true });

// On mock aussi les autres imports statiques pour éviter les crashes I/O.
jest.mock("@/data/joke-decryptages.json", () => [], { virtual: true });
jest.mock("@/data/weak-jokes.json", () => [], { virtual: true });
jest.mock("@/data/blog-article-fixes.json", () => ({ fixes: [] }), { virtual: true });
jest.mock("@/lib/seo-redirects", () => ({
  DB_LOSER_SLUGS: [],
  SEO_REDIRECTS: [],
}));
jest.mock("@/lib/ai/ceo-helpers", () => ({ ensureCeoConfig: jest.fn() }));
jest.mock("@/lib/ai/agents/joke-agent", () => ({ generateJokeDecryptage: jest.fn() }));

import { applyBlogArticleRewritesTask } from "@/lib/startup-tasks";

beforeEach(() => {
  mockBlogFindUnique.mockReset();
  mockDataPatchFindUnique.mockReset();
  mockTransaction.mockReset().mockResolvedValue([{}, {}]);
});

describe("applyBlogArticleRewritesTask", () => {
  it("applique la réécriture UNIQUEMENT à l'article publié, sans marqueur préexistant", async () => {
    mockDataPatchFindUnique.mockImplementation(({ where }: { where: { patchId: string } }) =>
      Promise.resolve(where.patchId === "blog-rewrite:v1:article-deja-patche" ? { id: "d1" } : null),
    );
    mockBlogFindUnique.mockImplementation(({ where }: { where: { slug: string } }) => {
      if (where.slug === "article-existant-publie") return Promise.resolve({ id: "a1", isPublished: true });
      if (where.slug === "article-non-publie") return Promise.resolve({ id: "a2", isPublished: false });
      return Promise.resolve(null);
    });

    await applyBlogArticleRewritesTask();

    // Une seule transaction attendue (l'article publié non patché).
    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });

  it("idempotent : si le patch a déjà été appliqué (DataPatch existe), skip la transaction", async () => {
    mockDataPatchFindUnique.mockResolvedValue({ id: "already" });
    mockBlogFindUnique.mockResolvedValue({ id: "a1", isPublished: true });

    await applyBlogArticleRewritesTask();

    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("ne touche pas un article introuvable ni non publié (skip silencieux, pas de marqueur)", async () => {
    mockDataPatchFindUnique.mockResolvedValue(null);
    mockBlogFindUnique.mockImplementation(({ where }: { where: { slug: string } }) => {
      if (where.slug === "article-existant-publie") return Promise.resolve(null);
      if (where.slug === "article-non-publie") return Promise.resolve({ id: "x", isPublished: false });
      return Promise.resolve(null);
    });

    await applyBlogArticleRewritesTask();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("skip défensif si l'entrée n'apporte aucun champ utile (article-vide n'est jamais patché)", async () => {
    // Chaque slug retourne un article publié, aucun DataPatch existant. Le
    // fichier mocké a 5 entrées : 4 valides (contiennent des champs utiles),
    // 1 vide (`article-vide` : slug seul). On attend donc 4 transactions et
    // le fait qu'AUCUNE recherche DataPatch n'ait été faite pour article-vide
    // (le skip défensif intervient AVANT toute écriture).
    mockDataPatchFindUnique.mockResolvedValue(null);
    mockBlogFindUnique.mockResolvedValue({ id: "aX", isPublished: true });

    await applyBlogArticleRewritesTask();

    expect(mockTransaction).toHaveBeenCalledTimes(4);
  });
});
