/**
 * s20 (décision Thomas du 12/10) : le gabarit de méta de /videos/[slug] ne doit
 * plus injecter de tiret cadratin (« Chaîne : description »), ni en
 * description, ni en Open Graph, ni en Twitter.
 */
import { buildCatalogueSlug } from "@/lib/catalogue-slug";

const findMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: { video: { findMany: (...a: unknown[]) => findMany(...a) } },
}));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  permanentRedirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

const ID = "cmvideometas20000001";
const TITLE = "Le faux naïf";

describe("/videos/[slug] : méta sans tiret cadratin", () => {
  it("description, Open Graph et Twitter : « Chaîne : description », aucun « — »", async () => {
    findMany.mockResolvedValue([
      {
        id: ID,
        isActive: true,
        title: TITLE,
        youtubeId: "abcdefghijk",
        channelName: "Élodie Poux",
        description: "Elle observe l'école maternelle comme une tribu, avec distance et faux sérieux.",
        technique: "Ethnologue",
        category: "OBSERVATION",
        difficulty: "BEGINNER",
        learnings: [],
        exercise: null,
        updatedAt: new Date("2026-10-12"),
        createdAt: new Date("2026-03-01"),
      },
    ]);
    const page = require("@/app/(dashboard)/videos/[slug]/page");
    const meta = await page.generateMetadata({ params: { slug: buildCatalogueSlug(TITLE, ID) } });
    expect(meta.description).toMatch(/^Élodie Poux : Elle observe/);
    expect(JSON.stringify(meta)).not.toContain("—");
    expect(meta.openGraph.description).toBe(meta.description);
    expect(meta.twitter.description).toBe(meta.description);
  });
});
