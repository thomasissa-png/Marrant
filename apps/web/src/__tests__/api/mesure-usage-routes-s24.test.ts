/**
 * @jest-environment node
 *
 * s24 lot 0 : mesure d'usage écrite par les routes (premier accès Premium, « aha », jour de
 * pratique, ouverture du portail). Base `UsageEvent` simulée en mémoire, avec l'unicité de la
 * migration 18. Pour chaque route : le bon événement au bon moment, une seule fois, rien pour un
 * compte non Premium, et une écriture en échec ne change ni le statut ni le corps de la réponse.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({
  rateLimit: () => ({ allowed: true, remaining: 9, resetAt: Date.now() + 60_000 }),
  sharedRateLimit: async () => ({ allowed: true, remaining: 9, resetAt: Date.now() + 60_000 }),
  retryAfterSeconds: () => 42,
}));
jest.mock("@/lib/same-site", () => ({ refuserSiAutreSite: () => null }));
jest.mock("@/lib/admin-alerts", () => ({
  CLES_PARCOURS: { progressErreur: "parcours-progress-erreur" },
  recordAdminAlert: jest.fn().mockResolvedValue(true),
}));
const createPortalSession = jest.fn();
const portalCreate = jest.fn();
jest.mock("@/lib/stripe", () => ({
  createPortalSession: (...a: unknown[]) => createPortalSession(...a),
  getStripe: () => ({ billingPortal: { sessions: { create: (...a: unknown[]) => portalCreate(...a) } } }),
}));

type Ligne = { userId: string; type: string; detail: string | null; occurredAt: Date; dedupKey: string | null };
const lignes: Ligne[] = [];
let ecritureEnPanne = false;
const usageEvent = {
  create: jest.fn(async ({ data }: { data: Ligne }) => {
    if (ecritureEnPanne) throw Object.assign(new Error("relation absente"), { code: "P2021" });
    if (data.dedupKey && lignes.some((l) => l.dedupKey === data.dedupKey)) throw Object.assign(new Error("dup"), { code: "P2002" });
    lignes.push(data);
    return data;
  }),
  findFirst: jest.fn(async ({ where }: { where: { userId: string; type: { in: string[] } } }) => {
    if (ecritureEnPanne) throw new Error("relation absente");
    const l = lignes
      .filter((x) => x.userId === where.userId && where.type.in.includes(x.type))
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())[0];
    return l ? { type: l.type, occurredAt: l.occurredAt } : null;
  }),
};

let plan: string | null = "PREMIUM";
const JOKES = Array.from({ length: 15 }, (_, i) => ({ id: `j${i + 1}`, content: `Vanne numéro ${i + 1}`, howToApply: `EXO ${i + 1}` }));
const transaction = jest.fn();
const prismaMock = {
  usageEvent,
  user: {
    findUnique: jest.fn(async () => (plan ? { plan, streak: 0, lastPracticeAt: null } : null)),
    update: jest.fn().mockResolvedValue({}),
  },
  tip: { findFirst: jest.fn().mockResolvedValue({ exercise: "EXERCICE CONSEIL" }) },
  video: { findFirst: jest.fn().mockResolvedValue({ exercise: "", learnings: [] }) },
  joke: {
    findFirst: jest.fn().mockResolvedValue({ howToApply: "" }),
    findMany: jest.fn(async (args: { select?: unknown; where: { id?: { in: string[] } } }) =>
      args.select ? JOKES.map(({ id, content }) => ({ id, content })) : JOKES.filter((j) => args.where.id?.in.includes(j.id)),
    ),
  },
  subscription: { findUnique: jest.fn().mockResolvedValue({ stripeCustomerId: "cus_1", stripeSubscriptionId: "sub_1" }) },
  learningPathStep: { findFirst: jest.fn().mockResolvedValue({ id: "step-2" }) },
  $transaction: (...a: unknown[]) => transaction(...a),
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return prismaMock;
  },
}));

import { NextRequest } from "next/server";
import { GET as getExercice } from "@/app/api/fiches/exercice/route";
import { GET as getJokes } from "@/app/api/jokes/route";
import { POST as postPortail } from "@/app/api/user/subscription/portal/route";
import { POST as postPortailSimple } from "@/app/api/stripe/portal/route";
import { POST as postQuiz } from "@/app/api/parcours/[id]/quiz/route";
import { POST as postProgress } from "@/app/api/parcours/[id]/progress/route";

let n = 0;
function seConnecter(p: string | null) {
  n += 1;
  plan = p;
  getServerSession.mockResolvedValue({ user: { id: `u${n}` } });
  return `u${n}`;
}
const types = (userId: string) => lignes.filter((l) => l.userId === userId).map((l) => `${l.type}/${l.detail}`);
const exercice = (qs: string) => getExercice(new NextRequest(`http://localhost/api/fiches/exercice?${qs}`));
const jokes = (qs: string) => getJokes(new NextRequest(`http://localhost/api/jokes?${qs}`));

beforeEach(() => {
  lignes.length = 0;
  ecritureEnPanne = false;
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe("exercice d'une fiche (/api/fiches/exercice)", () => {
  it("abonné : premier accès Premium et « aha », une seule fois", async () => {
    const u = seConnecter("PREMIUM");
    expect((await exercice("type=conseil&id=t1")).status).toBe(200);
    expect((await exercice("type=conseil&id=t2")).status).toBe(200);
    expect(types(u)).toEqual(["premier_acces_premium/exercice-conseil", "aha/exercice-conseil"]);
  });

  it("fiche sans exercice : rien n'est compté", async () => {
    const u = seConnecter("PREMIUM");
    await exercice("type=video&id=v1");
    await exercice("type=vanne&id=j1");
    expect(types(u)).toEqual([]);
  });

  it("compte non Premium : 403 et aucun premier accès", async () => {
    const u = seConnecter("FREE");
    expect((await exercice("type=conseil&id=t1")).status).toBe(403);
    expect(types(u)).toEqual([]);
    expect(usageEvent.findFirst).not.toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: u }) }));
  });

  it("écriture en échec : même statut, même corps", async () => {
    seConnecter("PREMIUM");
    ecritureEnPanne = true;
    const res = await exercice("type=conseil&id=t1");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ exercice: "EXERCICE CONSEIL", pointsCles: [] });
  });
});

describe("liste des vannes (/api/jokes), limite gratuite 10", () => {
  it("abonné dans la limite : rien ; au-delà : premier accès « liste-vannes »", async () => {
    const u = seConnecter("PREMIUM");
    await jokes("page=1&limit=10");
    expect(types(u)).toEqual([]);
    await jokes("page=2&limit=10");
    expect(types(u)).toEqual(["premier_acces_premium/liste-vannes"]);
  });

  it("compte gratuit au-delà de la limite : rien", async () => {
    const u = seConnecter("FREE");
    await jokes("page=2&limit=10");
    expect(types(u)).toEqual([]);
  });

  it("écriture en échec : corps identique", async () => {
    seConnecter("PREMIUM");
    const attendu = await (await jokes("page=1&limit=20")).json();
    lignes.length = 0;
    ecritureEnPanne = true;
    const res = await jokes("page=1&limit=20");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(attendu);
  });
});

describe("portail Stripe", () => {
  const corps = (parcours: string) =>
    new Request("http://localhost/api/user/subscription/portal", { method: "POST", body: JSON.stringify({ parcours }) });

  it("parcours ciblé : « portail_ouvert » avec le parcours ; repli : « simple »", async () => {
    const u = seConnecter("PREMIUM");
    portalCreate.mockResolvedValueOnce({ url: "https://billing.stripe.com/p/1" });
    expect((await postPortail(corps("resilier"))).status).toBe(200);
    portalCreate.mockRejectedValueOnce(new Error("flow refusé"));
    createPortalSession.mockResolvedValueOnce("https://billing.stripe.com/p/2");
    expect((await postPortail(corps("changer-formule"))).status).toBe(200);
    createPortalSession.mockResolvedValueOnce("https://billing.stripe.com/p/3");
    expect((await postPortailSimple(new Request("http://localhost/api/stripe/portal", { method: "POST" }))).status).toBe(200);
    expect(types(u)).toEqual(["portail_ouvert/resilier", "portail_ouvert/simple", "portail_ouvert/simple"]);
  });

  it("écriture en échec : l'adresse du portail est rendue quand même", async () => {
    seConnecter("PREMIUM");
    ecritureEnPanne = true;
    portalCreate.mockResolvedValueOnce({ url: "https://billing.stripe.com/p/4" });
    const res = await postPortail(corps("carte"));
    expect(await res.json()).toEqual({ url: "https://billing.stripe.com/p/4", cible: true });
  });
});

describe("parcours : quiz (jour de pratique) et validation d'étape (« aha »)", () => {
  const quiz = () =>
    postQuiz(new NextRequest("http://localhost/api/parcours/p1/quiz", { method: "POST", body: JSON.stringify({ stepOrder: 2 }) }), {
      params: { id: "p1" },
    });

  it("quiz terminé : un jour de pratique par jour, même s'il y a deux quiz", async () => {
    const u = seConnecter("PREMIUM");
    expect((await quiz()).status).toBe(200);
    expect((await quiz()).status).toBe(200);
    expect(types(u)).toEqual(["jour_pratique/quiz"]);
  });

  it("quiz, écriture en échec : 200", async () => {
    seConnecter("PREMIUM");
    ecritureEnPanne = true;
    expect((await quiz()).status).toBe(200);
  });

  function txValidation(dejaFait: boolean) {
    return {
      learningPath: { findUnique: jest.fn().mockResolvedValue({ id: "p1", slug: "repartie", steps: [{ order: 1 }, { order: 2 }, { order: 3 }] }) },
      userPathStepCompletion: { createMany: jest.fn().mockResolvedValue({ count: dejaFait ? 0 : 1 }) },
      userPathProgress: {
        findUnique: jest.fn().mockResolvedValue(dejaFait ? { id: "pr", completedSteps: [1], completedAt: null } : null),
        upsert: jest.fn().mockResolvedValue({ id: "pr", completedSteps: [1], completedAt: null }),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({ xp: 20, level: "NOVICE", streak: 1 }),
        update: jest.fn().mockResolvedValue({ xp: 20, level: "NOVICE", streak: 0, lastPracticeAt: null }),
      },
    };
  }
  const valider = () =>
    postProgress(
      new NextRequest("http://localhost/api/parcours/p1/progress", { method: "POST", body: JSON.stringify({ stepOrder: 1 }) }),
      { params: { id: "p1" } },
    );

  it("première étape validée : « aha » (étape 1) ; double validation : rien de plus", async () => {
    const u = seConnecter("PREMIUM");
    transaction.mockImplementation(async (fn: (tx: unknown) => unknown) => fn(txValidation(false)));
    expect((await valider()).status).toBe(200);
    transaction.mockImplementation(async (fn: (tx: unknown) => unknown) => fn(txValidation(true)));
    expect((await valider()).status).toBe(200);
    expect(types(u)).toEqual(["aha/etape:1"]);
  });

  it("validation, écriture en échec : 200 et XP rendu", async () => {
    seConnecter("PREMIUM");
    ecritureEnPanne = true;
    transaction.mockImplementation(async (fn: (tx: unknown) => unknown) => fn(txValidation(false)));
    const res = await valider();
    expect(res.status).toBe(200);
    expect((await res.json()).xpGained).toBeGreaterThan(0);
  });
});

describe("aucune donnée personnelle", () => {
  it("chaque ligne n'a que compte, type, détail fermé, date et clé", async () => {
    seConnecter("PREMIUM");
    await exercice("type=conseil&id=t1");
    await jokes("page=2&limit=10");
    for (const l of lignes) {
      expect(Object.keys(l).sort()).toEqual(["dedupKey", "detail", "occurredAt", "type", "userId"]);
      expect(JSON.stringify(l)).not.toMatch(/@|EXERCICE|Vanne numéro/);
    }
  });
});
