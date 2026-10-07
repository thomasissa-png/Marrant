/**
 * @jest-environment node
 *
 * Lot H (07/10/2026), réserves de la revue croisée s16 :
 *  - contrôle Origin / Sec-Fetch-Site sur les routes qui changent un état
 *    (403 propre, appli mobile Capacitor acceptée, D8) ;
 *  - forgot-password : limite par adresse e-mail cible (hachée) en plus de l'IP.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const mockDb = {
  user: { findUnique: jest.fn(), findFirst: jest.fn() },
  subscription: { findUnique: jest.fn() },
  verificationToken: { deleteMany: jest.fn(), create: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockDb;
  },
}));
jest.mock("@/lib/stripe", () => ({
  createPortalSession: jest.fn(),
  getStripe: jest.fn(),
  createCheckoutSession: jest.fn(),
  AlreadySubscribedError: class extends Error {},
  PremiumPriceNotConfiguredError: class extends Error {},
}));
jest.mock("@/lib/account", () => ({ deleteAccount: jest.fn(), StripeCancelError: class extends Error {} }));
const sharedRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({
  ...jest.requireActual("@/lib/rate-limit"),
  sharedRateLimit: (...a: unknown[]) => sharedRateLimit(...a),
}));
const sendPasswordResetEmail = jest.fn();
jest.mock("@/lib/email", () => ({
  sendPasswordResetEmail: (...a: unknown[]) => sendPasswordResetEmail(...a),
  trySendTransactionalTextEmail: jest.fn(),
  ADMIN_EMAIL: "admin@example.fr",
}));

import { NextRequest } from "next/server";
import { isSameSiteRequest } from "@/lib/same-site";
import { TEXTES_SECURITE } from "@/config/textes/securite";
import { TEXTES_API } from "@/config/textes/compte";
import { DELETE as deleteUser } from "@/app/api/user/route";
import { POST as userPortal } from "@/app/api/user/subscription/portal/route";
import { POST as retractation } from "@/app/api/retractation/route";
import { POST as checkout } from "@/app/api/stripe/checkout/route";
import { POST as stripePortal } from "@/app/api/stripe/portal/route";
import { POST as forgot } from "@/app/api/auth/forgot-password/route";

const SITE = "https://deviens-marrant.fr";
function req(path: string, method: string, headers: Record<string, string> = {}, body?: unknown) {
  return new Request(`${SITE}${path}`, {
    method,
    headers: { "content-type": "application/json", ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.NEXTAUTH_URL = SITE;
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  getServerSession.mockResolvedValue(null);
  sharedRateLimit.mockResolvedValue({ allowed: true, remaining: 1, resetAt: Date.now() + 60_000 });
});
afterEach(() => jest.restoreAllMocks());

describe("isSameSiteRequest", () => {
  it("même origine, NEXTAUTH_URL, appli mobile Capacitor : acceptées", () => {
    expect(isSameSiteRequest(req("/x", "POST", { origin: SITE }))).toBe(true);
    expect(isSameSiteRequest(req("/x", "POST", { origin: "capacitor://localhost" }))).toBe(true);
    expect(isSameSiteRequest(req("/x", "POST", { origin: "https://localhost" }))).toBe(true);
    const preview = new Request("https://marrant.workers.dev/x", { method: "POST", headers: { origin: SITE } });
    expect(isSameSiteRequest(preview)).toBe(true);
  });

  it("autre site ou origine opaque (null) : refusées", () => {
    expect(isSameSiteRequest(req("/x", "POST", { origin: "https://evil.example" }))).toBe(false);
    expect(isSameSiteRequest(req("/x", "POST", { origin: "https://deviens-marrant.fr.evil.example" }))).toBe(false);
    expect(isSameSiteRequest(req("/x", "POST", { origin: "null" }))).toBe(false);
  });

  it("sans Origin : refus seulement si Sec-Fetch-Site = cross-site", () => {
    expect(isSameSiteRequest(req("/x", "POST", { "sec-fetch-site": "cross-site" }))).toBe(false);
    expect(isSameSiteRequest(req("/x", "POST", { "sec-fetch-site": "same-origin" }))).toBe(true);
    expect(isSameSiteRequest(req("/x", "POST"))).toBe(true);
  });
});

describe("routes qui changent un état : 403 propre depuis un autre site", () => {
  const evil = { origin: "https://evil.example", "sec-fetch-site": "cross-site" };
  const cas: Array<[string, () => Promise<Response>]> = [
    ["DELETE /api/user", () => deleteUser(req("/api/user", "DELETE", evil, { confirmation: "SUPPRIMER" }))],
    ["POST /api/user/subscription/portal", () => userPortal(req("/api/user/subscription/portal", "POST", evil, { parcours: "carte" }))],
    ["POST /api/retractation", () => retractation(req("/api/retractation", "POST", evil, { email: "a@b.fr" }))],
    ["POST /api/stripe/checkout", () => checkout(req("/api/stripe/checkout", "POST", evil))],
    ["POST /api/stripe/portal", () => stripePortal(req("/api/stripe/portal", "POST", evil))],
  ];

  it.each(cas)("%s : 403, texte du lot H, rien d'exécuté", async (_nom, appel) => {
    const res = await appel();
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: TEXTES_SECURITE.origineRefusee, code: "origine-refusee" });
    expect(getServerSession).not.toHaveBeenCalled();
    expect(sharedRateLimit).not.toHaveBeenCalled();
  });

  it("même site : la route continue (ici 401 faute de session)", async () => {
    const res = await stripePortal(req("/api/stripe/portal", "POST", { origin: SITE, "sec-fetch-site": "same-origin" }));
    expect(res.status).toBe(401);
  });

  it("appli mobile (capacitor://localhost) : pas de 403", async () => {
    const res = await checkout(req("/api/stripe/checkout", "POST", { origin: "capacitor://localhost", "sec-fetch-site": "cross-site" }));
    expect(res.status).toBe(401);
  });
});

describe("forgot-password : limite par adresse cible", () => {
  const forgotReq = (email: string, ip: string) =>
    new NextRequest(`${SITE}/api/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "content-type": "application/json", "cf-connecting-ip": ip },
    });

  it("compte l'adresse normalisée (clé hachée par le limiteur), en plus de l'IP", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    const res = await forgot(forgotReq(" Victime@Example.fr ", "9.9.9.9"));
    expect(res.status).toBe(200);
    expect(sharedRateLimit).toHaveBeenCalledWith("forgot-ip", "9.9.9.9", expect.anything());
    expect(sharedRateLimit).toHaveBeenCalledWith("forgot-email", "victime@example.fr", { maxRequests: 3, windowMs: 3_600_000 });
  });

  it("adresse cible saturée (IP changée) : 429, aucun e-mail, compte non recherché", async () => {
    sharedRateLimit.mockImplementation(async (scope: string) =>
      scope === "forgot-email"
        ? { allowed: false, remaining: 0, resetAt: Date.now() + 30_000 }
        : { allowed: true, remaining: 1, resetAt: Date.now() + 60_000 },
    );
    const res = await forgot(forgotReq("victime@example.fr", "8.8.8.8"));
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect((await res.json()).error).toBe(TEXTES_API.tropDeTentatives);
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
