/**
 * @jest-environment node
 *
 * Décision de Thomas du 16/11 (s25), point 7, côté serveur : `/api/jokes` « Toutes » (aucun filtre de catégorie)
 * chez l'abonné, interrupteur ouvert : catégories mélangées par alternance entre les groupes de la rangée, sur la
 * liste entière avant la pagination (mêmes vannes, ordre seul changé). Filtre de catégorie, visiteur, compte gratuit
 * ou interrupteur fermé : ordre d'avant (plus récentes d'abord). Rendu : `__tests__/espace/decisions-thomas-16-11.test.tsx`.
 */
const etat = globalThis as { __D1611_API_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __D1611_API_OUVERT__?: boolean }).__D1611_API_OUVERT__ ?? false;
  },
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const userFindUnique = jest.fn();
const jokeFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    joke: { findMany: (...a: unknown[]) => jokeFindMany(...a) },
  },
}));

import { NextRequest } from "next/server";
import { GET as getJokes } from "@/app/api/jokes/route";
import { groupeDeCategorie } from "@/config/vannes-categories";

// Catalogue dans l'ordre de la liste : 12 BOULOT d'abord (les plus récentes), puis un de chacun de 4 autres groupes,
// puis 2 COUPLE. Avant la décision, la page 1 de l'abonné (12 vannes) était entièrement « Boulot & Collègues ».
const CATS = [...Array(12).fill("BOULOT"), "SITUATION", "DATING", "ABSURDE", "PARENTS", "COUPLE", "COUPLE"];
const CATALOGUE = CATS.map((category, i) => ({ id: `j${i}`, content: `vanne ${i}`, punchline: "chute", category, howToApply: null }));

type Where = { category?: string | { in: string[] } };
function filtrer(where: Where) {
  const c = where.category;
  return CATALOGUE.filter((v) => (c === undefined ? true : typeof c === "string" ? v.category === c : c.in.includes(v.category)));
}

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
  // La requête de page rend les vannes dans l'ordre du catalogue (comme `orderBy` en base), jamais dans celui de `in`.
  jokeFindMany.mockImplementation(({ where, select }: { where: Where & { id?: { in: string[] } }; select?: Record<string, boolean> }) => {
    if (where.id) return Promise.resolve(CATALOGUE.filter((v) => where.id!.in.includes(v.id)));
    const lignes = filtrer(where);
    return Promise.resolve(select ? lignes.map((v) => Object.fromEntries(Object.keys(select).map((k) => [k, v[k as keyof typeof v]]))) : lignes);
  });
});
afterAll(() => {
  delete etat.__D1611_API_OUVERT__;
});

const vannes = async (chemin: string) => (await getJokes(new NextRequest(`http://localhost${chemin}`))).json();
const ids = (corps: { jokes: { id: string }[] }) => corps.jokes.map((j) => j.id);

describe("/api/jokes, abonné, interrupteur ouvert", () => {
  beforeEach(() => {
    etat.__D1611_API_OUVERT__ = true;
  });

  it("« Toutes » : page 1 en alternance entre groupes, puis page 2 ; ensemble complet, total inchangé", async () => {
    const p1 = await vannes("/api/jokes?limit=12&page=1");
    expect(ids(p1)).toEqual(["j0", "j12", "j13", "j14", "j15", "j1", "j16", "j2", "j17", "j3", "j4", "j5"]);
    expect(new Set(p1.jokes.slice(0, 5).map((j: { category: string }) => groupeDeCategorie(j.category))).size).toBe(5);
    const p2 = await vannes("/api/jokes?limit=12&page=2");
    expect(ids(p2)).toEqual(["j6", "j7", "j8", "j9", "j10", "j11"]);
    expect(new Set([...ids(p1), ...ids(p2)])).toEqual(new Set(CATALOGUE.map((v) => v.id)));
    expect(p1.pagination).toMatchObject({ total: CATALOGUE.length, totalPages: 2 });
    expect(p1.limited).toBe(false);
    expect(jokeFindMany).toHaveBeenCalledTimes(4);
  });

  it("filtre de catégorie : ordre d'avant", async () => {
    const couple = await vannes("/api/jokes?limit=12&category=COUPLE,DATING");
    expect(ids(couple)).toEqual(["j13", "j16", "j17"]);
  });
});

describe("/api/jokes, ordre d'avant", () => {
  it("abonné, interrupteur fermé : plus récentes d'abord, requête d'avant (sans `category`)", async () => {
    etat.__D1611_API_OUVERT__ = false;
    const p1 = await vannes("/api/jokes?limit=12");
    expect(ids(p1)).toEqual(CATALOGUE.slice(0, 12).map((v) => v.id));
    expect(jokeFindMany.mock.calls[0][0].select).toEqual({ id: true, content: true });
  });
});
