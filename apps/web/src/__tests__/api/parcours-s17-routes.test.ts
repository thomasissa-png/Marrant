/**
 * @jest-environment node
 *
 * s17 (lot A) : routes de la préférence du rappel (profil, lot C), de l'arrêt
 * en un clic (C7), du quiz d'étape (série de pratique, D3) et du retour
 * d'exercice (3 valeurs fermées, C13).
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({
  sharedRateLimit: jest.fn().mockResolvedValue({ allowed: true, remaining: 1, resetAt: 0 }),
  retryAfterSeconds: () => 1,
}));

const db = {
  user: { findUnique: jest.fn(), update: jest.fn() },
  parcoursReminderPreference: { findUnique: jest.fn(), upsert: jest.fn(), updateMany: jest.fn() },
  learningPathStep: { findFirst: jest.fn() },
  userPathStepFeedback: { upsert: jest.fn(), findMany: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return db;
  },
}));

import { NextRequest } from "next/server";
import { GET as getPref, POST as postPref } from "@/app/api/user/rappel-parcours/route";
import { GET as getArret, POST as postArret } from "@/app/api/rappel-parcours/arret/route";
import { POST as postQuiz } from "@/app/api/parcours/[id]/quiz/route";
import { POST as postRetour } from "@/app/api/parcours/[id]/retour/route";
import { signerJetonArret } from "@/lib/rappels/rappel-parcours";
import { RAPPEL_PARCOURS_CONSENTEMENT } from "@/config/textes/parcours-emails";

function req(url: string, body?: unknown) {
  return new NextRequest(url, {
    method: body === undefined ? "GET" : "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json", origin: "https://deviens-marrant.fr" },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.UNSUBSCRIBE_HMAC_SECRET = "s".repeat(40);
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  db.user.findUnique.mockResolvedValue({ plan: "PREMIUM", streak: 0, lastPracticeAt: null });
  db.parcoursReminderPreference.findUnique.mockResolvedValue(null);
  db.parcoursReminderPreference.updateMany.mockResolvedValue({ count: 1 });
  db.learningPathStep.findFirst.mockResolvedValue({ id: "st1" });
});

describe("préférence du rappel /api/user/rappel-parcours", () => {
  const URL = "https://deviens-marrant.fr/api/user/rappel-parcours";

  it("GET : désactivé par défaut, texte et version du consentement, éligibilité", async () => {
    const body = await (await getPref()).json();
    expect(body).toMatchObject({ enabled: false, weekday: null, consentVersion: RAPPEL_PARCOURS_CONSENTEMENT.version, eligible: true });
  });

  it("activer sans Premium : 403, rien d'écrit", async () => {
    db.user.findUnique.mockResolvedValue({ plan: "FREE" });
    const res = await postPref(req(URL, { enabled: true, weekday: 2 }));
    expect(res.status).toBe(403);
    expect(db.parcoursReminderPreference.upsert).not.toHaveBeenCalled();
  });

  it("activer sans jour : 400", async () => {
    expect((await postPref(req(URL, { enabled: true }))).status).toBe(400);
  });

  it("activer (Premium) : date d'activation et version du texte enregistrées (preuve)", async () => {
    const res = await postPref(req(URL, { enabled: true, weekday: 2 }));
    expect(res.status).toBe(200);
    const args = db.parcoursReminderPreference.upsert.mock.calls[0][0];
    expect(args.create).toMatchObject({ userId: "u1", enabled: true, weekday: 2, consentVersion: RAPPEL_PARCOURS_CONSENTEMENT.version });
    expect(args.create.activatedAt).toBeInstanceOf(Date);
  });

  it("changer de jour : la date d'activation d'origine reste", async () => {
    db.parcoursReminderPreference.findUnique.mockResolvedValue({ enabled: true });
    await postPref(req(URL, { enabled: true, weekday: 5 }));
    expect(db.parcoursReminderPreference.upsert.mock.calls[0][0].update).toEqual({ enabled: true, weekday: 5 });
  });

  it("arrêter : toujours possible, origine profil", async () => {
    db.user.findUnique.mockResolvedValue({ plan: "FREE" });
    await postPref(req(URL, { enabled: false }));
    expect(db.parcoursReminderPreference.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ enabled: false, stopOrigin: "profil" }) }),
    );
  });

  it("anonyme : 401", async () => {
    getServerSession.mockResolvedValue(null);
    expect((await getPref()).status).toBe(401);
  });
});

describe("arrêt en un clic /api/rappel-parcours/arret (C7)", () => {
  const base = "https://deviens-marrant.fr/api/rappel-parcours/arret";

  it("GET jeton valide : arrêt immédiat sans connexion, origine lien-email, page tutoyée", async () => {
    getServerSession.mockResolvedValue(null);
    const res = await getArret(req(`${base}?token=${signerJetonArret("u7")}`));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("tu ne recevras plus le rappel");
    expect(db.parcoursReminderPreference.updateMany).toHaveBeenCalledWith({
      where: { userId: "u7", enabled: true },
      data: expect.objectContaining({ enabled: false, stopOrigin: "lien-email" }),
    });
    expect(db.user.update).not.toHaveBeenCalled(); // jamais emailOptOut
  });

  it("POST (RFC 8058) idempotent : déjà arrêté = 200", async () => {
    db.parcoursReminderPreference.updateMany.mockResolvedValue({ count: 0 });
    const res = await postArret(new NextRequest(`${base}?token=${signerJetonArret("u7")}`, { method: "POST" }));
    expect(res.status).toBe(200);
  });

  it("jeton invalide : 400, rien d'écrit", async () => {
    const res = await getArret(req(`${base}?token=abc.def`));
    expect(res.status).toBe(400);
    expect(db.parcoursReminderPreference.updateMany).not.toHaveBeenCalled();
  });
});

describe("quiz d'étape terminé → série de pratique (D3)", () => {
  const url = "https://deviens-marrant.fr/api/parcours/lp1/quiz";

  it("Premium : série à 1 pour une première pratique", async () => {
    const res = await postQuiz(req(url, { stepOrder: 1 }), { params: { id: "lp1" } });
    expect(await res.json()).toEqual({ streak: 1 });
    expect(db.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ streak: 1 }) }));
  });

  it("non-Premium : 403 ; visiteur : 401", async () => {
    db.user.findUnique.mockResolvedValue({ plan: "FREE" });
    expect((await postQuiz(req(url, { stepOrder: 1 }), { params: { id: "lp1" } })).status).toBe(403);
    getServerSession.mockResolvedValue(null);
    expect((await postQuiz(req(url, { stepOrder: 1 }), { params: { id: "lp1" } })).status).toBe(401);
  });
});

describe("retour d'exercice (PM-06, C13)", () => {
  const url = "https://deviens-marrant.fr/api/parcours/lp1/retour";

  it("valeur fermée acceptée et enregistrée", async () => {
    const res = await postRetour(req(url, { stepOrder: 2, retour: "essaye-bof" }), { params: { id: "lp1" } });
    expect(res.status).toBe(200);
    expect(db.userPathStepFeedback.upsert.mock.calls[0][0].create).toEqual({ userId: "u1", learningPathId: "lp1", stepOrder: 2, retour: "essaye-bof" });
  });

  it("texte libre refusé (400)", async () => {
    const res = await postRetour(req(url, { stepOrder: 2, retour: "je suis timide" }), { params: { id: "lp1" } });
    expect(res.status).toBe(400);
    expect(db.userPathStepFeedback.upsert).not.toHaveBeenCalled();
  });
});
