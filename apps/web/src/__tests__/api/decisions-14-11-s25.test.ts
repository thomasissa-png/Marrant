/**
 * @jest-environment node
 *
 * Décisions de Thomas du 14/11 (s25), côté serveur :
 *  - `/api/jokes` : sans abonnement, interrupteur ouvert, les 10 vannes de `selectionGratuite` (au moins 5 groupes de
 *    la rangée) ; un filtre de catégorie montre celles de la sélection qui y répondent. Fermé : les 10 plus récentes,
 *    au caractère près comme avant (aucune requête de plus). Abonné : tout, ouvert comme fermé.
 */
const etat = globalThis as { __DECISIONS_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __DECISIONS_OUVERT__?: boolean }).__DECISIONS_OUVERT__ ?? false;
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

// Catalogue factice (identifiants seulement) dans l'ordre de la liste : 12 BOULOT d'abord (les plus récentes), puis
// une vanne de chacun des 9 autres groupes, puis 3 COUPLE. Les 10 plus récentes sont donc toutes BOULOT.
const CATS = ["BOULOT", ...Array(11).fill("BOULOT"), "SITUATION", "DATING", "SOIREES", "ECOLE", "PARENTS", "GAMING", "AUTODERISION", "ABSURDE", "JEUX_DE_MOTS", "COUPLE", "COUPLE", "COUPLE"];
const CATALOGUE = CATS.map((category, i) => ({ id: `j${i}`, content: `vanne ${i}`, punchline: "chute", category, howToApply: null }));

type Where = { category?: string | { in: string[] }; OR?: unknown };
function filtrer(where: Where) {
  const c = where.category;
  return CATALOGUE.filter((v) => (c === undefined ? true : typeof c === "string" ? v.category === c : c.in.includes(v.category)));
}

function seConnecter(plan: "PREMIUM" | "FREE" | null) {
  getServerSession.mockResolvedValue(plan ? { user: { id: "u1" } } : null);
  userFindUnique.mockResolvedValue(plan ? { plan } : null);
}

beforeEach(() => {
  jest.clearAllMocks();
  jokeFindMany.mockImplementation(({ where, select }: { where: Where & { id?: { in: string[] } }; select?: Record<string, boolean> }) => {
    if (where.id) return Promise.resolve(CATALOGUE.filter((v) => where.id!.in.includes(v.id)));
    const lignes = filtrer(where);
    return Promise.resolve(select ? lignes.map((v) => Object.fromEntries(Object.keys(select).map((k) => [k, v[k as keyof typeof v]]))) : lignes);
  });
});
afterAll(() => {
  delete etat.__DECISIONS_OUVERT__;
});

const vannes = async (chemin: string) => (await getJokes(new NextRequest(`http://localhost${chemin}`))).json();
const ids = (corps: { jokes: { id: string }[] }) => corps.jokes.map((j) => j.id);

describe("/api/jokes, interrupteur fermé : inchangé", () => {
  beforeEach(() => {
    etat.__DECISIONS_OUVERT__ = false;
  });
  it.each([["visiteur", null], ["compte gratuit", "FREE"]] as const)("%s : les 10 plus récentes, une seule requête de liste", async (_n, plan) => {
    seConnecter(plan);
    const corps = await vannes("/api/jokes?limit=12");
    expect(ids(corps)).toEqual(CATALOGUE.slice(0, 10).map((v) => v.id));
    expect(corps.pagination.total).toBe(10);
    expect(corps.limited).toBe(true);
    expect(corps.totalReal).toBe(CATALOGUE.length);
    expect(jokeFindMany).toHaveBeenCalledTimes(2);
  });
});

describe("/api/jokes, interrupteur ouvert", () => {
  beforeEach(() => {
    etat.__DECISIONS_OUVERT__ = true;
  });

  it.each([["visiteur", null], ["compte gratuit", "FREE"]] as const)("%s : 10 vannes sur les 10 groupes de la rangée", async (_n, plan) => {
    seConnecter(plan);
    const corps = await vannes("/api/jokes?limit=12");
    expect(corps.jokes).toHaveLength(10);
    expect(new Set(corps.jokes.map((j: { category: string }) => groupeDeCategorie(j.category))).size).toBe(10);
    expect(ids(corps)).toEqual(["j0", "j12", "j13", "j14", "j15", "j16", "j17", "j18", "j19", "j20"]);
    expect(corps.limited).toBe(true);
    expect(corps.pagination).toMatchObject({ total: 10, totalPages: 1 });
  });

  it("filtre de catégorie : seulement les vannes de la sélection qui y répondent", async () => {
    seConnecter("FREE");
    const couple = await vannes("/api/jokes?limit=12&category=COUPLE,DATING");
    expect(ids(couple)).toEqual(["j13"]);
    expect(couple.totalReal).toBe(4);
    const boulot = await vannes("/api/jokes?limit=12&category=BOULOT");
    expect(ids(boulot)).toEqual(["j0"]);
  });

  it("page 2 sans abonnement : vide, limitée", async () => {
    seConnecter(null);
    const corps = await vannes("/api/jokes?limit=12&page=2");
    expect(corps.jokes).toEqual([]);
    expect(corps.limited).toBe(true);
  });

  it("abonné : tout le catalogue, sans sélection", async () => {
    seConnecter("PREMIUM");
    const corps = await vannes("/api/jokes?limit=50");
    expect(corps.jokes).toHaveLength(CATALOGUE.length);
    expect(corps.limited).toBe(false);
    expect(jokeFindMany).toHaveBeenCalledTimes(2);
  });
});
