/**
 * @jest-environment node
 *
 * GO Thomas (03/10/2026) : la description des fiches vannes n'affiche plus
 * « 550+ » en dur mais le nombre réel de vannes actives (même source que les
 * compteurs du site : getContentStatsCached). Base KO : aucun chiffre.
 */
const getContentStatsCached = jest.fn();
jest.mock("@/lib/content-stats-server", () => ({
  getContentStatsCached: () => getContentStatsCached(),
}));

const JOKE = {
  id: "abcdefghij0123456789",
  isActive: true,
  content: "Mon chef m'a dit de penser hors de la boîte.",
  punchline: "Je télétravaille depuis.",
  category: "BOULOT",
  type: "CLASSIQUE",
  comedyTechnique: null,
  techniqueExplanation: null,
  howToApply: null,
  updatedAt: new Date("2026-10-01"),
  createdAt: new Date("2026-09-01"),
};
jest.mock("@/lib/prisma", () => ({
  prisma: { joke: { findMany: jest.fn(async () => [JOKE]) } },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));

import { generateMetadata } from "@/app/(dashboard)/vannes/[slug]/page";
import { buildJokeSlug } from "@/lib/catalogue-slug";

async function description(): Promise<string> {
  const meta = await generateMetadata({ params: { slug: buildJokeSlug(JOKE) } });
  return String(meta.description);
}

describe("fiche vanne : compteur de la description", () => {
  it("nombre réel de vannes actives, moins celle de la page", async () => {
    getContentStatsCached.mockResolvedValue({ jokes: 125, tips: 109, videos: 40 });
    const desc = await description();
    expect(desc).toContain("avec 124 autres vannes par situation.");
    expect(desc).not.toContain("550");
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it("base KO (compteur à 0) : aucun chiffre inventé", async () => {
    getContentStatsCached.mockResolvedValue({ jokes: 0, tips: 0, videos: 0 });
    expect(await description()).toContain("avec d'autres vannes par situation.");
  });
});
