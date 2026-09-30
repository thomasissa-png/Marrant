/**
 * Lot S2 (s14) : des centaines de vannes vont être désactivées (isActive=false,
 * soft delete) et la relecture automatique peut retirer des conseils.
 * Attendu sur /vannes/[slug], /conseils/[slug], /videos/[slug] :
 *   - fiche existante mais inactive → permanentRedirect vers la liste (308) ;
 *   - slug inexistant → notFound() (404) comme avant ;
 *   - fiche active → affichée (metadata normales).
 * Les candidats partagent parfois leur préfixe d'id (seed en rafale) : l'URL
 * d'une fiche retirée ne doit JAMAIS servir une autre fiche active.
 */
import { buildCatalogueSlug, isNonCanonicalSlug, resolveBySlug } from "@/lib/catalogue-slug";

const findMany = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: (...a: unknown[]) => findMany(...a) },
    tip: { findMany: (...a: unknown[]) => findMany(...a) },
    video: { findMany: (...a: unknown[]) => findMany(...a) },
  },
}));

jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));

const notFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
const permanentRedirect = jest.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
jest.mock("next/navigation", () => ({
  notFound: () => notFound(),
  permanentRedirect: (url: string) => permanentRedirect(url),
}));

const SHORT_ID = "cmabcdefgh";
const RETIRED_ID = `${SHORT_ID}retired000001`;
const SIBLING_ID = `${SHORT_ID}sibling000002`;

/** Contenu générique compatible vanne / conseil / vidéo. */
function item(id: string, text: string, isActive: boolean) {
  return {
    id,
    isActive,
    content: text,
    title: text,
    punchline: "La chute.",
    category: "ABSURDE",
    type: "ONE_LINER",
    difficulty: "BEGINNER",
    channelName: "Chaîne",
    youtubeId: "abc",
    description: text,
    updatedAt: new Date("2026-09-01"),
    createdAt: new Date("2026-09-01"),
  };
}

const PAGES = [
  ["vannes", "@/app/(dashboard)/vannes/[slug]/page"],
  ["conseils", "@/app/(dashboard)/conseils/[slug]/page"],
  ["videos", "@/app/(dashboard)/videos/[slug]/page"],
] as const;

describe("fiches catalogue retirées → redirection permanente", () => {
  beforeEach(() => {
    findMany.mockReset();
    notFound.mockClear();
    permanentRedirect.mockClear();
  });

  it.each(PAGES)("/%s/[slug] : fiche inactive → permanentRedirect vers la liste", async (list, mod) => {
    findMany.mockResolvedValue([item(RETIRED_ID, "Une fiche retirée", false)]);
    const page = require(mod);
    const params = { slug: buildCatalogueSlug("Une fiche retirée", RETIRED_ID) };
    await expect(page.default({ params })).rejects.toThrow(`NEXT_REDIRECT:/${list}`);
    expect(permanentRedirect).toHaveBeenCalledWith(`/${list}`);
    expect(notFound).not.toHaveBeenCalled();
  });

  it.each(PAGES)("/%s/[slug] : la requête cherche aussi les fiches inactives", async (_list, mod) => {
    findMany.mockResolvedValue([item(RETIRED_ID, "Une fiche retirée", false)]);
    const page = require(mod);
    await page.default({ params: { slug: `une-fiche-retiree-${SHORT_ID}` } }).catch(() => undefined);
    const where = findMany.mock.calls[0][0].where;
    expect(where).toEqual({ id: { startsWith: SHORT_ID } });
  });

  it.each(PAGES)("/%s/[slug] : slug inexistant → notFound()", async (_list, mod) => {
    findMany.mockResolvedValue([]);
    const page = require(mod);
    await expect(page.default({ params: { slug: `inconnu-${SHORT_ID}` } })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(permanentRedirect).not.toHaveBeenCalled();
  });

  it.each(PAGES)("/%s/[slug] : slug sans shortId → notFound()", async (_list, mod) => {
    const page = require(mod);
    await expect(page.default({ params: { slug: "pas-d-id" } })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(findMany).not.toHaveBeenCalled();
  });

  it.each(PAGES)("/%s/[slug] : fiche retirée + voisine active de même préfixe → redirection, pas la voisine", async (list, mod) => {
    findMany.mockResolvedValue([
      item(SIBLING_ID, "Une autre fiche bien active", true),
      item(RETIRED_ID, "Une fiche retirée", false),
    ]);
    const page = require(mod);
    const params = { slug: buildCatalogueSlug("Une fiche retirée", RETIRED_ID) };
    await expect(page.default({ params })).rejects.toThrow(`NEXT_REDIRECT:/${list}`);
  });

  it.each(PAGES)("/%s/[slug] : metadata d'une fiche active inchangées (canonical)", async (list, mod) => {
    findMany.mockResolvedValue([item(SIBLING_ID, "Une fiche active", true)]);
    const page = require(mod);
    const slug = buildCatalogueSlug("Une fiche active", SIBLING_ID);
    const meta = await page.generateMetadata({ params: { slug } });
    expect(meta.alternates.canonical).toBe(`https://deviens-marrant.fr/${list}/${slug}`);
  });
});

describe("fiches catalogue actives → slug canonique (lot S3d)", () => {
  beforeEach(() => {
    findMany.mockReset();
    notFound.mockClear();
    permanentRedirect.mockClear();
  });

  it.each(PAGES)("/%s/[slug] : ancien slug (texte réécrit) → permanentRedirect vers le slug canonique", async (list, mod) => {
    findMany.mockResolvedValue([item(SIBLING_ID, "Le nouveau texte de la fiche", true)]);
    const page = require(mod);
    const oldSlug = buildCatalogueSlug("L'ancien texte de la fiche", SIBLING_ID);
    const canonical = buildCatalogueSlug("Le nouveau texte de la fiche", SIBLING_ID);
    await expect(page.default({ params: { slug: oldSlug } })).rejects.toThrow(`NEXT_REDIRECT:/${list}/${canonical}`);
    expect(permanentRedirect).toHaveBeenCalledWith(`/${list}/${canonical}`);
    expect(notFound).not.toHaveBeenCalled();
  });

  it.each(PAGES)("/%s/[slug] : shortId seul ou casse différente → slug canonique", async (list, mod) => {
    findMany.mockResolvedValue([item(SIBLING_ID, "Une fiche active", true)]);
    const page = require(mod);
    const canonical = buildCatalogueSlug("Une fiche active", SIBLING_ID);
    await expect(page.default({ params: { slug: SHORT_ID } })).rejects.toThrow(`NEXT_REDIRECT:/${list}/${canonical}`);
    await expect(page.default({ params: { slug: canonical.toUpperCase() } })).rejects.toThrow(
      `NEXT_REDIRECT:/${list}/${canonical}`,
    );
  });

  it.each(PAGES)("/%s/[slug] : slug canonique → pas de redirection (pas de boucle)", async (_list, mod) => {
    findMany.mockResolvedValue([item(SIBLING_ID, "Une fiche active", true)]);
    const page = require(mod);
    const canonical = buildCatalogueSlug("Une fiche active", SIBLING_ID);
    await page.default({ params: { slug: canonical } }).catch(() => undefined);
    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });
});

describe("isNonCanonicalSlug", () => {
  it("compare le slug demandé au slug canonique", () => {
    expect(isNonCanonicalSlug("une-vanne-cmabcdefgh", "une-vanne-cmabcdefgh")).toBe(false);
    expect(isNonCanonicalSlug("vieux-texte-cmabcdefgh", "une-vanne-cmabcdefgh")).toBe(true);
  });
});

describe("resolveBySlug", () => {
  const build = (c: { id: string; title: string }) => buildCatalogueSlug(c.title, c.id);

  it("missing si aucun candidat", () => {
    expect(resolveBySlug([], `x-${SHORT_ID}`, build)).toEqual({ status: "missing" });
  });

  it("inactive si la fiche visée est retirée", () => {
    const retired = { id: RETIRED_ID, title: "Retirée", isActive: false };
    expect(resolveBySlug([retired], build(retired), build)).toEqual({ status: "inactive" });
  });

  it("active avec la fiche visée parmi plusieurs candidats", () => {
    const a = { id: SIBLING_ID, title: "Active", isActive: true };
    const b = { id: RETIRED_ID, title: "Retirée", isActive: false };
    expect(resolveBySlug([b, a], build(a), build)).toEqual({ status: "active", item: a });
  });
});
