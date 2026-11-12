/**
 * @jest-environment node
 *
 * s24 lot 0 : mesure d'usage côté routes, définitions du §5.2 du brief espace client.
 * - Le simple CHARGEMENT d'une API (listes vannes, conseils, vidéos, toutes pages ; exercice d'une fiche) n'écrit
 *   plus rien : le premier accès vient de `POST /api/mesure/acces`, appelé par le navigateur quand
 *   le contenu est réellement affiché.
 * - `POST /api/mesure/acces` : refus sans session (401), refus non Premium (403, plan relu en base),
 *   détail hors liste (400), étape vérifiée en base, 204 et une seule ligne par abonnement.
 * - « aha » : première étape validée OU premier quiz terminé ; jour de pratique au quiz.
 * - Portail Stripe ouvert. Une écriture en échec ne change ni le statut ni le corps.
 * Base `UsageEvent` simulée en mémoire, avec l'unicité de la migration 18.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({
  rateLimit: () => ({ allowed: true, remaining: 9, resetAt: Date.now() + 60_000 }),
  sharedRateLimit: async () => ({ allowed: true, remaining: 9, resetAt: Date.now() + 60_000 }),
  retryAfterSeconds: () => 42,
}));
const memeSite = jest.fn((): unknown => null);
jest.mock("@/lib/same-site", () => ({ refuserSiAutreSite: () => memeSite() }));
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
let basePanne = false;
const usageEvent = {
  create: jest.fn(async ({ data }: { data: Ligne }) => {
    if (basePanne) throw Object.assign(new Error("relation absente"), { code: "P2021" });
    if (data.dedupKey && lignes.some((l) => l.dedupKey === data.dedupKey)) throw Object.assign(new Error("dup"), { code: "P2002" });
    lignes.push(data);
    return data;
  }),
  findUnique: jest.fn(async ({ where }: { where: { dedupKey: string } }) => {
    if (basePanne) throw new Error("relation absente");
    return lignes.some((l) => l.dedupKey === where.dedupKey) ? { id: "x" } : null;
  }),
};

let plan: string | null = "PREMIUM";
let abonnementStripe = "sub_1";
const JOKES = Array.from({ length: 15 }, (_, i) => ({ id: `j${i + 1}`, content: `Vanne numéro ${i + 1}`, howToApply: `EXO ${i + 1}` }));
const TIPS = Array.from({ length: 12 }, (_, i) => ({ id: `t${i + 1}`, title: `Conseil ${i + 1}`, content: "c", exercise: "EXO" }));
const VIDEOS = Array.from({ length: 12 }, (_, i) => ({ id: `v${i + 1}`, title: `Vidéo ${i + 1}`, exercise: "EXO", learnings: ["P"] }));
const transaction = jest.fn();
const learningPathStepFindFirst = jest.fn();
const opposes = new Set<string>();
const prismaMock = {
  usageEvent,
  webhookEvent: {
    findUnique: jest.fn(async ({ where }: { where: { eventId: string } }) =>
      opposes.has(where.eventId.replace("mesure-usage:opposition:", "")) ? { id: "m" } : null,
    ),
  },
  user: {
    findUnique: jest.fn(async () => (plan ? { plan, streak: 0, lastPracticeAt: null } : null)),
    update: jest.fn().mockResolvedValue({}),
  },
  tip: {
    findFirst: jest.fn().mockResolvedValue({ exercise: "EXERCICE CONSEIL" }),
    findMany: jest.fn(async (args: { select?: unknown; where: { id?: { in: string[] } } }) =>
      args.select ? TIPS.map(({ id, title }) => ({ id, title })) : TIPS.filter((t) => args.where.id?.in.includes(t.id)),
    ),
  },
  video: {
    findFirst: jest.fn().mockResolvedValue({ exercise: "EXERCICE VIDEO", learnings: ["P"] }),
    count: jest.fn().mockResolvedValue(VIDEOS.length),
    findMany: jest.fn(async (args: { skip: number; take: number }) => VIDEOS.slice(args.skip, args.skip + args.take)),
  },
  dailyContent: { findUnique: jest.fn().mockResolvedValue(null) },
  joke: {
    findFirst: jest.fn().mockResolvedValue({ howToApply: "EXERCICE VANNE" }),
    findMany: jest.fn(async (args: { select?: unknown; where: { id?: { in: string[] } } }) =>
      args.select ? JOKES.map(({ id, content }) => ({ id, content })) : JOKES.filter((j) => args.where.id?.in.includes(j.id)),
    ),
  },
  subscription: {
    findUnique: jest.fn(async () => ({ stripeCustomerId: "cus_1", stripeSubscriptionId: abonnementStripe })),
  },
  learningPathStep: { findFirst: (...a: unknown[]) => learningPathStepFindFirst(...a) },
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
import { GET as getTips } from "@/app/api/tips/route";
import { GET as getVideos } from "@/app/api/videos/route";
import { POST as postAcces } from "@/app/api/mesure/acces/route";
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
const acces = (corps: unknown) =>
  postAcces(new Request("http://localhost/api/mesure/acces", { method: "POST", body: JSON.stringify(corps) }));

beforeEach(() => {
  lignes.length = 0;
  opposes.clear();
  basePanne = false;
  abonnementStripe = "sub_1";
  memeSite.mockReturnValue(null);
  learningPathStepFindFirst.mockReset().mockResolvedValue({ id: "step-2" });
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe("chargement des API : aucune écriture (définition §5.2)", () => {
  it("listes vannes, conseils, vidéos, page 2 comprise (pages publiques), abonné : rien n'est écrit, réponses inchangées", async () => {
    const u = seConnecter("PREMIUM");
    const vannes = await getJokes(new NextRequest("http://localhost/api/jokes?page=2&limit=10"));
    const conseils = await getTips(new NextRequest("http://localhost/api/tips?page=1&limit=10"));
    const videos = await getVideos(new NextRequest("http://localhost/api/videos?page=1&limit=12"));
    expect([vannes.status, conseils.status, videos.status]).toEqual([200, 200, 200]);
    expect((await vannes.json()).jokes).toHaveLength(5);
    expect((await conseils.json()).tips).toHaveLength(10);
    expect((await videos.json()).videos).toHaveLength(12);
    expect(types(u)).toEqual([]);
    expect(usageEvent.create).not.toHaveBeenCalled();
  });

  it("exercice d'une fiche chargé : ni premier accès ni « aha »", async () => {
    const u = seConnecter("PREMIUM");
    for (const type of ["conseil", "video", "vanne"]) {
      expect((await getExercice(new NextRequest(`http://localhost/api/fiches/exercice?type=${type}&id=x`))).status).toBe(200);
    }
    expect(types(u)).toEqual([]);
  });
});

describe("POST /api/mesure/acces", () => {
  it("sans session : 401, rien d'écrit", async () => {
    getServerSession.mockResolvedValue(null);
    expect((await acces({ type: "exercice", fiche: "vanne" })).status).toBe(401);
    expect(usageEvent.create).not.toHaveBeenCalled();
  });

  it("autre site : refusé avant tout", async () => {
    seConnecter("PREMIUM");
    prismaMock.user.findUnique.mockClear();
    memeSite.mockReturnValue(new Response(null, { status: 403 }));
    expect((await acces({ type: "exercice", fiche: "vanne" })).status).toBe(403);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("compte non Premium (plan relu en base) : 403, aucun premier accès", async () => {
    const u = seConnecter("FREE");
    getServerSession.mockResolvedValue({ user: { id: u, plan: "PREMIUM" } }); // jeton menteur
    expect((await acces({ type: "exercice", fiche: "conseil" })).status).toBe(403);
    expect(types(u)).toEqual([]);
  });

  it.each([
    // Listes : toutes leurs pages sont publiques (§5.2), le signal n'existe plus.
    [{ type: "liste", liste: "vannes" }],
    [{ type: "exercice", fiche: "blague" }],
    [{ type: "exercice", fiche: "conseil", texte: "yanis@exemple.fr" }],
    [{ type: "etape", parcours: "repartie", etape: 1 }],
    [{ type: "etape", parcours: "Répartie !", etape: 2 }],
    [{ type: "carnet" }],
    ["pas du json"],
  ])("détail hors liste %j : 400, rien d'écrit", async (corps) => {
    const u = seConnecter("PREMIUM");
    expect((await acces(corps)).status).toBe(400);
    expect(types(u)).toEqual([]);
  });

  it("étape absente en base (ou parcours inactif) : 400", async () => {
    const u = seConnecter("PREMIUM");
    learningPathStepFindFirst.mockResolvedValue(null);
    expect((await acces({ type: "etape", parcours: "repartie", etape: 9 })).status).toBe(400);
    expect(learningPathStepFindFirst).toHaveBeenCalledWith({
      where: { order: 9, learningPath: { slug: "repartie", isActive: true } },
      select: { id: true },
    });
    expect(types(u)).toEqual([]);
  });

  it("abonné : 204 sans corps, une seule ligne par abonnement (dédoublonnage), détail fermé", async () => {
    const u = seConnecter("PREMIUM");
    const r1 = await acces({ type: "etape", parcours: "repartie", etape: 2 });
    expect(r1.status).toBe(204);
    expect(await r1.text()).toBe("");
    expect((await acces({ type: "exercice", fiche: "conseil" })).status).toBe(204);
    expect((await acces({ type: "exercice", fiche: "video" })).status).toBe(204);
    expect(types(u)).toEqual(["premier_acces_premium/etape:2"]);
    abonnementStripe = "sub_2"; // réabonnement
    await acces({ type: "exercice", fiche: "vanne" });
    expect(types(u)).toEqual(["premier_acces_premium/etape:2", "premier_acces_premium/exercice-vanne"]);
  });

  it("compte opposé à la mesure : 204, aucune ligne (signal, quiz, portail)", async () => {
    const u = seConnecter("PREMIUM");
    opposes.add(u);
    expect((await acces({ type: "exercice", fiche: "conseil" })).status).toBe(204);
    expect((await postQuiz(new NextRequest("http://localhost/api/parcours/p1/quiz", { method: "POST", body: JSON.stringify({ stepOrder: 2 }) }), { params: { id: "p1" } })).status).toBe(200);
    portalCreate.mockResolvedValueOnce({ url: "https://billing.stripe.com/p/9" });
    expect((await postPortail(new Request("http://localhost/api/user/subscription/portal", { method: "POST", body: JSON.stringify({ parcours: "carte" }) }))).status).toBe(200);
    expect(types(u)).toEqual([]);
    expect(usageEvent.create).not.toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ userId: u }) }));
  });

  it("base en panne : 204 quand même", async () => {
    seConnecter("PREMIUM");
    basePanne = true;
    expect((await acces({ type: "exercice", fiche: "video" })).status).toBe(204);
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
    basePanne = true;
    portalCreate.mockResolvedValueOnce({ url: "https://billing.stripe.com/p/4" });
    expect(await (await postPortail(corps("carte"))).json()).toEqual({ url: "https://billing.stripe.com/p/4", cible: true });
  });
});

describe("parcours : « aha » (première étape validée OU premier quiz terminé) et jour de pratique", () => {
  const quiz = (etape = 2) =>
    postQuiz(new NextRequest("http://localhost/api/parcours/p1/quiz", { method: "POST", body: JSON.stringify({ stepOrder: etape }) }), {
      params: { id: "p1" },
    });

  it("premier quiz : « aha » et jour de pratique ; deuxième quiz le même jour : rien de plus", async () => {
    const u = seConnecter("PREMIUM");
    expect((await quiz(2)).status).toBe(200);
    expect((await quiz(3)).status).toBe(200);
    expect(types(u)).toEqual(["jour_pratique/quiz", "aha/quiz:2"]);
  });

  it("quiz, écriture en échec : 200", async () => {
    seConnecter("PREMIUM");
    basePanne = true;
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

  it("première étape validée : « aha » (étape 1) ; double validation, puis quiz : rien de plus", async () => {
    const u = seConnecter("PREMIUM");
    transaction.mockImplementation(async (fn: (tx: unknown) => unknown) => fn(txValidation(false)));
    expect((await valider()).status).toBe(200);
    transaction.mockImplementation(async (fn: (tx: unknown) => unknown) => fn(txValidation(true)));
    expect((await valider()).status).toBe(200);
    await quiz();
    expect(types(u)).toEqual(["aha/etape:1", "jour_pratique/quiz"]);
  });

  it("validation, écriture en échec : 200 et XP rendu", async () => {
    seConnecter("PREMIUM");
    basePanne = true;
    transaction.mockImplementation(async (fn: (tx: unknown) => unknown) => fn(txValidation(false)));
    const res = await valider();
    expect(res.status).toBe(200);
    expect((await res.json()).xpGained).toBeGreaterThan(0);
  });
});

describe("aucune donnée personnelle", () => {
  it("chaque ligne n'a que compte, type, détail fermé, date et clé", async () => {
    seConnecter("PREMIUM");
    await acces({ type: "exercice", fiche: "conseil" });
    await quiz2();
    for (const l of lignes) {
      expect(Object.keys(l).sort()).toEqual(["dedupKey", "detail", "occurredAt", "type", "userId"]);
      expect(JSON.stringify(l)).not.toMatch(/@|EXERCICE|sub_1/);
    }
  });
  const quiz2 = () =>
    postQuiz(new NextRequest("http://localhost/api/parcours/p1/quiz", { method: "POST", body: JSON.stringify({ stepOrder: 2 }) }), {
      params: { id: "p1" },
    });
});
