/**
 * @jest-environment node
 *
 * Tunnel s15 : un anonyme sur une page réservée arrive en UN saut sur la bonne
 * page (/abonnement pour l'onboarding depuis s15, /login pour profil et favoris).
 */
import { NextRequest } from "next/server";
import middleware from "@/middleware";

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "secret-de-test-middleware-s15";
});

afterAll(() => {
  delete process.env.NEXTAUTH_SECRET;
});

function request(path: string) {
  return new NextRequest(new URL(path, "https://deviens-marrant.fr"), {
    headers: { host: "deviens-marrant.fr" },
  });
}

function location(res: Response): URL {
  return new URL(res.headers.get("location") ?? "", "https://deviens-marrant.fr");
}

describe("middleware : anonyme sur une page réservée", () => {
  it("/onboarding sans session → /abonnement (réservé aux comptes, proposé après l'abonnement, s15 §2.5)", async () => {
    const res = await middleware(request("/onboarding?src=blog-meilleures-blagues-droles-2026"));
    expect([302, 307]).toContain(res.status);
    const target = location(res);
    expect(target.pathname).toBe("/abonnement");
    expect(target.search).toBe("");
  });

  it("/onboarding sans paramètre → /abonnement, jamais /register", async () => {
    const res = await middleware(request("/onboarding"));
    const target = location(res);
    expect(target.pathname).toBe("/abonnement");
  });

  it.each(["/profil", "/favoris"])("%s → /login en un saut (plus /api/auth/signin)", async (path) => {
    const res = await middleware(request(path));
    const target = location(res);
    expect(target.pathname).toBe("/login");
    expect(target.searchParams.get("callbackUrl")).toContain(path);
  });

  it("/abonnement reste public pour un anonyme", async () => {
    const res = await middleware(request("/abonnement?plan=annual"));
    expect(res.headers.get("location")).toBeNull();
  });
});
