/**
 * @jest-environment node
 *
 * s16 recos 14, 15, 16 : forgot-password, reset-password, register.
 * - jeton haché (SHA-256) en base, comparaison par hash, usage unique ;
 * - limitation partagée par cf-connecting-ip + 429 avec Retry-After ;
 * - messages d'erreur humains (plus de « Erreur serveur » / « Données invalides » / « Email requis »).
 */
const mockDb = {
  user: { findUnique: jest.fn(), update: jest.fn(), create: jest.fn() },
  verificationToken: { deleteMany: jest.fn(), create: jest.fn(), findFirst: jest.fn(), delete: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockDb;
  },
}));
const sharedRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({
  ...jest.requireActual("@/lib/rate-limit"),
  sharedRateLimit: (...a: unknown[]) => sharedRateLimit(...a),
}));
const sendPasswordResetEmail = jest.fn();
jest.mock("@/lib/email", () => ({ sendPasswordResetEmail: (...a: unknown[]) => sendPasswordResetEmail(...a) }));
jest.mock("@/lib/password", () => ({ hash: async () => "nouveau-hash" }));

import { NextRequest } from "next/server";
import { POST as forgot } from "@/app/api/auth/forgot-password/route";
import { POST as reset } from "@/app/api/auth/reset-password/route";
import { POST as register } from "@/app/api/auth/register/route";
import { hashResetToken } from "@/lib/reset-token";
import { TEXTES_API } from "@/config/textes/compte";

const ok = { allowed: true, remaining: 1, resetAt: Date.now() + 60_000 };
function req(path: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "content-type": "application/json", "cf-connecting-ip": "1.2.3.4", ...headers },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  sharedRateLimit.mockResolvedValue(ok);
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("forgot-password", () => {
  it("stocke le hash du jeton, envoie le jeton en clair dans le lien", async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: "u1", email: "a@b.fr", passwordHash: "h" });
    const res = await forgot(req("/api/auth/forgot-password", { email: "A@b.fr" }));
    expect(res.status).toBe(200);
    const stored = mockDb.verificationToken.create.mock.calls[0][0].data.token as string;
    const link = sendPasswordResetEmail.mock.calls[0][1] as string;
    const sent = new URL(link).searchParams.get("token") as string;
    expect(sent).toMatch(/^[0-9a-f]{64}$/);
    expect(stored).toBe(hashResetToken(sent));
    expect(stored).not.toBe(sent);
  });

  it("limite par cf-connecting-ip (jamais x-forwarded-for), 429 + Retry-After", async () => {
    sharedRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 30_000 });
    const res = await forgot(req("/api/auth/forgot-password", { email: "a@b.fr" }, { "x-forwarded-for": "6.6.6.6" }));
    expect(sharedRateLimit).toHaveBeenCalledWith("forgot-ip", "1.2.3.4", expect.anything());
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect((await res.json()).error).toBe(TEXTES_API.tropDeTentatives);
  });

  it("email absent ou corps illisible : message humain", async () => {
    for (const body of [{}, "pas du json"]) {
      const res = await forgot(req("/api/auth/forgot-password", body));
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe(TEXTES_API.emailRequis);
    }
  });
});

describe("reset-password", () => {
  const body = { token: "jeton-clair", email: "A@b.fr", password: "motdepasse8" };

  it("compare par hash puis supprime le jeton (usage unique)", async () => {
    mockDb.verificationToken.findFirst.mockResolvedValue({ identifier: "a@b.fr", token: hashResetToken("jeton-clair") });
    const res = await reset(req("/api/auth/reset-password", body));
    expect(res.status).toBe(200);
    expect(mockDb.verificationToken.findFirst.mock.calls[0][0].where).toMatchObject({
      identifier: "a@b.fr",
      token: hashResetToken("jeton-clair"),
    });
    expect(mockDb.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { email: "a@b.fr" } }));
    expect(mockDb.verificationToken.delete).toHaveBeenCalled();
  });

  it("jeton inconnu : 400 sans écriture", async () => {
    mockDb.verificationToken.findFirst.mockResolvedValue(null);
    const res = await reset(req("/api/auth/reset-password", body));
    expect(res.status).toBe(400);
    expect(mockDb.user.update).not.toHaveBeenCalled();
  });

  it("limité (partagé, cf-connecting-ip)", async () => {
    sharedRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 5_000 });
    const res = await reset(req("/api/auth/reset-password", body));
    expect(res.status).toBe(429);
    expect(sharedRateLimit).toHaveBeenCalledWith("reset-ip", "1.2.3.4", expect.anything());
  });

  it("mot de passe trop court : message de longueur ; autre champ : message humain", async () => {
    let res = await reset(req("/api/auth/reset-password", { ...body, password: "court" }));
    expect((await res.json()).error).toMatch(/8 caractères/);
    res = await reset(req("/api/auth/reset-password", { ...body, email: "pas-un-email" }));
    expect((await res.json()).error).toBe(TEXTES_API.donneesInvalides);
  });

  it("erreur base : message humain", async () => {
    mockDb.verificationToken.findFirst.mockRejectedValue(new Error("db"));
    const res = await reset(req("/api/auth/reset-password", body));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe(TEXTES_API.erreurServeur);
  });
});

describe("register", () => {
  it("limite partagée par cf-connecting-ip, 429 + Retry-After", async () => {
    sharedRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 60_000 });
    const res = await register(req("/api/auth/register", { name: "Al", email: "a@b.fr", password: "12345678" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
    expect(sharedRateLimit).toHaveBeenCalledWith("register-ip", "1.2.3.4", expect.anything());
  });

  it("données invalides et erreur serveur : messages humains, details conservés", async () => {
    let res = await register(req("/api/auth/register", { name: "A", email: "x", password: "1" }));
    const data = await res.json();
    expect(data.error).toBe(TEXTES_API.donneesInvalides);
    expect(Array.isArray(data.details)).toBe(true);
    mockDb.user.findUnique.mockRejectedValue(new Error("db"));
    res = await register(req("/api/auth/register", { name: "Al", email: "a@b.fr", password: "12345678" }));
    expect((await res.json()).error).toBe(TEXTES_API.erreurServeur);
  });
});
