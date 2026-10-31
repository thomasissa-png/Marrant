/**
 * @jest-environment node
 */
/**
 * s23 (31/10/2026) : repli des voisins en anneau des conseils. Une catégorie de
 * moins de 2 conseils actifs (JEUX_DE_MOTS : « Le double sens en conversation »
 * seul) prend les voisins de sa catégorie proche (REPARTIE), et la première fiche
 * de REPARTIE la lie en retour. Toutes les autres fiches restent inchangées.
 */
import { ringNeighbors, TIP_FALLBACK_CATEGORY, withFallbackGuests } from "@/lib/related-ring";

const mockTipFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: jest.fn() },
    tip: { findMany: (args: unknown) => mockTipFindMany(args) },
    video: { findMany: jest.fn() },
  },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: <T,>(fn: () => Promise<T>) => fn() }));

import { getRelatedTips, type RelatedTip } from "@/lib/related-catalogue";

type Base = Record<string, RelatedTip[]>;
const cat = (category: string, prefix: string, n: number): RelatedTip[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${prefix}${i}`, title: `Titre ${prefix}${i}`, category }));
const DOUBLE_SENS: RelatedTip = { id: "ds", title: "Le double sens en conversation", category: "JEUX_DE_MOTS" };

function useBase(base: Base) {
  mockTipFindMany.mockImplementation(({ where }: { where: { category: string } }) =>
    Promise.resolve(base[where.category] ?? []),
  );
}
const queried = () => mockTipFindMany.mock.calls.map(([args]) => (args as { where: { category: string } }).where.category);
const ids = (tips: RelatedTip[]) => tips.map((t) => t.id);
// Anneau s20 sans repli : la référence « avant ».
const before = (list: RelatedTip[], tip: RelatedTip) => ids(ringNeighbors(list, (t) => t.id === tip.id));

const PROD_LIKE: Base = {
  JEUX_DE_MOTS: [DOUBLE_SENS],
  REPARTIE: cat("REPARTIE", "r", 28),
  ABSURDE: cat("ABSURDE", "a", 20),
  TIMING: cat("TIMING", "t", 14),
};

beforeEach(() => mockTipFindMany.mockReset());

describe("table de proximité", () => {
  it("JEUX_DE_MOTS se replie sur REPARTIE, aucune autre catégorie", () => {
    expect(TIP_FALLBACK_CATEGORY).toEqual({ JEUX_DE_MOTS: "REPARTIE" });
  });
});

describe("catégorie isolée", () => {
  it("la fiche seule de sa catégorie affiche les 4 premières fiches de REPARTIE", async () => {
    useBase(PROD_LIKE);
    const related = await getRelatedTips(DOUBLE_SENS);
    expect(ids(related)).toEqual(["r0", "r1", "r2", "r3"]);
    expect(queried()).toEqual(["JEUX_DE_MOTS", "REPARTIE"]);
  });

  it("jamais la fiche courante, même si une copie de même titre est en REPARTIE", async () => {
    useBase({ ...PROD_LIKE, REPARTIE: [{ ...DOUBLE_SENS, id: "copie", category: "REPARTIE" }, ...cat("REPARTIE", "r", 5)] });
    const related = ids(await getRelatedTips(DOUBLE_SENS));
    expect(related).toHaveLength(4);
    expect(related).not.toContain("copie");
    expect(related).not.toContain("ds");
  });

  it("catégorie isolée sans table de repli : comportement s20 (aucun voisin)", async () => {
    useBase({ TIMING: [{ id: "t0", title: "Seul", category: "TIMING" }], REPARTIE: cat("REPARTIE", "r", 5) });
    expect(await getRelatedTips({ id: "t0", title: "Seul", category: "TIMING" })).toEqual([]);
    expect(queried()).toEqual(["TIMING"]);
  });
});

describe("réciprocité", () => {
  it("la première fiche de REPARTIE lie la fiche isolée en dernière place, ses 3 premiers voisins inchangés", async () => {
    useBase(PROD_LIKE);
    const r0 = PROD_LIKE.REPARTIE[0];
    const related = await getRelatedTips(r0);
    expect(before(PROD_LIKE.REPARTIE, r0)).toEqual(["r1", "r2", "r27", "r26"]);
    expect(ids(related)).toEqual(["r1", "r2", "r27", "ds"]);
  });

  it("graphe complet : la fiche isolée a 4 liens sortants et au moins 1 entrant", async () => {
    useBase(PROD_LIKE);
    const all = Object.values(PROD_LIKE).flat();
    const inbound = new Map(all.map((t) => [t.id, 0]));
    for (const tip of all) for (const r of await getRelatedTips(tip)) inbound.set(r.id, (inbound.get(r.id) ?? 0) + 1);
    expect(ids(await getRelatedTips(DOUBLE_SENS))).toHaveLength(4);
    expect(inbound.get("ds")).toBe(1);
    // r26 (i-2 de r0) perd un lien entrant : 3 au lieu de 4 ; r0 en gagne un (la fiche isolée).
    expect(inbound.get("r26")).toBe(3);
    expect(inbound.get("r0")).toBe(5);
  });

  it("catégorie proche de moins de 5 fiches : la fiche isolée s'ajoute sans rien retirer", () => {
    expect(withFallbackGuests(["b", "c"], ["x"], (a, b) => a === b)).toEqual(["b", "c", "x"]);
    expect(withFallbackGuests(["b", "c", "d", "e"], ["b"], (a, b) => a === b)).toEqual(["b", "c", "d", "e"]);
  });
});

describe("catégories normales inchangées", () => {
  it("seules la fiche isolée et la première fiche de REPARTIE changent", async () => {
    useBase(PROD_LIKE);
    const changed: string[] = [];
    for (const [category, list] of Object.entries(PROD_LIKE)) {
      for (const tip of list) {
        const now = ids(await getRelatedTips(tip));
        if (JSON.stringify(now) !== JSON.stringify(before(list, tip))) changed.push(`${category}:${tip.id}`);
      }
    }
    expect(changed).toEqual(["JEUX_DE_MOTS:ds", "REPARTIE:r0"]);
  });

  it("aucune requête de plus hors de la première fiche de REPARTIE", async () => {
    useBase(PROD_LIKE);
    await getRelatedTips(PROD_LIKE.REPARTIE[5]);
    await getRelatedTips(PROD_LIKE.ABSURDE[0]);
    expect(queried()).toEqual(["REPARTIE", "ABSURDE"]);
  });

  it("JEUX_DE_MOTS revenu à 2 conseils actifs : anneau normal, REPARTIE sans invité", async () => {
    useBase({ ...PROD_LIKE, JEUX_DE_MOTS: [DOUBLE_SENS, { id: "j1", title: "Autre", category: "JEUX_DE_MOTS" }] });
    const repartie = PROD_LIKE.REPARTIE;
    expect(ids(await getRelatedTips(DOUBLE_SENS))).toEqual(["j1"]);
    expect(ids(await getRelatedTips(repartie[0]))).toEqual(before(repartie, repartie[0]));
  });
});
