/**
 * @jest-environment node
 *
 * Notation cycle 9, @qa R1 : `--rollback` sans `--debut`/`--fin` prenait la période par défaut
 * du lot (relance-s15 : 12/10 au 03/01) et aurait annulé 1a ET 1b ensemble.
 *  - sans dates (avec ou sans --confirmer) : code 2, aucun client Prisma, aucune lecture ni écriture ;
 *  - avec dates : comportement inchangé (seule la tranche demandée passe en REJECTED).
 * Base simulée EN MÉMOIRE (mêmes filtres que social-lot-rollback-tranche.test.ts), aucune connexion.
 */
interface Ligne { id: string; platform: string; status: string; approvedBy: string; scheduledAt: Date; directorNote: string; externalId: string | null; publishedAt: Date | null }
type Where = Partial<{ approvedBy: string; status: string | { in: string[] }; externalId: null; publishedAt: null; scheduledAt: { gte: Date; lt: Date };
  directorNote: { startsWith: string }; id: { in: string[] }; platform: { in: string[] } }>;

const base: Ligne[] = [];
const filtre = (w: Where = {}) => (l: Ligne) =>
  (w.approvedBy === undefined || l.approvedBy === w.approvedBy)
  && (w.status === undefined || (typeof w.status === "string" ? l.status === w.status : w.status.in.includes(l.status)))
  && (w.externalId === undefined || l.externalId === null)
  && (w.publishedAt === undefined || l.publishedAt === null)
  && (w.scheduledAt === undefined || (l.scheduledAt >= w.scheduledAt.gte && l.scheduledAt < w.scheduledAt.lt))
  && (w.directorNote === undefined || l.directorNote.startsWith(w.directorNote.startsWith))
  && (w.id === undefined || w.id.in.includes(l.id))
  && (w.platform === undefined || w.platform.in.includes(l.platform));

const fake = {
  socialPost: {
    count: jest.fn(async ({ where }: { where: Where }) => base.filter(filtre(where)).length),
    findMany: jest.fn(async ({ where }: { where: Where }) => base.filter(filtre(where))),
    groupBy: jest.fn(async ({ where }: { where: Where }) => {
      const m = new Map<string, number>();
      for (const l of base.filter(filtre(where))) m.set(l.status, (m.get(l.status) ?? 0) + 1);
      return [...m].map(([status, n]) => ({ status, _count: { _all: n } }));
    }),
    createMany: jest.fn(async ({ data }: { data: Ligne[] }) => {
      for (const d of data) base.push({ ...d, externalId: null, publishedAt: null });
      return { count: data.length };
    }),
    updateMany: jest.fn(async ({ where, data }: { where: Where; data: Partial<Ligne> }) => {
      const cibles = base.filter(filtre(where));
      for (const l of cibles) Object.assign(l, data);
      return { count: cibles.length };
    }),
  },
  $executeRaw: jest.fn(async () => 0),
  $disconnect: jest.fn(),
};
jest.mock("@prisma/client", () => ({ ...jest.requireActual("@prisma/client"), PrismaClient: jest.fn().mockImplementation(() => fake) }));

import { PrismaClient } from "@prisma/client";

import { mainLot } from "../../../scripts/content/prepare-social-month";
import { buildLotV5 } from "../../../scripts/content/social-lot-v5";
import { fichierLot } from "../../../scripts/content/social-lot-v5-export";
import { insererLot } from "../../../scripts/content/social-lot-v5-insert";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";

const LOT = "tranches";
const T1 = { lot: LOT, debut: "2026-10-19", fin: "2026-10-25" };
const T2 = { lot: LOT, debut: "2026-10-26", fin: "2026-11-01" };
const arts = ARTICLES.map((a) => ({ ...a, aGarder: a.date >= "2026-10-19" }));
const tranche = (m: typeof T1) => fichierLot(buildLotV5({ pool: catalogue(), articles: arts, recents: [], seed: "test", ...m }).posts, "test", m);
const f1 = tranche(T1);
const f2 = tranche(T2);

const ecritures = () => fake.socialPost.updateMany.mock.calls.length + fake.socialPost.createMany.mock.calls.length + fake.$executeRaw.mock.calls.length;
const lectures = () => fake.socialPost.count.mock.calls.length + fake.socialPost.groupBy.mock.calls.length + fake.socialPost.findMany.mock.calls.length;
const etat = () => base.map((l) => `${l.id}:${l.status}`).sort();

let erreurs: jest.SpyInstance;
let journal: jest.SpyInstance;
beforeEach(async () => {
  base.length = 0;
  process.env.DATABASE_URL = "postgres://x";
  delete process.env.NEON_DATABASE_URL;
  await insererLot(f1, "tcp", "postgres://x");
  await insererLot(f2, "tcp", "postgres://x");
  jest.clearAllMocks();
  erreurs = jest.spyOn(console, "error").mockImplementation(() => undefined);
  journal = jest.spyOn(console, "log").mockImplementation(() => undefined);
});
afterEach(() => {
  erreurs.mockRestore();
  journal.mockRestore();
});

describe("R1 : --rollback refusé sans --debut ET --fin explicites", () => {
  const cas: [string, string[]][] = [
    ["relance-s15 sans dates, --confirmer", ["--lot", "relance-s15", "--rollback", "--confirmer"]],
    ["relance-s15 sans dates, dry-run", ["--lot", "relance-s15", "--rollback"]],
    ["--debut seul", ["--lot", LOT, "--rollback", "--confirmer", "--debut", "2026-10-26"]],
    ["--fin seul (forme =)", ["--lot", LOT, "--rollback", "--confirmer", "--fin=2026-11-01", "--driver=neon-http"]],
  ];
  it.each(cas)("%s : code 2, aucun client, 0 lecture, 0 écriture, base intacte", async (_n, argv) => {
    const avant = etat();
    expect(await mainLot(argv)).toBe(2);
    expect(PrismaClient).not.toHaveBeenCalled();
    expect(lectures()).toBe(0);
    expect(ecritures()).toBe(0);
    expect(etat()).toEqual(avant);
    expect(erreurs).toHaveBeenCalledWith(expect.stringMatching(/^--rollback exige --debut ET --fin/));
  });
});

describe("avec --debut et --fin : comportement inchangé", () => {
  it("dry-run : comptes de la tranche, 0 écriture, code 0", async () => {
    expect(await mainLot(["--lot", LOT, "--rollback", "--debut", T2.debut, "--fin", T2.fin])).toBe(0);
    expect(ecritures()).toBe(0);
    expect(fake.socialPost.count).toHaveBeenCalledTimes(1);
    expect(base.every((l) => l.status === "APPROVED")).toBe(true);
  });

  it("--confirmer : seule la tranche demandée passe en REJECTED, code 0", async () => {
    expect(await mainLot(["--lot", LOT, "--rollback", "--confirmer", "--debut", T2.debut, "--fin", T2.fin])).toBe(0);
    expect(fake.socialPost.updateMany).toHaveBeenCalledTimes(1);
    const ids1 = new Set(f1.posts.map((p) => p.id));
    const ids2 = new Set(f2.posts.map((p) => p.id));
    expect(base.filter((l) => ids1.has(l.id)).every((l) => l.status === "APPROVED")).toBe(true);
    expect(base.filter((l) => ids2.has(l.id)).every((l) => l.status === "REJECTED")).toBe(true);
  });
});
