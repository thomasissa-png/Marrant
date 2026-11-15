/**
 * @jest-environment node
 *
 * Navigation v6, tour 2, point 10 : interrupteur ouvert (SIMULÉ), `/mon-espace/lettres` renvoie à `/lettre` en 308
 * pour TOUS (visiteur, compte gratuit, abonné), sans passer par la garde de l'espace. Fermé : la réécriture vers la
 * 404 d'aujourd'hui, inchangée. Les fiches `/mon-espace/lettres/[numero]` ne sont pas concernées.
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
const SECRET = "secret-de-test-lettres-v6-tour2";

async function requete(chemin: string, plan?: "FREE" | "PREMIUM") {
  const headers: Record<string, string> = { host: "deviens-marrant.fr" };
  if (plan) {
    const jeton = await encode({ token: { sub: "u1", id: "u1", plan }, secret: SECRET });
    headers.cookie = `next-auth.session-token=${jeton}`;
  }
  return new NextRequest(new URL(chemin, "https://deviens-marrant.fr"), { headers });
}

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = SECRET;
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
  delete process.env.NEXTAUTH_SECRET;
});

describe("/mon-espace/lettres et l'interrupteur", () => {
  it.each([undefined, "FREE", "PREMIUM"] as const)("ouvert, compte %s : 308 vers /lettre", async (plan) => {
    drapeau.__ESPACE_OUVERT__ = true;
    const res = await middleware(await requete("/mon-espace/lettres", plan));
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/lettre");
  });

  it("ouvert : une fiche de lettre garde son adresse (pas de redirection)", async () => {
    drapeau.__ESPACE_OUVERT__ = true;
    const res = await middleware(await requete("/mon-espace/lettres/12"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("fermé : la 404 d'aujourd'hui (réécriture), aucune redirection", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    const res = await middleware(await requete("/mon-espace/lettres"));
    expect(res.headers.get("location")).toBeNull();
    expect(res.headers.get("x-middleware-rewrite")).toContain("/_espace-ferme");
  });
});
