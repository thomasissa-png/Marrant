/**
 * Tests — _helpers.ts admin/ceo (verifyAdmin + hashTarget)
 *
 * Couvre l'auth Bearer ADMIN_PASSWORD partagée par les 6 routes.
 */

import { verifyAdmin, hashTarget } from "@/app/api/admin/ceo/_helpers";

function fakeReq(authHeader: string | null) {
  return {
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "authorization" ? authHeader : null,
    },
  } as unknown as import("next/server").NextRequest;
}

describe("admin/ceo/_helpers — verifyAdmin", () => {
  const ORIGINAL_ENV = process.env.ADMIN_PASSWORD;

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = ORIGINAL_ENV;
  });

  it("retourne false si ADMIN_PASSWORD non défini", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(verifyAdmin(fakeReq("Bearer anything"))).toBe(false);
  });

  it("retourne false si pas de header Authorization", () => {
    process.env.ADMIN_PASSWORD = "secret-pass";
    expect(verifyAdmin(fakeReq(null))).toBe(false);
  });

  it("retourne false si header sans préfixe Bearer", () => {
    process.env.ADMIN_PASSWORD = "secret-pass";
    expect(verifyAdmin(fakeReq("secret-pass"))).toBe(false);
  });

  it("retourne false si mot de passe différent", () => {
    process.env.ADMIN_PASSWORD = "secret-pass";
    expect(verifyAdmin(fakeReq("Bearer wrong-pass"))).toBe(false);
  });

  it("retourne true avec Bearer + bon password", () => {
    process.env.ADMIN_PASSWORD = "secret-pass";
    expect(verifyAdmin(fakeReq("Bearer secret-pass"))).toBe(true);
  });

  it("est sensible à la casse du préfixe (security)", () => {
    process.env.ADMIN_PASSWORD = "secret-pass";
    expect(verifyAdmin(fakeReq("bearer secret-pass"))).toBe(false);
  });
});

describe("admin/ceo/_helpers — hashTarget", () => {
  it("retourne un sha256 hex 64 chars", () => {
    const h = hashTarget("user@example.com");
    expect(h).toMatch(/^[a-f0-9]{64}$/);
  });

  it("est déterministe pour le même input", () => {
    expect(hashTarget("test@x.fr")).toBe(hashTarget("test@x.fr"));
  });

  it("change pour des inputs différents", () => {
    expect(hashTarget("a@x.fr")).not.toBe(hashTarget("b@x.fr"));
  });

  it("gère les chaînes vides", () => {
    expect(hashTarget("")).toMatch(/^[a-f0-9]{64}$/);
  });

  it("gère les chaînes UTF-8 (accents)", () => {
    const h = hashTarget("élève@français.fr");
    expect(h).toMatch(/^[a-f0-9]{64}$/);
  });
});
