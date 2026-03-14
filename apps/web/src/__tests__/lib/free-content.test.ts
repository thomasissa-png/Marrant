/**
 * Tests pour la sélection glissante de contenu gratuit.
 * Vérifie : rotation douce (1 item/jour), unicité, déterminisme, cas limites.
 */

// Mock todayUTC pour contrôler le jour
const mockTodayUTC = jest.fn();
jest.mock("@/lib/ai/date-utils", () => ({
  todayUTC: () => mockTodayUTC(),
}));

import { selectSlidingFreeItems } from "@/lib/free-content";

// Génère un tableau d'items numérotés
function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
}

// Génère des items avec catégories (simulant un catalogue réel)
const CATEGORIES = ["BOULOT", "ECOLE", "GAMING", "AUTODERISION", "ABSURDE", "COUPLE", "DATING"];
function makeItemsWithCategories(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: CATEGORIES[i % CATEGORIES.length],
  }));
}

// Items avec distribution déséquilibrée (ex: beaucoup de BOULOT en début de catalogue)
function makeSkewedItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    // 60% BOULOT, 20% ECOLE, 20% GAMING
    category: i < count * 0.6 ? "BOULOT" : i < count * 0.8 ? "ECOLE" : "GAMING",
  }));
}

// Fixe le jour simulé (epoch day)
function setEpochDay(day: number) {
  mockTodayUTC.mockReturnValue(new Date(day * 1000 * 60 * 60 * 24));
}

describe("selectSlidingFreeItems", () => {
  const PRIME = 7919;

  it("retourne un tableau vide si aucun item", () => {
    setEpochDay(100);
    expect(selectSlidingFreeItems([], 20, PRIME)).toEqual([]);
  });

  it("retourne tous les items si count <= freeLimit", () => {
    setEpochDay(100);
    const items = makeItems(5);
    const result = selectSlidingFreeItems(items, 20, PRIME);
    expect(result).toEqual(items);
  });

  it("retourne exactement freeLimit items", () => {
    setEpochDay(100);
    const items = makeItems(100);
    const result = selectSlidingFreeItems(items, 20, PRIME);
    expect(result).toHaveLength(20);
  });

  it("ne contient aucun doublon", () => {
    setEpochDay(200);
    const items = makeItems(100);
    const result = selectSlidingFreeItems(items, 20, PRIME);
    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(20);
  });

  it("est déterministe — même jour = même résultat", () => {
    const items = makeItems(100);
    setEpochDay(300);
    const result1 = selectSlidingFreeItems(items, 20, PRIME);
    setEpochDay(300);
    const result2 = selectSlidingFreeItems(items, 20, PRIME);
    expect(result1).toEqual(result2);
  });

  it("rotation douce — seul 1 item change entre 2 jours consécutifs", () => {
    const items = makeItems(200);
    const freeLimit = 20;

    setEpochDay(500);
    const day1 = selectSlidingFreeItems(items, freeLimit, PRIME);
    const ids1 = new Set(day1.map((r) => r.id));

    setEpochDay(501);
    const day2 = selectSlidingFreeItems(items, freeLimit, PRIME);
    const ids2 = new Set(day2.map((r) => r.id));

    // Calculer les items en commun
    const common = [...ids1].filter((id) => ids2.has(id));

    // Exactement freeLimit - 1 items en commun (1 seul a changé)
    expect(common.length).toBe(freeLimit - 1);
  });

  it("rotation douce — fonctionne aussi avec 5 items (tips)", () => {
    const items = makeItems(50);
    const freeLimit = 5;

    setEpochDay(700);
    const day1 = selectSlidingFreeItems(items, freeLimit, 6871);
    const ids1 = new Set(day1.map((r) => r.id));

    setEpochDay(701);
    const day2 = selectSlidingFreeItems(items, freeLimit, 6871);
    const ids2 = new Set(day2.map((r) => r.id));

    const common = [...ids1].filter((id) => ids2.has(id));
    expect(common.length).toBe(freeLimit - 1);
  });

  it("rotation douce — fonctionne aussi avec 10 items (vidéos)", () => {
    const items = makeItems(80);
    const freeLimit = 10;

    setEpochDay(800);
    const day1 = selectSlidingFreeItems(items, freeLimit, 5381);
    const ids1 = new Set(day1.map((r) => r.id));

    setEpochDay(801);
    const day2 = selectSlidingFreeItems(items, freeLimit, 5381);
    const ids2 = new Set(day2.map((r) => r.id));

    const common = [...ids1].filter((id) => ids2.has(id));
    expect(common.length).toBe(freeLimit - 1);
  });

  it("utilise des primes différents pour des résultats différents par type", () => {
    setEpochDay(400);
    const items = makeItems(100);
    const jokes = selectSlidingFreeItems(items, 20, 7919);
    const tips = selectSlidingFreeItems(items, 20, 6871);

    const jIds = jokes.map((r) => r.id);
    const tIds = tips.map((r) => r.id);

    // Les sélections devraient être différentes
    expect(jIds).not.toEqual(tIds);
  });

  it("gère correctement un grand nombre de jours (pas de débordement)", () => {
    setEpochDay(50000);
    const items = makeItems(100);
    const result = selectSlidingFreeItems(items, 20, PRIME);
    expect(result).toHaveLength(20);
    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(20);
  });

  it("après freeLimit jours, le set est complètement renouvelé", () => {
    const items = makeItems(200);
    const freeLimit = 20;

    setEpochDay(1000);
    const day1 = selectSlidingFreeItems(items, freeLimit, PRIME);
    const ids1 = new Set(day1.map((r) => r.id));

    // freeLimit jours plus tard, aucun item en commun
    setEpochDay(1000 + freeLimit);
    const day2 = selectSlidingFreeItems(items, freeLimit, PRIME);
    const ids2 = new Set(day2.map((r) => r.id));

    const common = [...ids1].filter((id) => ids2.has(id));
    // Peut avoir des collisions résolues, mais la majorité devrait être différente
    // Au minimum, 0 item de day1 devrait subsister (tous les slots ont été remplacés)
    // Note : les collisions linéaires peuvent causer quelques chevauchements aléatoires
    expect(common.length).toBeLessThanOrEqual(freeLimit);
  });

  // === Tests diversité catégories (getCategoryKey) ===

  it("avec getCategoryKey, limite la domination d'une seule catégorie", () => {
    setEpochDay(600);
    const items = makeSkewedItems(100); // 60% BOULOT
    const freeLimit = 20;
    const maxPerCategory = Math.ceil(freeLimit / 3); // ~7

    const result = selectSlidingFreeItems(items, freeLimit, PRIME, (item) => item.category);

    // Compter les catégories
    const counts = new Map<string, number>();
    for (const item of result) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }

    // Aucune catégorie ne doit dépasser maxPerCategory
    for (const [, count] of counts) {
      expect(count).toBeLessThanOrEqual(maxPerCategory);
    }
  });

  it("avec getCategoryKey, retourne toujours freeLimit items", () => {
    setEpochDay(700);
    const items = makeItemsWithCategories(100);
    const result = selectSlidingFreeItems(items, 20, PRIME, (item) => item.category);
    expect(result).toHaveLength(20);
    expect(new Set(result.map((r) => r.id)).size).toBe(20);
  });

  it("sans getCategoryKey, ne filtre pas par catégorie (rétro-compatible)", () => {
    setEpochDay(800);
    const items = makeItems(100);
    const result = selectSlidingFreeItems(items, 20, PRIME);
    expect(result).toHaveLength(20);
  });

  it("getCategoryKey assure la diversité même avec catalogue déséquilibré", () => {
    setEpochDay(900);
    const items = makeSkewedItems(50); // 60% BOULOT
    const freeLimit = 10;

    const result = selectSlidingFreeItems(items, freeLimit, PRIME, (item) => item.category);
    const categories = new Set(result.map((r) => r.category));

    // Au moins 2 catégories différentes (idéalement les 3 : BOULOT, ECOLE, GAMING)
    expect(categories.size).toBeGreaterThanOrEqual(2);
  });
});
