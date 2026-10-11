/**
 * Relecture SEO s11 : une erreur DB passagère (base froide) ne doit JAMAIS
 * produire un 404 sur une page individuelle (vanne, conseil, vidéo, article
 * DB). Avant : `catch { return null }` → notFound() → 404 mis en cache ISR
 * (24 h pour le catalogue) sur une page qui existe, vue par Googlebot.
 * Attendu : l'erreur remonte (500 retenté ; en revalidation, la version en
 * cache est gardée).
 */

const dbDown = () => Promise.reject(new Error("DB indisponible"));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: jest.fn(() => dbDown()) },
    tip: { findMany: jest.fn(() => dbDown()) },
    video: { findMany: jest.fn(() => dbDown()) },
    blogArticle: {
      findUnique: jest.fn(() => dbDown()),
      findMany: jest.fn(() => dbDown()),
    },
  },
}));

// Pas de backoff réel dans le test : une seule tentative.
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));

const notFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
jest.mock("next/navigation", () => ({ notFound: () => notFound() }));

const SHORT_ID = "cmabcdefgh";

describe("pages individuelles — erreur DB ≠ 404", () => {
  beforeEach(() => notFound.mockClear());

  it.each([
    ["vannes", "@/app/(dashboard)/vannes/[slug]/page"],
    ["conseils", "@/app/(dashboard)/conseils/[slug]/page"],
    ["videos", "@/app/(dashboard)/videos/[slug]/page"],
  ])("/%s/[slug] : l'erreur DB remonte (metadata + page), pas de notFound()", async (_name, mod) => {
    const page = require(mod);
    const params = { slug: `une-vanne-${SHORT_ID}` };
    await expect(page.generateMetadata({ params })).rejects.toThrow("DB indisponible");
    await expect(page.default({ params })).rejects.toThrow("DB indisponible");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("/blog/[slug] (article DB) : l'erreur DB remonte, pas de notFound()", async () => {
    const page = require("@/app/(dashboard)/blog/[slug]/page");
    const params = { slug: "article-uniquement-en-base" };
    await expect(page.generateMetadata({ params })).rejects.toThrow("DB indisponible");
    await expect(page.default({ params })).rejects.toThrow("DB indisponible");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("/blog/[slug] (article statique) : aucune dépendance DB pour le trouver", async () => {
    const page = require("@/app/(dashboard)/blog/[slug]/page");
    const meta = await page.generateMetadata({ params: { slug: "meilleures-blagues-droles-2026" } });
    expect(meta.alternates.canonical).toBe(
      "https://deviens-marrant.fr/blog/meilleures-blagues-droles-2026",
    );
  });
});
