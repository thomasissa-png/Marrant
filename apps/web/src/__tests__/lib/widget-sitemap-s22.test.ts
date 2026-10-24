/**
 * @jest-environment node
 *
 * s22 : la page du programme /integrer-la-vanne-du-jour entre au sitemap
 * une fois le widget publié (et seulement alors).
 */
let mockPublie = true;
jest.mock("@/config/widget-vanne-du-jour", () => {
  const actual = jest.requireActual("@/config/widget-vanne-du-jour");
  return {
    ...actual,
    get WIDGET_VANNE_DU_JOUR_PUBLIE() {
      return mockPublie;
    },
  };
});
jest.mock("@/lib/prisma", () => ({
  prisma: {
    dailyContent: { findFirst: async () => null },
    blogArticle: { findMany: async () => [] },
  },
}));
jest.mock("@/lib/sitemap-parcours", () => ({
  getParcoursSitemapDates: async () => ({ hub: new Date("2026-10-11"), bySlug: {} }),
}));
jest.mock("@/lib/sitemap-catalogue", () => ({ getCatalogueSitemapEntries: async () => [] }));

import sitemap from "@/app/sitemap";

const URL_PROGRAMME = "https://deviens-marrant.fr/integrer-la-vanne-du-jour";
const URL_DEVELOPERS = "https://deviens-marrant.fr/developers";

describe("sitemap : page du programme du widget", () => {
  it("publié → présente une fois, lastModified réel", async () => {
    mockPublie = true;
    const entries = (await sitemap()).filter((e) => e.url === URL_PROGRAMME);
    expect(entries).toHaveLength(1);
    expect(entries[0].lastModified).toEqual(new Date("2026-10-24"));
  });

  it("non publié → absente", async () => {
    mockPublie = false;
    expect((await sitemap()).some((e) => e.url === URL_PROGRAMME)).toBe(false);
  });

  it("publié → /developers présente une fois, mensuelle, priorité 0.5, lastModified réel", async () => {
    mockPublie = true;
    const entries = (await sitemap()).filter((e) => e.url === URL_DEVELOPERS);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ changeFrequency: "monthly", priority: 0.5, lastModified: new Date("2026-10-24") });
  });

  it("non publié → /developers absente", async () => {
    mockPublie = false;
    expect((await sitemap()).some((e) => e.url === URL_DEVELOPERS)).toBe(false);
  });

  it("aucune URL /embed/ au sitemap (document noindex)", async () => {
    mockPublie = true;
    expect((await sitemap()).some((e) => e.url.includes("/embed/"))).toBe(false);
  });
});
