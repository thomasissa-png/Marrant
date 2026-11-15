/**
 * Décision de Thomas du 14/11 (espace ouvert seulement) : les 10 vannes gratuites réparties sur au moins 5 catégories
 * de la rangée de /vannes, par une règle dans le code (`selectionGratuite`), sans vanne inventée ni écriture en base.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { CATEGORIES_VANNES, groupeDeCategorie, selectionGratuite } from "@/config/vannes-categories";
import { FREE_JOKE_LIMIT } from "@/config/premium";

const RACINE = join(__dirname, "../../../../..");
type Vanne = { id: string; category: string };

// Le vrai catalogue de départ (seed de la base jetable e2e et de la préversion), dans les deux ordres possibles.
const seed = (JSON.parse(readFileSync(join(RACINE, "docs/content/blagues-seed.json"), "utf8")) as { category: string }[]).map(
  (v, i): Vanne => ({ id: `seed-${i}`, category: v.category }),
);
// Permutation déterministe (pas de hasard dans un test) : rang i*p mod n, p premier avec n.
const melange = (liste: readonly Vanne[], p: number) => liste.map((_, i) => liste[(i * p) % liste.length]);
const groupes = (liste: readonly Vanne[]) => new Set(liste.map((v) => groupeDeCategorie(v.category)));

describe("vannes gratuites réparties (espace ouvert)", () => {
  it("rangée inchangée : « Toutes » d'abord, puis les 10 groupes d'avant s25, mêmes libellés", () => {
    expect(CATEGORIES_VANNES.map((c) => c.label)).toEqual([
      "Toutes", "Vie quotidienne", "Boulot & Collègues", "Couple & Dating", "Soirées & Apéro", "École & Études", "Famille",
      "Digital & Gaming", "Autodérision", "Absurde", "Jeux de mots",
    ]);
    expect(CATEGORIES_VANNES[0].value).toBe("");
  });

  it("chaque catégorie de la base (enum Prisma) appartient à exactement un groupe de la rangée", () => {
    const schema = readFileSync(join(RACINE, "apps/web/prisma/schema.prisma"), "utf8");
    const bloc = /enum JokeCategory \{([^}]*)\}/.exec(schema)?.[1] ?? "";
    const enumeres = bloc.split(/\s+/).filter(Boolean);
    expect(enumeres.length).toBeGreaterThan(0);
    const dansRangee = CATEGORIES_VANNES.flatMap((c) => (c.value ? c.value.split(",") : []));
    expect([...dansRangee].sort()).toEqual([...enumeres].sort());
  });

  it.each([
    ["seed, ordre du fichier", seed],
    ["seed, ordre inverse", [...seed].reverse()],
    ["seed, permutation 7", melange(seed, 7)],
    ["seed, permutation 13", melange(seed, 13)],
  ])("%s : 10 vannes du catalogue, au moins 5 groupes, une par groupe présent", (_nom, catalogue) => {
    const choisies = selectionGratuite(catalogue, FREE_JOKE_LIMIT);
    expect(FREE_JOKE_LIMIT).toBe(10);
    expect(choisies).toHaveLength(10);
    expect(choisies.every((v) => catalogue.includes(v))).toBe(true);
    expect(groupes(choisies).size).toBeGreaterThanOrEqual(5);
    // Le seed couvre les 10 groupes : une vanne par groupe, la plus récente de chacun (première rencontrée).
    expect(groupes(catalogue).size).toBe(10);
    expect(groupes(choisies).size).toBe(10);
    for (const v of choisies) expect(catalogue.find((c) => groupeDeCategorie(c.category) === groupeDeCategorie(v.category))).toBe(v);
  });

  it("ordre du catalogue gardé, résultat déterministe", () => {
    const catalogue = melange(seed, 7);
    const choisies = selectionGratuite(catalogue, 10);
    const rangs = choisies.map((v) => catalogue.indexOf(v));
    expect([...rangs].sort((a, b) => a - b)).toEqual(rangs);
    expect(selectionGratuite(catalogue, 10)).toEqual(choisies);
  });

  it("5 groupes seulement : 2 par groupe, à tour de rôle", () => {
    const cats = ["BOULOT", "DATING", "COUPLE", "SOIREES", "PARENTS", "ABSURDE"];
    const catalogue = Array.from({ length: 30 }, (_, i): Vanne => ({ id: `v${i}`, category: cats[i % cats.length] }));
    const choisies = selectionGratuite(catalogue, 10);
    expect(choisies).toHaveLength(10);
    const parGroupe = new Map<string, number>();
    for (const v of choisies) parGroupe.set(groupeDeCategorie(v.category), (parGroupe.get(groupeDeCategorie(v.category)) ?? 0) + 1);
    expect([...parGroupe.values()]).toEqual([2, 2, 2, 2, 2]);
  });

  it("une seule catégorie : ses 10 plus récentes ; catalogue court : tout le catalogue", () => {
    const seul = Array.from({ length: 15 }, (_, i): Vanne => ({ id: `b${i}`, category: "BOULOT" }));
    expect(selectionGratuite(seul, 10)).toEqual(seul.slice(0, 10));
    expect(selectionGratuite(seed.slice(0, 4), 10)).toEqual(seed.slice(0, 4));
    expect(selectionGratuite([], 10)).toEqual([]);
  });
});
