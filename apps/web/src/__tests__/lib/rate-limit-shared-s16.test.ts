/**
 * @jest-environment node
 *
 * s16 reco 14 : limiteur partagé (Postgres, table JobLock) + clé IP
 * `cf-connecting-ip` (jamais `x-forwarded-for`), repli mémoire si la base tombe.
 */
const rows: Array<{ jobKey: string; expiresAt: Date }> = [];
let failDb = false;
let forcerConflit = 0;

function matches(where: { jobKey: { startsWith: string }; expiresAt?: { gt?: Date; lt?: Date } }, r: { jobKey: string; expiresAt: Date }) {
  if (!r.jobKey.startsWith(where.jobKey.startsWith)) return false;
  if (where.expiresAt?.gt && !(r.expiresAt > where.expiresAt.gt)) return false;
  if (where.expiresAt?.lt && !(r.expiresAt < where.expiresAt.lt)) return false;
  return true;
}

jest.mock("@/lib/prisma", () => ({
  prisma: {
    jobLock: {
      deleteMany: jest.fn(async ({ where }) => {
        if (failDb) throw new Error("db down");
        for (let i = rows.length - 1; i >= 0; i--) if (matches(where, rows[i])) rows.splice(i, 1);
      }),
      count: jest.fn(async ({ where }) => rows.filter((r) => matches(where, r)).length),
      findFirst: jest.fn(async ({ where }) =>
        rows.filter((r) => matches(where, r)).sort((a, b) => +a.expiresAt - +b.expiresAt)[0] ?? null,
      ),
    },
    // Lot H : prise de créneau atomique (INSERT … ON CONFLICT). Valeurs de la
    // requête dans l'ordre : max-1, préfixe, now, id, préfixe, now, expiresAt.
    $queryRaw: jest.fn(async (sql: { values: unknown[] }) => {
      if (forcerConflit > 0) {
        forcerConflit--;
        return [{ libres: 1, pris: 0 }];
      }
      const [maxMoins1, prefix, nowIso, , , , expIso] = sql.values as [number, string, string, string, string, string, string];
      const now = new Date(nowIso);
      const libres: number[] = [];
      for (let n = 0; n <= maxMoins1; n++) {
        if (!rows.some((r) => r.jobKey === `${prefix}${n}` && r.expiresAt > now)) libres.push(n);
      }
      if (libres.length === 0) return [{ libres: 0, pris: 0 }];
      const jobKey = `${prefix}${libres[0]}`;
      const i = rows.findIndex((r) => r.jobKey === jobKey);
      if (i >= 0) rows.splice(i, 1);
      rows.push({ jobKey, expiresAt: new Date(expIso) });
      return [{ libres: libres.length, pris: 1 }];
    }),
  },
}));

import { getClientIp, hashRateLimitKey, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";

const opts = { maxRequests: 3, windowMs: 60_000 };

beforeEach(() => {
  rows.length = 0;
  failDb = false;
  forcerConflit = 0;
});

describe("sharedRateLimit", () => {
  it("autorise jusqu'au plafond puis refuse, avec Retry-After cohérent", async () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect((await sharedRateLimit("login-email", "a@b.fr", opts, t)).allowed).toBe(true);
    const refus = await sharedRateLimit("login-email", "a@b.fr", opts, t + 1000);
    expect(refus.allowed).toBe(false);
    expect(retryAfterSeconds(refus, t + 1000)).toBe(59);
  });

  it("fenêtre glissante : de nouveau autorisé après expiration", async () => {
    const t = 2_000_000;
    for (let i = 0; i < 3; i++) await sharedRateLimit("s", "k", opts, t);
    expect((await sharedRateLimit("s", "k", opts, t + 60_001)).allowed).toBe(true);
  });

  it("scopes et clés indépendants ; la clé est hachée (pas d'e-mail en base)", async () => {
    for (let i = 0; i < 3; i++) await sharedRateLimit("login-email", "a@b.fr", opts);
    expect((await sharedRateLimit("login-email", "c@d.fr", opts)).allowed).toBe(true);
    expect((await sharedRateLimit("login-ip", "a@b.fr", opts)).allowed).toBe(true);
    expect(rows.every((r) => !r.jobKey.includes("@"))).toBe(true);
    expect(rows[0].jobKey).toContain(hashRateLimitKey("a@b.fr"));
  });

  it("lot H : rafale simultanée, jamais plus que le plafond (créneaux uniques)", async () => {
    const t = 3_000_000;
    const res = await Promise.all(Array.from({ length: 20 }, () => sharedRateLimit("rafale", "k", opts, t)));
    expect(res.filter((r) => r.allowed)).toHaveLength(3);
    expect(new Set(rows.map((r) => r.jobKey)).size).toBe(3);
  });

  it("lot H : créneau disputé et perdu → nouvel essai, puis refus après 3 pertes", async () => {
    forcerConflit = 1;
    expect((await sharedRateLimit("dispute", "k", opts)).allowed).toBe(true);
    forcerConflit = 3;
    expect((await sharedRateLimit("dispute", "k2", opts)).allowed).toBe(false);
  });

  it("base indisponible : repli mémoire (pas de blocage global)", async () => {
    failDb = true;
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    for (let i = 0; i < 3; i++) expect((await sharedRateLimit("panne", "x", opts)).allowed).toBe(true);
    expect((await sharedRateLimit("panne", "x", opts)).allowed).toBe(false);
    spy.mockRestore();
  });
});

describe("getClientIp", () => {
  it("lit cf-connecting-ip (Headers ou objet)", () => {
    expect(getClientIp(new Headers({ "cf-connecting-ip": "1.2.3.4" }))).toBe("1.2.3.4");
    expect(getClientIp({ "cf-connecting-ip": " 5.6.7.8 " })).toBe("5.6.7.8");
  });

  it("ignore x-forwarded-for (choisi par le client) : clé locale", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": "9.9.9.9" }))).toBe("local");
    expect(getClientIp({})).toBe("local");
  });
});
