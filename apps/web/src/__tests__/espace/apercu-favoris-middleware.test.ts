/**
 * @jest-environment node
 *
 * Nav v6 (s25, lot B) : `/favoris` est une rubrique Premium de la bande. Interrupteur ouvert (SIMULÉ), le middleware
 * ne redirige plus le visiteur ni le compte sans Premium sur l'adresse exacte : la page sert l'aperçu (plan relu en
 * base). Fermé : la redirection d'aujourd'hui, inchangée (visiteur vers /login, gratuit vers /abonnement).
 */
import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
  },
}));

import middleware from "@/middleware";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const SECRET = "secret-de-test-apercu-favoris";

async function requete(chemin: string, plan?: "FREE" | "PREMIUM") {
  const headers: Record<string, string> = { host: "deviens-marrant.fr" };
  if (plan) {
    const jeton = await encode({ token: { sub: "u1", id: "u1", plan }, secret: SECRET });
    headers.cookie = `next-auth.session-token=${jeton}`;
  }
  return new NextRequest(new URL(chemin, "https://deviens-marrant.fr"), { headers });
}
const destination = (res: Response) => res.headers.get("location");

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = SECRET;
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
  delete process.env.NEXTAUTH_SECRET;
});

describe("/favoris et l'interrupteur", () => {
  it("ouvert : visiteur et gratuit passent sur l'adresse exacte (aperçu)", async () => {
    drapeau.__ESPACE_OUVERT__ = true;
    expect(destination(await middleware(await requete("/favoris")))).toBeNull();
    expect(destination(await middleware(await requete("/favoris", "FREE")))).toBeNull();
    expect(destination(await middleware(await requete("/favoris", "PREMIUM")))).toBeNull();
  });

  it("ouvert : une autre adresse sous /favoris garde la règle d'avant", async () => {
    drapeau.__ESPACE_OUVERT__ = true;
    expect(destination(await middleware(await requete("/favoris/x")))).toContain("/login");
  });

  it("fermé : redirections d'aujourd'hui", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    expect(destination(await middleware(await requete("/favoris")))).toContain("/login?callbackUrl=%2Ffavoris");
    expect(destination(await middleware(await requete("/favoris", "FREE")))).toContain("/abonnement?returnTo=%2Ffavoris");
    expect(destination(await middleware(await requete("/favoris", "PREMIUM")))).toBeNull();
  });
});
