/**
 * @jest-environment node
 *
 * Décision Thomas (03/10/2026) : les étapes 2+ des parcours sont RÉELLEMENT
 * protégées côté serveur. Visiteur anonyme ou compte gratuit : aperçu seul
 * (titre, ce qu'on apprend, format, une phrase « pourquoi », XP), sans contenu du conseil, quiz,
 * vannes ni vidéos. Premium (plan lu en base, abonnés de lancement compris) : tout.
 */

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const userFindUnique = jest.fn();
const pathFindUnique = jest.fn();
const progressFindUnique = jest.fn();
const usageFindFirst = jest.fn();
const usageCreate = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    learningPath: { findUnique: (...a: unknown[]) => pathFindUnique(...a) },
    userPathProgress: { findUnique: (...a: unknown[]) => progressFindUnique(...a) },
    // s24 lot 0 : mesure d'usage (premier accès Premium).
    usageEvent: { findFirst: (...a: unknown[]) => usageFindFirst(...a), create: (...a: unknown[]) => usageCreate(...a) },
  },
}));

import { NextRequest } from "next/server";
import { GET } from "@/app/api/parcours/by-slug/[slug]/route";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

const SLUG = "repartie";
const seed = (parcoursSeed as Array<{ slug: string; steps: Array<{ week: number; moduleDetail: string }> }>).find(
  (p) => p.slug === SLUG,
)!;

/** Parcours tel que stocké en base : le seed l'enrichit (vannes, vidéos, quiz). */
function dbPath() {
  return {
    id: "db-repartie",
    slug: SLUG,
    title: "Répartie",
    steps: seed.steps.map((s) => ({
      id: `step-${s.week}`,
      order: s.week,
      dayNumber: s.week * 7,
      tip: {
        id: `tip-${s.week}`,
        title: `Conseil ${s.week}`,
        content: `CONTENU SECRET ${s.week}`,
        category: "GENERAL",
        difficulty: "INTERMEDIAIRE",
        example: `EXEMPLE SECRET ${s.week}`,
        exercise: `EXERCICE SECRET ${s.week}`,
      },
    })),
  };
}

async function get() {
  const res = await GET(new NextRequest(`https://deviens-marrant.fr/api/parcours/by-slug/${SLUG}`), {
    params: { slug: SLUG },
  });
  return { res, body: await res.json() };
}

type ServedStep = Record<string, unknown> & { order: number; tip: Record<string, string> };

function expectPreviewOnly(step: ServedStep) {
  expect(step.locked).toBe(true);
  expect(step.tip.content).toBe("");
  expect(step.tip.example).toBe("");
  expect(step.tip.exercise).toBe("");
  // D1 s17 : « ce que tu vas apprendre » fait partie de l'aperçu (déjà public sur /parcours).
  expect(step.moduleDetail).toBe(seed.steps.find((s) => s.week === step.order)?.moduleDetail);
  expect(step.quiz).toEqual([]);
  expect(step.jokeIds).toEqual([]);
  expect(step.videos).toEqual([]);
  expect(typeof step.moduleTitle).toBe("string");
  expect(typeof step.moduleFormat).toBe("string");
  expect(typeof step.moduleXp).toBe("number");
  // Une seule phrase « pourquoi ».
  expect(String(step.why)).toMatch(/^[^.!?…]+[.!?…]$/);
}

beforeEach(() => {
  getServerSession.mockReset().mockResolvedValue(null);
  userFindUnique.mockReset();
  pathFindUnique.mockReset().mockResolvedValue(dbPath());
  progressFindUnique.mockReset().mockResolvedValue(null);
});

describe("GET /api/parcours/by-slug/[slug] : protection Premium", () => {
  it("anonyme : étape 1 complète, étapes 2+ en aperçu, aucun texte secret dans la réponse", async () => {
    const { res, body } = await get();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    const [first, ...rest] = body.path.steps as ServedStep[];
    expect(first.locked).toBeUndefined();
    expect(first.tip.content).toBe("CONTENU SECRET 1");
    expect((first.quiz as unknown[]).length).toBeGreaterThan(0);
    rest.forEach(expectPreviewOnly);
    const raw = JSON.stringify(body);
    expect(raw).not.toContain("CONTENU SECRET 2");
    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it("compte gratuit : même aperçu (plan lu en base)", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u-free" } });
    userFindUnique.mockResolvedValue({ plan: "FREE" });
    const { body } = await get();
    (body.path.steps as ServedStep[]).slice(1).forEach(expectPreviewOnly);
    expect(userFindUnique).toHaveBeenCalledWith({ where: { id: "u-free" }, select: { plan: true } });
  });

  it("jwt qui annonce PREMIUM mais base FREE : aperçu (la base fait foi)", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u-free", plan: "PREMIUM" } });
    userFindUnique.mockResolvedValue({ plan: "FREE" });
    const { body } = await get();
    (body.path.steps as ServedStep[]).slice(1).forEach(expectPreviewOnly);
  });

  it("Premium (abonnés de lancement compris, même plan) : tout le contenu", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u-premium" } });
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    const { body } = await get();
    const steps = body.path.steps as ServedStep[];
    steps.forEach((s) => expect(s.locked).toBeUndefined());
    expect(steps[1].tip.content).toBe("CONTENU SECRET 2");
    expect(steps[1].moduleDetail).toBe(seed.steps[1].moduleDetail);
    expect((steps[1].quiz as unknown[]).length).toBeGreaterThan(0);
  });

  it("base indisponible : repli seed en aperçu pour les étapes 2+", async () => {
    pathFindUnique.mockRejectedValue(new Error("db down"));
    const { res, body } = await get();
    expect(res.status).toBe(200);
    (body.path.steps as ServedStep[]).slice(1).forEach(expectPreviewOnly);
    expect(JSON.stringify(body)).not.toContain("SECRET");
  });
});

describe("s24 mesure d'usage : étapes 2+ servies = premier accès Premium", () => {
  beforeEach(() => {
    usageFindFirst.mockReset().mockResolvedValue(null);
    usageCreate.mockReset().mockResolvedValue({});
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it("abonné : une ligne « parcours:<slug> », rien de personnel", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u-premium" } });
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    await get();
    expect(usageCreate).toHaveBeenCalledTimes(1);
    expect(usageCreate.mock.calls[0][0].data).toEqual(
      expect.objectContaining({ userId: "u-premium", type: "premier_acces_premium", detail: `parcours:${SLUG}`, dedupKey: "premier_acces_premium:u-premium:0" }),
    );
  });

  it("déjà noté depuis la dernière souscription : aucune écriture", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u-premium" } });
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    usageFindFirst.mockResolvedValue({ type: "premier_acces_premium", occurredAt: new Date() });
    await get();
    expect(usageCreate).not.toHaveBeenCalled();
  });

  it("anonyme ou compte gratuit : rien", async () => {
    await get();
    getServerSession.mockResolvedValue({ user: { id: "u-free" } });
    userFindUnique.mockResolvedValue({ plan: "FREE" });
    await get();
    expect(usageFindFirst).not.toHaveBeenCalled();
    expect(usageCreate).not.toHaveBeenCalled();
  });

  it("écriture en échec : réponse identique", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u-premium" } });
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    const { body: attendu } = await get();
    usageFindFirst.mockRejectedValue(new Error("relation absente"));
    const { res, body } = await get();
    expect(res.status).toBe(200);
    expect(body).toEqual(attendu);
  });
});
