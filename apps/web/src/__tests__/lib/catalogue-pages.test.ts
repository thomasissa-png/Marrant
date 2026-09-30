/**
 * Lot S1 s14 (P0-1) : listes catalogue rendues côté serveur, pagination crawlable.
 */
import { listCanonical, listPageHref, parsePageParam, withPageParam } from "@/lib/list-pagination";

const jokeFindMany = jest.fn();
const tipFindMany = jest.fn();
const videoFindMany = jest.fn();
const videoCount = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: (...a: unknown[]) => jokeFindMany(...a) },
    tip: { findMany: (...a: unknown[]) => tipFindMany(...a) },
    video: { findMany: (...a: unknown[]) => videoFindMany(...a), count: (...a: unknown[]) => videoCount(...a) },
  },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));

// Importé après les jest.mock (hissés par babel/ts-jest au-dessus des imports).
import * as pages from "@/lib/catalogue-pages";

function joke(id: string, content: string) {
  return {
    id,
    content,
    punchline: `chute ${id}`,
    category: "BOULOT",
    type: "CLASSIQUE",
    maturityLevel: 1,
    comedyTechnique: null,
    techniqueExplanation: null,
  };
}

describe("list-pagination", () => {
  it("parsePageParam : entier >= 1, sinon 1", () => {
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("3")).toBe(3);
    expect(parsePageParam(["4", "5"])).toBe(4);
    for (const bad of ["0", "-2", "2.5", "abc", "", "1e3", "999999"]) expect(parsePageParam(bad)).toBe(1);
  });

  it("page 1 = URL sans paramètre, canonical absolu auto-référent", () => {
    expect(listPageHref("/vannes", 1)).toBe("/vannes");
    expect(listPageHref("/vannes", 2)).toBe("/vannes?page=2");
    expect(listCanonical("/conseils", 1)).toBe("https://deviens-marrant.fr/conseils");
    expect(listCanonical("/conseils", 7)).toBe("https://deviens-marrant.fr/conseils?page=7");
  });

  it("withPageParam garde les autres paramètres (q)", () => {
    expect(withPageParam("/vannes", "?q=chat", 3)).toBe("/vannes?q=chat&page=3");
    expect(withPageParam("/vannes", "?q=chat&page=3", 1)).toBe("/vannes?q=chat");
    expect(withPageParam("/vannes", "?page=2", 1)).toBe("/vannes");
  });
});

describe("catalogue-pages", () => {
  beforeEach(() => jest.clearAllMocks());

  it("vannes : actives, dédoublonnées (jokes-dedupe), 12 par page, howToApply retiré", async () => {
    const candidates = Array.from({ length: 30 }, (_, i) => ({
      id: `j${i}`,
      // j1 et j2 sont des copies de j0 (casse et espaces différents)
      content: i <= 2 ? ["Même  vanne", "même vanne", "MÊME VANNE "][i] : `Vanne ${i}`,
    }));
    jokeFindMany.mockImplementation(({ where }: { where: { id?: { in: string[] } } }) =>
      where.id ? where.id.in.map((id) => joke(id, `contenu ${id}`)) : candidates,
    );

    const p1 = await pages.getJokesPage(1);
    expect(jokeFindMany.mock.calls[0][0].where).toEqual({ isActive: true });
    expect(p1?.total).toBe(28);
    expect(p1?.totalPages).toBe(3);
    expect(p1?.items.map((j) => j.id)).toEqual(["j0", ...Array.from({ length: 11 }, (_, i) => `j${i + 3}`)]);
    expect(p1?.items[0].howToApply).toBeNull();

    const p3 = await pages.getJokesPage(3);
    expect(p3?.items).toHaveLength(4);
  });

  it("conseils : dédoublonnés par titre, 10 par page, exercice (réservé membres) vidé", async () => {
    const candidates = [
      { id: "t1", title: "Le timing" },
      { id: "t2", title: "le  TIMING" },
      { id: "t3", title: "La répartie" },
    ];
    tipFindMany.mockImplementation(({ where }: { where: { id?: { in: string[] } } }) =>
      where.id
        ? where.id.in.map((id) => ({ id, title: id, content: "c", category: "TIMING", difficulty: "DEBUTANT", example: "e" }))
        : candidates,
    );
    const p1 = await pages.getTipsPage(1);
    expect(p1?.items.map((t) => t.id)).toEqual(["t1", "t3"]);
    expect(p1?.items.every((t) => t.exercise === "")).toBe(true);
    expect(p1?.limit).toBe(10);
  });

  it("vidéos : 12 par page, learnings et exercice vidés, page hors limite sans requête", async () => {
    videoCount.mockResolvedValue(13);
    videoFindMany.mockResolvedValue([{ id: "v1", title: "T", category: "TIMING", difficulty: "EXPERT" }]);
    const p2 = await pages.getVideosPage(2);
    expect(videoFindMany.mock.calls[0][0]).toMatchObject({ where: { isActive: true }, skip: 12, take: 12 });
    expect(p2?.items[0]).toMatchObject({ learnings: [], exercise: null });
    videoFindMany.mockClear();
    const p9 = await pages.getVideosPage(9);
    expect(p9?.items).toEqual([]);
    expect(videoFindMany).not.toHaveBeenCalled();
  });

  it("base indisponible : null (repli sur le chargement client), sans exception", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    jokeFindMany.mockRejectedValue(new Error("Can't reach database server"));
    await expect(pages.getJokesPage(1)).resolves.toBeNull();
    spy.mockRestore();
  });

  it("accueil : 2 fiches par carte, libellés sans tiret cadratin", async () => {
    jokeFindMany.mockImplementation(({ where }: { where: { id?: { in: string[] } } }) =>
      where.id ? where.id.in.map((id) => joke(id, `Setup ${id} — suite`)) : [{ id: "ja", content: "a" }, { id: "jb", content: "b" }, { id: "jc", content: "c" }],
    );
    tipFindMany.mockResolvedValue([]);
    videoCount.mockResolvedValue(0);
    const [jokes, tips, videos] = await pages.getHomeFeatureExamples();
    expect(jokes).toHaveLength(2);
    expect(jokes[0].href).toMatch(/^\/vannes\/.+/);
    expect(jokes.every((j) => !j.label.includes("—"))).toBe(true);
    expect(tips).toEqual([]);
    expect(videos).toEqual([]);
  });
});
