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
    // s21 (QA v3 m-1) : source fixe de la redirection, la `src` d'arrivée n'est pas relayée.
    expect(target.search).toBe("?src=onboarding-visiteur");
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

describe("middleware : compte Premium sur /abonnement* (QA conversion s21, m2)", () => {
  async function requetePremium(path: string) {
    const { encode } = await import("next-auth/jwt");
    const jeton = await encode({ token: { sub: "user-1", plan: "PREMIUM" }, secret: process.env.NEXTAUTH_SECRET! });
    return new NextRequest(new URL(path, "https://deviens-marrant.fr"), {
      headers: { host: "deviens-marrant.fr", cookie: `next-auth.session-token=${jeton}` },
    });
  }

  it("/abonnement/success n'est PAS renvoyé vers /vannes (favori, bienvenue et retour d'origine gardés)", async () => {
    const res = await middleware(await requetePremium("/abonnement/success?session_id=cs_1&returnTo=%2Fvannes%3Ffavori%3DJOKE.j1"));
    expect(res.headers.get("location")).toBeNull();
  });

  it.each(["/abonnement", "/abonnement?src=header", "/abonnement/autre"])("%s → /vannes, comme avant", async (path) => {
    const res = await middleware(await requetePremium(path));
    expect(location(res).pathname).toBe("/vannes");
  });
});
