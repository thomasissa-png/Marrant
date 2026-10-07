/**
 * @jest-environment node
 *
 * Notation cycle 8, @qa D1 et D2 : deux tranches du même lot partagent l'approvedBy
 * (« thomas-s15 » pour relance-s15, « lot-<id> » sinon).
 *  - D1 : `--rollback --debut/--fin` n'annule que la tranche demandée (1b), jamais 1a ;
 *  - D2 : le contrôle après insertion de 1b ne compte que les replis de 1b.
 * Base simulée EN MÉMOIRE (les filtres `where` sont réellement appliqués), aucune connexion.
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
  $disconnect: jest.fn(),
};
jest.mock("@prisma/client", () => ({ ...jest.requireActual("@prisma/client"), PrismaClient: jest.fn().mockImplementation(() => fake) }));

import { buildLotV5 } from "../../../scripts/content/social-lot-v5";
import { fichierLot } from "../../../scripts/content/social-lot-v5-export";
import { annulerLot, bornesLot, insererLot, requeteAnnulation } from "../../../scripts/content/social-lot-v5-insert";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";

const LOT = "tranches";
const T1 = { lot: LOT, debut: "2026-10-19", fin: "2026-10-25" };
const T2 = { lot: LOT, debut: "2026-10-26", fin: "2026-11-01" };
const arts = ARTICLES.map((a) => ({ ...a, aGarder: a.date >= "2026-10-19" }));
const tranche = (m: typeof T1) => {
  const r = buildLotV5({ pool: catalogue(), articles: arts, recents: [], seed: "test", ...m });
  return { r, f: fichierLot(r.posts, "test", m, r.replis) };
};
const t1 = tranche(T1);
const t2 = tranche(T2);

beforeEach(() => {
  base.length = 0;
  jest.clearAllMocks();
});

describe("préalables des fixtures", () => {
  it("2 tranches sans erreur, même approvedBy, chacune avec au moins 1 repli", () => {
    expect(t1.r.errors).toEqual([]);
    expect(t2.r.errors).toEqual([]);
    expect(t1.f.approvedBy).toBe(t2.f.approvedBy);
    expect(t1.f.replis!.length).toBeGreaterThan(0);
    expect(t2.f.replis!.length).toBeGreaterThan(0);
  });
});

describe("D2 : contrôle après insertion limité à la tranche insérée", () => {
  it("2e tranche insérée après la 1re : 0 écart (les replis de la 1re ne sont pas comptés)", async () => {
    const r1 = await insererLot(t1.f, "tcp", "postgres://x");
    expect(r1.ecarts).toEqual([]);
    const r2 = await insererLot(t2.f, "tcp", "postgres://x");
    expect(r2.ecarts).toEqual([]);
    expect(r2.inseres).toBe(t2.f.total);
    const replisEnBase = base.filter((l) => l.directorNote.startsWith("[repli-de:")).length;
    expect(replisEnBase).toBe(t1.f.replis!.length + t2.f.replis!.length);
  });
});

describe("D1 : --rollback borné par --debut/--fin", () => {
  it("annuler la 2e tranche laisse la 1re intacte (APPROVED), comptes limités à la tranche", async () => {
    await insererLot(t1.f, "tcp", "postgres://x");
    await insererLot(t2.f, "tcp", "postgres://x");
    const p2 = bornesLot(T2.debut, T2.fin);
    const dry = await annulerLot(LOT, "tcp", "postgres://x", false, new Date("2026-10-24T08:00:00Z"), p2);
    expect(dry.aAnnuler).toBe(t2.f.total);
    expect(dry.avant).toEqual({ APPROVED: t2.f.total, REJECTED: t2.f.replis!.length });

    const r = await annulerLot(LOT, "tcp", "postgres://x", true, new Date("2026-10-24T08:00:00Z"), p2);
    expect(r.annules).toBe(t2.f.total);
    const ids1 = new Set(t1.f.posts.map((p) => p.id));
    const ids2 = new Set(t2.f.posts.map((p) => p.id));
    expect(base.filter((l) => ids1.has(l.id)).every((l) => l.status === "APPROVED")).toBe(true);
    expect(base.filter((l) => ids2.has(l.id)).every((l) => l.status === "REJECTED")).toBe(true);
    expect(base.find((l) => ids2.has(l.id))!.directorNote).toMatch(/^Lot tranches \(2026-10-25T23:00:00\.000Z au 2026-11-01T23:00:00\.000Z\) annulé/);
  });

  it("sans période : tout le lot (comportement antérieur conservé)", async () => {
    await insererLot(t1.f, "tcp", "postgres://x");
    await insererLot(t2.f, "tcp", "postgres://x");
    const r = await annulerLot(LOT, "tcp", "postgres://x", true, new Date("2026-10-24T08:00:00Z"));
    expect(r.annules).toBe(t1.f.total + t2.f.total);
  });

  it("pilote neon-http : l'UPDATE porte les bornes UTC de la tranche", () => {
    const p2 = bornesLot(T2.debut, T2.fin);
    const q = requeteAnnulation("lot-tranches", "note", p2);
    expect(q.sql).toMatch(/AND "scheduledAt" >= \(\?::timestamptz AT TIME ZONE 'UTC'\) AND "scheduledAt" < \(\?::timestamptz AT TIME ZONE 'UTC'\)$/);
    expect(q.values).toEqual(["note", "lot-tranches", "2026-10-25T23:00:00.000Z", "2026-11-01T23:00:00.000Z"]);
  });
});
