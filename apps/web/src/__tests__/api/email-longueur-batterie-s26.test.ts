/**
 * @jest-environment node
 *
 * s26 batterie (`docs/qa/batterie-avant-lancement-s26.md`, défaut n°1) : un e-mail de 10 016 caractères créait un
 * compte. Borne de 254 caractères (RFC 5321) partout où une adresse entre : inscription (API et formulaire), connexion,
 * mot de passe oublié, réinitialisation. Adresse nettoyée (espaces, minuscules) avant la borne. Messages existants.
 */
// Base factice créée dans la fabrique : `lib/auth` lit `prisma` dès son chargement (adaptateur NextAuth).
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn(), update: jest.fn(), create: jest.fn() },
    verificationToken: { deleteMany: jest.fn(), create: jest.fn(), findFirst: jest.fn(), delete: jest.fn() },
  },
}));
const mockDb = (jest.requireMock("@/lib/prisma") as { prisma: Record<string, Record<string, jest.Mock>> }).prisma;
const sharedRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({
  ...jest.requireActual("@/lib/rate-limit"),
  sharedRateLimit: (...a: unknown[]) => sharedRateLimit(...a),
}));
jest.mock("@/lib/email", () => ({ sendPasswordResetEmail: jest.fn() }));
jest.mock("@/lib/password", () => ({ hash: async () => "hash", verify: async () => true }));
jest.mock("@/lib/admin-alerts", () => ({ recordAuthFailureAlert: jest.fn().mockResolvedValue(true) }));
jest.mock("@auth/prisma-adapter", () => ({ PrismaAdapter: () => ({}) }));

import { NextRequest } from "next/server";
import { POST as register } from "@/app/api/auth/register/route";
import { POST as forgot } from "@/app/api/auth/forgot-password/route";
import { POST as reset } from "@/app/api/auth/reset-password/route";
import { authorizeCredentials } from "@/lib/auth";
import { validateRegisterFields } from "@/lib/register-validation";
import { EMAIL_LONGUEUR_MAX } from "@/lib/email-longueur";
import { TEXTES_API } from "@/config/textes/compte";

const ok = { allowed: true, remaining: 1, resetAt: Date.now() + 60_000 };
/** Adresse de `n` caractères exactement, de forme valide. */
const adresse = (n: number) => `${"a".repeat(n - "@exemple.fr".length)}@exemple.fr`;
const LONGUE = adresse(10_016);
const LIMITE = adresse(EMAIL_LONGUEUR_MAX);

function req(path: string, body: unknown) {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json", "cf-connecting-ip": "1.2.3.4" },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  sharedRateLimit.mockResolvedValue(ok);
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

describe("s26 batterie : longueur de l'e-mail", () => {
  it("la borne vaut 254 (RFC 5321)", () => {
    expect(EMAIL_LONGUEUR_MAX).toBe(254);
    expect(LIMITE).toHaveLength(254);
  });

  it("inscription : 10 016 caractères refusés (400, message existant), aucun compte créé", async () => {
    const res = await register(req("/api/auth/register", { email: LONGUE, password: "motdepasse" }));
    expect(res.status).toBe(400);
    const corps = await res.json();
    expect(corps.error).toBe(TEXTES_API.donneesInvalides);
    expect(corps.details.some((d: { path: string[]; message: string }) => d.path[0] === "email" && d.message === "Email invalide")).toBe(true);
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
    expect(mockDb.user.create).not.toHaveBeenCalled();
  });

  it("inscription : 255 refusé, 254 accepté ; adresse nettoyée (espaces, minuscules) avant la borne", async () => {
    expect((await register(req("/api/auth/register", { email: adresse(255), password: "motdepasse" }))).status).toBe(400);
    mockDb.user.findUnique.mockResolvedValue(null);
    mockDb.user.create.mockResolvedValue({ id: "u1" });
    const res = await register(req("/api/auth/register", { email: `  ${LIMITE.toUpperCase()}  `, password: "motdepasse" }));
    expect(res.status).toBe(201);
    expect(mockDb.user.create.mock.calls[0][0].data.email).toBe(LIMITE);
  });

  it("formulaire d'inscription : même borne, message existant", () => {
    expect(validateRegisterFields({ email: LONGUE, password: "motdepasse" }).email).toBe("Cette adresse email a l’air bizarre. Tu peux vérifier ?");
    expect(validateRegisterFields({ email: LIMITE, password: "motdepasse" }).email).toBeUndefined();
  });

  it("connexion : au-delà de 254, identifiants refusés sans lecture ni limitation", async () => {
    expect(await authorizeCredentials({ email: LONGUE, password: "motdepasse" }, {})).toBeNull();
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
    expect(sharedRateLimit).not.toHaveBeenCalled();
  });

  it("mot de passe oublié : réponse habituelle, sans lecture ni clé de limitation démesurée", async () => {
    const res = await forgot(req("/api/auth/forgot-password", { email: LONGUE }));
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.");
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
    expect(sharedRateLimit).toHaveBeenCalledTimes(1); // limite par IP seulement
  });

  it("réinitialisation : au-delà de 254, 400 (message existant), aucune lecture", async () => {
    const res = await reset(req("/api/auth/reset-password", { token: "t", email: LONGUE, password: "motdepasse" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(TEXTES_API.donneesInvalides);
    expect(mockDb.verificationToken.findFirst).not.toHaveBeenCalled();
  });
});
