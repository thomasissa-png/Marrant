/**
 * @jest-environment node
 */
/**
 * s20, spec maillage S2 (docs/seo/maillage-decouverte-s20.md §4) : bloc « Dans la même
 * catégorie » en anneau (i+1, i+2, i-1, i-2 modulo n) dans l'ordre des listes.
 */
import { ringNeighbors } from "@/lib/related-ring";

const mockJokeFindMany = jest.fn();
const mockTipFindMany = jest.fn();
const mockVideoFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: (args: unknown) => mockJokeFindMany(args) },
    tip: { findMany: (args: unknown) => mockTipFindMany(args) },
    video: { findMany: (args: unknown) => mockVideoFindMany(args) },
  },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: <T,>(fn: () => Promise<T>) => fn() }));

import { getRelatedJokes, getRelatedTips, getRelatedVideos } from "@/lib/related-catalogue";

const ids = (n: number) => Array.from({ length: n }, (_, i) => `f${i}`);

describe("ringNeighbors", () => {
  it("jeu de 10 fiches : 4 voisins chacune, 4 liens entrants chacune, jamais elle-même", () => {
    const items = ids(10);
    const edges = new Map(items.map((id) => [id, ringNeighbors(items, (x) => x === id)]));
    const inbound = new Map(items.map((id) => [id, 0]));
    for (const [id, neighbors] of edges) {
      expect(neighbors).toHaveLength(4);
      expect(new Set(neighbors).size).toBe(4);
      expect(neighbors).not.toContain(id);
      neighbors.forEach((n) => inbound.set(n, (inbound.get(n) ?? 0) + 1));
    }
    expect(Array.from(inbound.values())).toEqual(Array(10).fill(4));
  });

  it("jeu de 10 fiches : graphe fortement connexe (toute fiche atteint toutes les autres)", () => {
    const items = ids(10);
    const edges = new Map(items.map((id) => [id, ringNeighbors(items, (x) => x === id)]));
    for (const start of items) {
      const seen = new Set([start]);
      const queue = [start];
      while (queue.length) {
        for (const next of edges.get(queue.shift()!) ?? []) {
          if (!seen.has(next)) {
            seen.add(next);
            queue.push(next);
          }
        }
      }
      expect(seen.size).toBe(10);
    }
  });

  it("ordre i+1, i+2, i-1, i-2 modulo n", () => {
    const items = ids(10);
    expect(ringNeighbors(items, (x) => x === "f0")).toEqual(["f1", "f2", "f9", "f8"]);
    expect(ringNeighbors(items, (x) => x === "f9")).toEqual(["f0", "f1", "f8", "f7"]);
    expect(ringNeighbors(ids(5), (x) => x === "f2")).toEqual(["f3", "f4", "f1", "f0"]);
  });

  it("catégorie de moins de 5 fiches : toutes les autres", () => {
    expect(ringNeighbors(ids(4), (x) => x === "f1")).toEqual(["f0", "f2", "f3"]);
    expect(ringNeighbors(ids(1), (x) => x === "f0")).toEqual([]);
  });

  it("fiche absente de la liste (cache plus ancien) : les 4 premières", () => {
    expect(ringNeighbors(ids(10), (x) => x === "nouvelle")).toEqual(["f0", "f1", "f2", "f3"]);
  });
});

describe("getRelated* : ordre des listes et dédoublonnage", () => {
  beforeEach(() => {
    mockJokeFindMany.mockReset();
    mockTipFindMany.mockReset();
    mockVideoFindMany.mockReset();
  });

  it("vannes : copies de contenu affichées une seule fois, jamais une copie de la vanne courante", async () => {
    // Ordre des listes (createdAt desc, id asc) ; j1b copie de j1, j3b copie de la courante j3.
    mockJokeFindMany.mockResolvedValue([
      { id: "j1", content: "Vanne un", category: "BOULOT" },
      { id: "j1b", content: "vanne  UN", category: "BOULOT" },
      { id: "j2", content: "Vanne deux", category: "BOULOT" },
      { id: "j3b", content: "Vanne trois", category: "BOULOT" },
      { id: "j3", content: "Vanne trois", category: "BOULOT" },
      { id: "j4", content: "Vanne quatre", category: "BOULOT" },
      { id: "j5", content: "Vanne cinq", category: "BOULOT" },
      { id: "j6", content: "Vanne six", category: "BOULOT" },
    ]);
    const related = await getRelatedJokes({ id: "j3", content: "Vanne trois", category: "BOULOT" });
    expect(mockJokeFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: true, category: "BOULOT" },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      }),
    );
    // Liste dédoublonnée : j1, j2, j3b(=courante), j4, j5, j6 → i = 2.
    expect(related.map((r) => r.id)).toEqual(["j4", "j5", "j2", "j1"]);
    const contents = related.map((r) => r.content.toLowerCase().replace(/\s+/g, " "));
    expect(new Set(contents).size).toBe(related.length);
  });

  it("conseils : dédoublonnés par titre, jamais le conseil courant", async () => {
    mockTipFindMany.mockResolvedValue([
      { id: "t1", title: "Titre A", category: "REPARTIE" },
      { id: "t2", title: "Titre B", category: "REPARTIE" },
      { id: "t2b", title: "titre b", category: "REPARTIE" },
      { id: "t3", title: "Titre C", category: "REPARTIE" },
    ]);
    const related = await getRelatedTips({ id: "t1", title: "Titre A", category: "REPARTIE" });
    expect(related.map((r) => r.id)).toEqual(["t2", "t3"]);
  });

  it("vidéos : anneau dans l'ordre des listes, jamais la vidéo courante", async () => {
    mockVideoFindMany.mockResolvedValue(
      ids(6).map((id) => ({ id, title: id, channelName: "Chaîne", youtubeId: `yt-${id}` })),
    );
    const related = await getRelatedVideos({ id: "f5", youtubeId: "yt-f5", category: "CONFIANCE" });
    expect(related.map((r) => r.id)).toEqual(["f0", "f1", "f4", "f3"]);
    expect(mockVideoFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ createdAt: "desc" }, { id: "asc" }] }),
    );
  });

  it("erreur base : l'exception remonte (la fiche l'attrape et s'affiche sans bloc)", async () => {
    mockJokeFindMany.mockRejectedValue(new Error("DB indisponible"));
    await expect(getRelatedJokes({ id: "j1", content: "x", category: "BOULOT" })).rejects.toThrow("DB indisponible");
  });
});
