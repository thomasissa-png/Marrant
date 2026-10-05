/**
 * @jest-environment node
 *
 * Tunnel s15 : un anonyme sur une page réservée arrive en UN saut sur la bonne
 * page (/register pour l'onboarding, /login pour profil et favoris).
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
  it("/onboarding → /register directement, destination et source conservées", async () => {
    const res = await middleware(request("/onboarding?src=blog-meilleures-blagues-droles-2026"));
    expect([302, 307]).toContain(res.status);
    const target = location(res);
    expect(target.pathname).toBe("/register");
    expect(target.searchParams.get("callbackUrl")).toBe("/onboarding?src=blog-meilleures-blagues-droles-2026");
    expect(target.searchParams.get("src")).toBe("blog-meilleures-blagues-droles-2026");
  });

  it("/onboarding sans paramètre → /register?callbackUrl=/onboarding", async () => {
    const res = await middleware(request("/onboarding"));
    const target = location(res);
    expect(target.pathname).toBe("/register");
    expect(target.searchParams.get("callbackUrl")).toBe("/onboarding");
    expect(target.searchParams.get("src")).toBeNull();
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
