/**
 * @jest-environment node
 *
 * s16 (recos 13, 14, 15, 16) : `authorizeCredentials` et options NextAuth.
 * - limitation partagée par e-mail ET par IP (cf-connecting-ip) ;
 * - codes d'erreur distincts (trop d'essais, compte Google, serveur) ;
 * - aucun e-mail dans les logs ; plus de liaison Google automatique ;
 * - alerte admin `auth-connexion-google` (lot A) sur les erreurs OAuth.
 */
const findUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: (...a: unknown[]) => findUnique(...a) } } }));
const verify = jest.fn();
jest.mock("@/lib/password", () => ({ verify: (...a: unknown[]) => verify(...a) }));
const sharedRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({
  ...jest.requireActual("@/lib/rate-limit"),
  sharedRateLimit: (...a: unknown[]) => sharedRateLimit(...a),
}));
const recordAuthFailureAlert = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/admin-alerts", () => ({ recordAuthFailureAlert: (...a: unknown[]) => recordAuthFailureAlert(...a) }));
jest.mock("@auth/prisma-adapter", () => ({ PrismaAdapter: () => ({}) }));

import { authOptions, authorizeCredentials, describeAuthError, isOAuthFailure } from "@/lib/auth";
import { LOGIN_ERROR_CODES } from "@/config/textes/compte";

const ok = { allowed: true, remaining: 5, resetAt: 0 };
const ko = { allowed: false, remaining: 0, resetAt: 0 };
const creds = { email: " Alice@Exemple.FR ", password: "motdepasse" };
const headers = { "cf-connecting-ip": "1.2.3.4", "x-forwarded-for": "6.6.6.6" };

let logs: string[];
beforeEach(() => {
  jest.clearAllMocks();
  sharedRateLimit.mockResolvedValue(ok);
  logs = [];
  for (const m of ["log", "warn", "error"] as const) {
    jest.spyOn(console, m).mockImplementation((...a: unknown[]) => void logs.push(a.map(String).join(" ")));
  }
});
afterEach(() => {
  jest.restoreAllMocks();
  expect(logs.join("\n")).not.toMatch(/alice@exemple\.fr/i);
});

describe("authorizeCredentials", () => {
  it("succès : utilisateur renvoyé, limites par e-mail normalisé et par cf-connecting-ip", async () => {
    findUnique.mockResolvedValue({ id: "u1", email: "alice@exemple.fr", name: "A", image: null, passwordHash: "h" });
    verify.mockResolvedValue(true);
    await expect(authorizeCredentials(creds, headers)).resolves.toEqual({ id: "u1", email: "alice@exemple.fr", name: "A", image: null });
    expect(sharedRateLimit).toHaveBeenCalledWith("login-email", "alice@exemple.fr", expect.anything());
    expect(sharedRateLimit).toHaveBeenCalledWith("login-ip", "1.2.3.4", expect.anything());
  });

  it("mauvais mot de passe ou compte inconnu : null (CredentialsSignin)", async () => {
    findUnique.mockResolvedValueOnce(null);
    await expect(authorizeCredentials(creds, headers)).resolves.toBeNull();
    findUnique.mockResolvedValueOnce({ id: "u1", passwordHash: "h" });
    verify.mockResolvedValueOnce(false);
    await expect(authorizeCredentials(creds, headers)).resolves.toBeNull();
  });

  it("trop d'essais (e-mail ou IP) : code dédié, base non interrogée", async () => {
    sharedRateLimit.mockResolvedValueOnce(ko);
    await expect(authorizeCredentials(creds, headers)).rejects.toThrow(LOGIN_ERROR_CODES.tropDEssais);
    sharedRateLimit.mockResolvedValueOnce(ok).mockResolvedValueOnce(ko);
    await expect(authorizeCredentials(creds, headers)).rejects.toThrow(LOGIN_ERROR_CODES.tropDEssais);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("compte Google sans mot de passe : null, comme des identifiants faux (lot F, aucune fuite)", async () => {
    findUnique.mockResolvedValue({ id: "u2", passwordHash: null });
    await expect(authorizeCredentials(creds, headers)).resolves.toBeNull();
    expect(verify).not.toHaveBeenCalled();
    expect(Object.values(LOGIN_ERROR_CODES)).not.toContain("CompteGoogleSansMotDePasse");
  });

  it("erreur base : code serveur (pas « identifiants incorrects »)", async () => {
    findUnique.mockRejectedValue(new Error("db"));
    await expect(authorizeCredentials(creds, headers)).rejects.toThrow(LOGIN_ERROR_CODES.serveur);
  });

  it("champs manquants : null sans appel au limiteur", async () => {
    await expect(authorizeCredentials(undefined, {})).resolves.toBeNull();
    expect(sharedRateLimit).not.toHaveBeenCalled();
  });
});

describe("authOptions", () => {
  it("Google sans liaison automatique de compte (reco 13)", () => {
    const google = authOptions.providers.find((p) => p.id === "google") as unknown as { options: Record<string, unknown> };
    expect(google.options.allowDangerousEmailAccountLinking).toBeFalsy();
  });

  it("erreur OAuth : alerte admin auth-connexion-google ; autres erreurs : pas d'alerte", () => {
    authOptions.logger?.error?.("OAUTH_CALLBACK_ERROR", { error: new Error("invalid_grant"), providerId: "google" } as never);
    expect(recordAuthFailureAlert).toHaveBeenCalledWith("OAUTH_CALLBACK_ERROR", "provider=google Error: invalid_grant");
    recordAuthFailureAlert.mockClear();
    authOptions.logger?.error?.("JWT_SESSION_ERROR", new Error("bad jwt") as never);
    expect(recordAuthFailureAlert).not.toHaveBeenCalled();
  });

  it("describeAuthError / isOAuthFailure", () => {
    expect(describeAuthError({ error: new Error("boom"), providerId: "google" })).toBe("provider=google Error: boom");
    expect(isOAuthFailure("SIGNIN_OAUTH_ERROR")).toBe(true);
    expect(isOAuthFailure("JWT_SESSION_ERROR")).toBe(false);
  });
});
