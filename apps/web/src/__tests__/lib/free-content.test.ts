/**
 * Tests pour la sélection glissante de contenu gratuit.
 * Vérifie : fenêtre circulaire (1 item/jour), unicité, déterminisme,
 * insertDailyFirst, cas limites.
 */

// Mock todayUTC pour contrôler le jour
const mockTodayUTC = jest.fn();
jest.mock("@/lib/ai/date-utils", () => ({
  todayUTC: () => mockTodayUTC(),
}));

import { selectSlidingFreeItems, insertDailyFirst } from "@/lib/free-content";

// Génère un tableau d'items numérotés
function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({ id: `id-${i + 1}`, name: `Item ${i + 1}` }));
}

// Fixe le jour simulé (epoch day)
function setEpochDay(day: number) {
  mockTodayUTC.mockReturnValue(new Date(day * 1000 * 60 * 60 * 24));
}

describe("selectSlidingFreeItems", () => {
  it("retourne un tableau vide si aucun item", () => {
    setEpochDay(100);
    expect(selectSlidingFreeItems([], 20)).toEqual([]);
  });

  it("retourne tous les items si count <= freeLimit", () => {
    setEpochDay(100);
    const items = makeItems(5);
    const result = selectSlidingFreeItems(items, 20);
    expect(result).toEqual(items);
  });

  it("retourne exactement freeLimit items", () => {
    setEpochDay(100);
    const items = makeItems(100);
    const result = selectSlidingFreeItems(items, 20);
    expect(result).toHaveLength(20);
  });

  it("ne contient aucun doublon", () => {
    setEpochDay(200);
    const items = makeItems(100);
    const result = selectSlidingFreeItems(items, 20);
    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(20);
  });

  it("est déterministe — même jour = même résultat", () => {
    const items = makeItems(100);
    setEpochDay(300);
    const result1 = selectSlidingFreeItems(items, 20);
    setEpochDay(300);
    const result2 = selectSlidingFreeItems(items, 20);
    expect(result1).toEqual(result2);
  });

  it("rotation douce — exactement 1 item change entre 2 jours consécutifs", () => {
    const items = makeItems(200);
    const freeLimit = 20;

    setEpochDay(500);
    const day1 = selectSlidingFreeItems(items, freeLimit);
    const ids1 = new Set(day1.map((r) => r.id));

    setEpochDay(501);
    const day2 = selectSlidingFreeItems(items, freeLimit);
    const ids2 = new Set(day2.map((r) => r.id));

    const common = [...ids1].filter((id) => ids2.has(id));
    expect(common.length).toBe(freeLimit - 1);
  });

  it("rotation douce — fonctionne avec 5 items (tips)", () => {
    const items = makeItems(50);
    const freeLimit = 5;

    setEpochDay(700);
    const day1 = selectSlidingFreeItems(items, freeLimit);
    const ids1 = new Set(day1.map((r) => r.id));

    setEpochDay(701);
    const day2 = selectSlidingFreeItems(items, freeLimit);
    const ids2 = new Set(day2.map((r) => r.id));

    const common = [...ids1].filter((id) => ids2.has(id));
    expect(common.length).toBe(freeLimit - 1);
  });

  it("rotation douce — fonctionne avec 10 items (vidéos)", () => {
    const items = makeItems(80);
    const freeLimit = 10;

    setEpochDay(800);
    const day1 = selectSlidingFreeItems(items, freeLimit);
    const ids1 = new Set(day1.map((r) => r.id));

    setEpochDay(801);
    const day2 = selectSlidingFreeItems(items, freeLimit);
    const ids2 = new Set(day2.map((r) => r.id));

    const common = [...ids1].filter((id) => ids2.has(id));
    expect(common.length).toBe(freeLimit - 1);
  });

  it("gère correctement un grand nombre de jours (pas de débordement)", () => {
    setEpochDay(50000);
    const items = makeItems(100);
    const result = selectSlidingFreeItems(items, 20);
    expect(result).toHaveLength(20);
    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(20);
  });

  it("après freeLimit jours, le set est complètement renouvelé", () => {
    const items = makeItems(200);
    const freeLimit = 20;

    setEpochDay(1000);
    const day1 = selectSlidingFreeItems(items, freeLimit);
    const ids1 = new Set(day1.map((r) => r.id));

    // freeLimit jours plus tard, aucun item en commun
    setEpochDay(1000 + freeLimit);
    const day2 = selectSlidingFreeItems(items, freeLimit);
    const ids2 = new Set(day2.map((r) => r.id));

    const common = [...ids1].filter((id) => ids2.has(id));
    expect(common.length).toBe(0);
  });
});

describe("insertDailyFirst", () => {
  it("retourne la liste telle quelle si dailyItemId est null", () => {
    const items = makeItems(5);
    const result = insertDailyFirst(items, null, (i) => i.id, 5);
    expect(result).toEqual(items);
  });

  it("retourne la liste telle quelle si items est vide", () => {
    const result = insertDailyFirst([], "id-1", (i: { id: string }) => i.id, 5);
    expect(result).toEqual([]);
  });

  it("ne change rien si le daily est déjà en première position", () => {
    const items = makeItems(5);
    const result = insertDailyFirst(items, "id-1", (i) => i.id, 5);
    expect(result[0].id).toBe("id-1");
    expect(result).toHaveLength(5);
  });

  it("déplace le daily en première position s'il est dans la liste", () => {
    const items = makeItems(5);
    const result = insertDailyFirst(items, "id-3", (i) => i.id, 5);
    expect(result[0].id).toBe("id-3");
    expect(result).toHaveLength(5);
    // L'ancien premier est maintenant en position 1
    expect(result[1].id).toBe("id-1");
  });

  it("respecte freeLimit après déplacement", () => {
    const items = makeItems(10);
    const result = insertDailyFirst(items, "id-5", (i) => i.id, 10);
    expect(result).toHaveLength(10);
    expect(result[0].id).toBe("id-5");
  });

  it("ne modifie pas la liste si le daily n'est pas dedans", () => {
    const items = makeItems(5);
    const result = insertDailyFirst(items, "id-999", (i) => i.id, 5);
    expect(result).toEqual(items);
  });
});
